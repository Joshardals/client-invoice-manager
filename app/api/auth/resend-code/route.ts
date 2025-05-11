import { verify } from "jsonwebtoken";
import { NextResponse } from "next/server";
import { addMinutes } from "date-fns";
import prisma from "@/lib/prisma";
import { generateVerificationCode } from "@/lib/utils";
import { sendVerificationMail } from "@/lib/mailer";

export async function POST(req: Request) {
  try {
    const { sessionToken } = await req.json();

    // Verify the session token
    const decoded = verify(sessionToken, process.env.NEXTAUTH_SECRET!) as {
      userId: string;
      email: string;
    };

    // Check if user exists and is still unverified
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if the user is already verified
    if (user.emailVerified) {
      return NextResponse.json(
        { error: "Email is already verified" },
        { status: 400 }
      );
    }

    // Delete any existing verification tokens for this user
    await prisma.verificationToken.deleteMany({
      where: { userId: user.id },
    });

    // Generate and save new verification code
    const newVerificationCode = generateVerificationCode();
    await prisma.verificationToken.create({
      data: {
        token: newVerificationCode,
        userId: user.id,
        expires: addMinutes(new Date(), 10),
      },
    });

    // Send new verification code
    await sendVerificationMail(user.email, newVerificationCode);

    return NextResponse.json({
      message: "New verification code sent successfully",
    });
  } catch (error: any) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return NextResponse.json(
        { error: "Invalid or expired session" },
        { status: 401 }
      );
    }

    console.error("Resend Code Error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
