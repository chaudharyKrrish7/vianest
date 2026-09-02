import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SignJWT } from "jose";
import { db } from "../../../lib/db";

export async function POST(req: Request) {
  try {
    const { phone, otp } = await req.json();

    // 1. Verify the OTP (Using our dev mock code "123456")
    if (otp !== "123456") {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 401 });
    }

    // 2. Fetch the user from the database
    const user = await db.user.findUnique({
      where: { phone },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 3. Create a secure JWT token
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const token = await new SignJWT({ 
      userId: user.id, 
      role: user.role, 
      status: user.status 
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("24h") // Session lasts 24 hours
      .sign(secret);

    // 4. Set the HTTP-Only cookie
    (await cookies()).set("vianest_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    });

    return NextResponse.json({ success: true, message: "Logged in successfully", role: user.role });
  } catch (error) {
    console.error("Verification Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}