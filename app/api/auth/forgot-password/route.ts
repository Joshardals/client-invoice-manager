import { NextResponse } from "next/server";
import { sign } from "jsonwebtoken";
import { addMinutes } from "date-fns";
import prisma from "@/lib/prisma";
import { sendPasswordResetMail } from "@/lib/mailer";
// import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    // Rate limiting
    // const identifier = `forgot-password:${email}`;
    // const { success } = await rateLimit(identifier);

    // if (!success) {
    //   return NextResponse.json(
    //     { error: "Too many requests. Please try again later." },
    //     { status: 429 }
    //   );
    // }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true },
    });

    // We don't want to reveal if the email exists or not
    if (!user) {
      return NextResponse.json({ success: true });
    }

    // Generate reset token
    const resetToken = sign(
      { userId: user.id, type: "password_reset" },
      process.env.NEXTAUTH_SECRET!,
      { expiresIn: "30m" }
    );

    // Store reset token in database
    await prisma.passwordReset.create({
      data: {
        token: resetToken,
        userId: user.id,
        expires: addMinutes(new Date(), 30),
        used: false,
      },
    });

    // Send reset email
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;
    await sendPasswordResetMail(user.email, resetUrl);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Password Reset Error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
