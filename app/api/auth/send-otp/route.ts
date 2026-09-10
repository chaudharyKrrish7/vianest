import { NextResponse } from "next/server";
import { db } from "../../../lib/db";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { phone } = await req.json();

    if (!phone || phone.length < 10) {
      return NextResponse.json({ error: "Invalid phone number" }, { status: 400 });
    }

    // 1. TEMP FOR TESTING: Hardcoded OTP so you can log in from any device
    // const generatedOtp = crypto.randomInt(100000, 999999).toString();
    const generatedOtp = "123456"; 
    
    // 2. Set expiration time to 5 minutes from now
    const expiryTime = new Date(Date.now() + 5 * 60 * 1000); 

    // 3. Upsert the user in the database with the new OTP
    await db.user.upsert({
      where: { phone },
      update: {
        otp: generatedOtp,
        otpExpiry: expiryTime,
      },
      create: {
        phone,
        otp: generatedOtp,
        otpExpiry: expiryTime,
      }
    });

    if (process.env.FAST2SMS_API_KEY) {
      const smsResponse = await fetch("https://www.fast2sms.com/dev/bulkV2", {
        method: "POST",
        headers: {
          "authorization": process.env.FAST2SMS_API_KEY,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          route: "otp",
          variables_values: generatedOtp,
          numbers: phone,
        })
      });

      const smsData = await smsResponse.json();
      
      if (!smsData.return) {
        console.error("Fast2SMS API Error:", smsData);
        console.log(`[FALLBACK MOCK] OTP: ${generatedOtp} for ${phone}`);
      }
    } else {
      console.log(`[SMS MOCK] OTP: ${generatedOtp} for ${phone}`);
    }

    return NextResponse.json({ success: true, message: "OTP sent successfully" });

  } catch (error) {
    console.error("Failed to send OTP:", error);
    return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 });
  }
}