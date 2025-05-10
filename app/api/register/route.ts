import { addMinutes } from "date-fns";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

import { resend } from "@/lib/resend";
import { generateVerificationCode } from "@/lib/utils";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, name } = body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Hash the user's password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user in the database
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    // Generate a 6-digit verification code
    const verificationCode = generateVerificationCode();

    // Store the verification code and it's expiration time in the database
    await prisma.verificationToken.create({
      data: {
        token: verificationCode,
        userId: user.id,
        expires: addMinutes(new Date(), 10),
      },
    });

    // Send the verification code to the user's email using Resend
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Verify your email",
      html: `
        <h2>Welcome!</h2>
        <p>Please verify your email address by entering this code:</p>
        <h3 style="font-size: 24px; letter-spacing: 2px; background: #f4f4f4; padding: 10px; display: inline-block;">${verificationCode}</h3>
        <p>This code will expire in 10 minutes.</p>
        <p>If you didn't create an account, please ignore this email.</p>
      `,
    });

    // return NextResponse.json({ message: "User registered", user });
    return NextResponse.json({
      message: "Verification code sent",
      userId: user.id, // Only send non-sensitive data back
    });
  } catch (err) {
    console.error("Register Error:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
