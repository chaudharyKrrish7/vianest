"use server";

import { db } from "../../lib/db";
import { getSession } from "../../lib/session";
import { z } from "zod";
import { revalidatePath } from "next/cache";

// Strict validation for business details
const profileSchema = z.object({
  agencyName: z.string().min(2, "Agency name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  gstNumber: z.string()
    .length(15, "Indian GST Number must be exactly 15 characters long.")
    .toUpperCase() // Force uppercase for database consistency
    .or(z.literal("")), // Allow empty if they don't have GST yet
  address: z.string().optional(),
});

export async function updateProfile(formData: FormData) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  // 1. Extract data and log it so we can see what is happening
  const rawData = Object.fromEntries(formData.entries());
  console.log("Raw form data received:", rawData);

  // 2. Validate
  const validatedData = profileSchema.safeParse(rawData);

  if (!validatedData.success) {
    console.error("Zod Validation Failed:", validatedData.error);
    
    // Safely extract the error message without crashing
    const errorMessage = validatedData.error.issues?.[0]?.message || "Please check your form details and try again.";
    throw new Error(errorMessage);
  }

  // 3. Update the user in the database
  await db.user.update({
    where: { id: session.userId },
    data: {
      agencyName: validatedData.data.agencyName,
      email: validatedData.data.email,
      gstNumber: validatedData.data.gstNumber || null,
      address: validatedData.data.address || null,
    }
  });

  // 4. Refresh the page
  revalidatePath("/dashboard/profile");
}