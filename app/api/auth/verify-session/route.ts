import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verify } from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const { sessionToken } = await req.json();

    // Verify session token
    const decoded = verify(sessionToken, process.env.NEXTAUTH_SECRET!) as {
      userId: string;
      email: string;
    };

    // Find user and their active verification token
    const [user, verificationToken] = await Promise.all([
      prisma.user.findUnique({
        where: { id: decoded.userId },
        select: { email: true, emailVerified: true },
      }),
      prisma.verificationToken.findFirst({
        where: {
          userId: decoded.userId,
          expires: { gt: new Date() },
        },
        orderBy: { expires: "desc" },
        select: { expires: true },
      }),
    ]);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.emailVerified) {
      return NextResponse.json(
        { error: "Email already verified" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      email: user.email,
      verificationExpires: verificationToken?.expires.toISOString() || null,
    });
  } catch (error) {
    console.error("Session Verification Error:", error);
    if (error instanceof Error && error.name === "JsonWebTokenError") {
      return NextResponse.json(
        { error: "Invalid session token" },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
