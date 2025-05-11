import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import prisma from "@/lib/prisma";
import { verify } from "jsonwebtoken";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

interface PageProps {
  searchParams: {
    token?: string;
  };
}

export default async function ResetPasswordPage({ searchParams }: PageProps) {
  const { token } = searchParams;

  if (!token) {
    redirect("/forgot-password");
  }

  try {
    // const decoded = verify(token, process.env.NEXTAUTH_SECRET!) as {
    //   userId: string;
    //   type: string;
    // };

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
      redirect("/forgot-password");
    }
  } catch (error) {
    redirect("/forgot-password");
  }

  return <ResetPasswordForm />;
}
