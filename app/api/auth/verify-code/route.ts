import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verify } from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const { code, sessionToken } = await req.json();

    // Verify session token first
    const decoded = verify(sessionToken, process.env.NEXTAUTH_SECRET!) as {
      userId: string;
      email: string;
      exp?: number; // Optional expiration check
    };

    // Find verification token
    const verificationRecord = await prisma.verificationToken.findUnique({
      where: {
        token: code,
        userId: decoded.userId, // Ensure the code belongs to this user
      },
    });

    if (!verificationRecord) {
      return NextResponse.json(
        { error: "Invalid verification code" },
        { status: 400 }
      );
    }

    // Check if token has expired
    if (verificationRecord.expires < new Date()) {
      // Clean up expired token
      await prisma.verificationToken.delete({
        where: { token: code },
      });

      return NextResponse.json(
        { error: "Verification code has expired" },
        { status: 400 }
      );
    }

    // Update user verification status
    await prisma.user.update({
      where: { id: verificationRecord.userId },
      data: { emailVerified: new Date() },
    });

    // Delete all verification tokens for this user
    await prisma.verificationToken.deleteMany({
      where: { userId: decoded.userId },
    });

    // Set session token expiration to now
    decoded.exp = Math.floor(Date.now() / 1000);

    return NextResponse.json({
      message: "Email verified successfully",
      sessionExpired: true,
    });
  } catch (error) {
    console.error("Verification Error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
