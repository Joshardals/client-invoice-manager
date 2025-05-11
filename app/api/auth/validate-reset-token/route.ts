import { NextResponse } from "next/server";
import { verify } from "jsonwebtoken";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { token } = await req.json();

    // Verify JWT token
    const decoded = verify(token, process.env.NEXTAUTH_SECRET!) as {
      userId: string;
      type: string;
    };

    if (decoded.type !== "password_reset") {
      return NextResponse.json(
        { error: "Invalid reset token" },
        { status: 400 }
      );
    }

    // Check if token exists and hasn't been used
    const resetToken = await prisma.passwordReset.findFirst({
      where: {
        token,
        used: false,
        expires: {
          gt: new Date(),
        },
      },
    });

    if (!resetToken) {
      return NextResponse.json(
        { error: "Invalid or expired reset token" },
        { status: 400 }
      );
    }

    return NextResponse.json({ valid: true });
  } catch (error) {
    return NextResponse.json({ error: "Invalid reset token" }, { status: 400 });
  }
}
