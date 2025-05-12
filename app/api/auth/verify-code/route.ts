import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verify } from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const { code, sessionToken } = await req.json();

    // Verify session token
    const decoded = verify(sessionToken, process.env.NEXTAUTH_SECRET!) as {
      userId: string;
      email: string;
    };

    // Transaction to ensure atomicity
    const result = await prisma.$transaction(async (tx) => {
      // Find verification token
      const verificationRecord = await tx.verificationToken.findFirst({
        where: {
          token: code,
          userId: decoded.userId,
          expires: { gt: new Date() },
        },
      });

      if (!verificationRecord) {
        throw new Error("Invalid or expired verification code");
      }

      // Update user verification status
      await tx.user.update({
        where: { id: decoded.userId },
        data: { emailVerified: new Date() },
      });

      // Delete all verification tokens for this user
      await tx.verificationToken.deleteMany({
        where: { userId: decoded.userId },
      });

      return verificationRecord;
    });

    return NextResponse.json({
      message: "Email verified successfully",
      verificationExpires: result.expires.toISOString(),
    });
  } catch (error) {
    console.error("Verification Error:", error);

    if (error instanceof Error) {
      if (
        error.name === "JsonWebTokenError" ||
        error.name === "TokenExpiredError"
      ) {
        return NextResponse.json(
          { error: "Invalid or expired session" },
          { status: 401 }
        );
      }
      if (error.message === "Invalid or expired verification code") {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
