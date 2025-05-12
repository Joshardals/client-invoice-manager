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

    // Check if user exists and get current verification status
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        emailVerified: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.emailVerified) {
      return NextResponse.json(
        { error: "Email is already verified" },
        { status: 400 }
      );
    }

    // Check for rate limiting
    const recentToken = await prisma.verificationToken.findFirst({
      where: {
        userId: user.id,
        createdAt: {
          gt: new Date(),
        },
      },
    });

    if (recentToken) {
      return NextResponse.json(
        { error: "Please wait before requesting a new code" },
        { status: 429 }
      );
    }

    // Transaction to ensure atomicity
    const result = await prisma.$transaction(async (tx) => {
      // Delete existing tokens
      await tx.verificationToken.deleteMany({
        where: { userId: user.id },
      });

      // Generate new verification token
      const expires = addMinutes(new Date(), 10);
      const newVerificationCode = generateVerificationCode();

      const token = await tx.verificationToken.create({
        data: {
          token: newVerificationCode,
          userId: user.id,
          expires,
          createdAt: new Date(),
        },
      });

      // Send email
      await sendVerificationMail(user.email, newVerificationCode);

      return token;
    });

    return NextResponse.json({
      message: "New verification code sent successfully",
      verificationExpires: result.expires.toISOString(),
    });
  } catch (error) {
    console.error("Resend Code Error:", error);

    if (
      error instanceof Error &&
      (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError")
    ) {
      return NextResponse.json(
        { error: "Invalid or expired session" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
