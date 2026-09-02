import { NextResponse } from "next/server";
import { db } from "../../../lib/db";

export async function POST(req: Request) {
  try {
    const { phone } = await req.json();

    if (!phone || phone.length !== 10) {
      return NextResponse.json({ error: "Invalid phone number format" }, { status: 400 });
    }

    // Check if user exists in database, or create them as a PENDING AGENT
    let user = await db.user.findUnique({
      where: { phone },
    });

    if (!user) {
      user = await db.user.create({
        data: {
          phone,
          status: "PENDING_VERIFICATION",
          role: "AGENT",
        },
      });
    }

    // Generate a mock 6-digit OTP for development
    const mockOtp = "123456";
    console.log(`[DEV-OTP] Code for ${phone}: ${mockOtp}`);

    return NextResponse.json({ 
      success: true, 
      message: "OTP sent successfully",
      // Sending back in response for easy local testing
      developmentOtp: mockOtp 
    });
  } catch (error) {
    console.error("OTP Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}