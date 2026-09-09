"use server";

import { db } from "../../lib/db";
import { getSession } from "../../lib/session";
import { redirect } from "next/navigation";
import { z } from "zod";

// 1. Define the strict rules for our incoming data
const bookingSchema = z.object({
  flightNo: z.string().min(2, "Flight number is required"),
  price: z.coerce.number().positive("Price must be greater than zero"),
  firstName: z.string().min(2, "First name must be at least 2 characters").trim(),
  lastName: z.string().min(2, "Last name must be at least 2 characters").trim(),
});

export async function processBooking(formData: FormData) {
  const session = await getSession();
  if (!session) redirect("/login");

  // 2. Extract and validate data using Zod
  const rawData = Object.fromEntries(formData.entries());
  const validatedData = bookingSchema.safeParse(rawData);

  if (!validatedData.success) {
    // If someone messed with the form, we throw an error with the exact reason
    throw new Error(validatedData.error.issues[0].message);
  }

  const { flightNo, price, firstName, lastName } = validatedData.data;

  // 3. Fetch user and verify they have enough funds
  const user = await db.user.findUnique({ where: { id: session.userId } });
  
  if (!user || Number(user.walletBalance) < price) {
    throw new Error(`Insufficient funds. Your balance is ₹${user?.walletBalance.toString()}, but this ticket costs ₹${price}.`);
  }

  const currentBalance = Number(user.walletBalance);
  const newBalance = currentBalance - price;
  const bookingId = "VNT-" + Math.random().toString(36).substring(2, 8).toUpperCase();

  // --- ADD THIS BLOCK RIGHT ABOVE THE TRANSACTION ---
  const settings = await db.platformSettings.findUnique({ where: { id: "global" } });
  const markupAmount = settings ? Number(settings.flightMarkup) : 300;
  
  // Calculate the net fare based on whatever the agent is paying minus your markup
  const netFare = price - markupAmount;
  // 4. The Atomic Transaction
  await db.$transaction([
    db.user.update({
      where: { id: session.userId },
      data: { walletBalance: newBalance }
    }),
    
    db.walletTransaction.create({
      data: {
        agentId: session.userId,
        amount: price,
        type: "DEBIT",
        description: `Flight Booking - ${flightNo}`,
        runningBalance: newBalance,
        referenceId: bookingId,
      }
    }),
    
    db.booking.create({
      data: {
        id: bookingId,
        agentId: session.userId,
        status: "CONFIRMED",
        tripjackPnr: bookingId, 
        netAmount: netFare,
        agentMarkup: markupAmount,
        grossAmount: price,
        travelDate: new Date(),
        passengers: {
          create: {
            firstName,
            lastName,
            type: "ADULT",
          }
        }
      }
    })
  ]);

  redirect("/dashboard/bookings");
}