import { NextResponse } from "next/server";
import { db } from "../../../lib/db";
import { SignJWT } from "jose";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { phone, otp } = await req.json();

    // 1. Find the user and their saved OTP
    const user = await db.user.findUnique({ where: { phone } });

    if (!user || !user.otp || !user.otpExpiry) {
      return NextResponse.json({ error: "No OTP requested for this number" }, { status: 400 });
    }

    // 2. Check if the OTP is correct
    if (user.otp !== otp) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 401 });
    }

    // 3. Check if the OTP has expired
    if (new Date() > user.otpExpiry) {
      return NextResponse.json({ error: "OTP has expired. Please request a new one." }, { status: 401 });
    }

    // 4. Clear the OTP from the database so it can't be reused
    await db.user.update({
      where: { id: user.id },
      data: { otp: null, otpExpiry: null }
    });

    // 5. Generate the Session JWT (Your existing logic)
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const token = await new SignJWT({ userId: user.id, role: user.role, status: user.status })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("24h")
      .sign(secret);

    const cookieStore = await cookies();
    cookieStore.set("vianest_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Verification failed:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}