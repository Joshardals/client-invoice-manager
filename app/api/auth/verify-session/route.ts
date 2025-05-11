import { verify } from "jsonwebtoken";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { sessionToken } = await req.json();

    const decoded = verify(sessionToken, process.env.NEXTAUTH_SECRET!) as {
      userId: string;
      email: string;
    };

    // Check if user exists and their verification status
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { emailVerified: true, email: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    // If email is already verified, don't allow access to verification page
    if (user.emailVerified) {
      return NextResponse.json(
        { error: "Email already verified" },
        { status: 403 }
      );
    }

    return NextResponse.json({
      email: user.email,
      userId: decoded.userId,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid or expired session" },
      { status: 401 }
    );
  }
}
