import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import prisma from "@/lib/prisma";
import { verify } from "jsonwebtoken";
import { redirect } from "next/navigation";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  if (!token) {
    redirect("/forgot-password?error=missing_token");
  }

  try {
    const decoded = verify(token, process.env.NEXTAUTH_SECRET!) as {
      userId: string;
      type: string;
    };

    if (decoded.type !== "password_reset") {
      redirect("/forgot-password?error=invalid_token");
    }

    const resetToken = await prisma.passwordReset.findFirst({
      where: {
        token,
        used: false,
        expires: { gt: new Date() },
      },
    });

    if (!resetToken) {
      // Check if it's expired or already used
      const expiredOrUsedToken = await prisma.passwordReset.findFirst({
        where: {
          token,
          OR: [{ expires: { lte: new Date() } }, { used: true }],
        },
      });

      if (
        expiredOrUsedToken?.expires &&
        expiredOrUsedToken.expires <= new Date()
      ) {
        redirect("/forgot-password?error=expired_token");
      } else if (expiredOrUsedToken?.used) {
        redirect("/forgot-password?error=used_token");
      } else {
        redirect("/forgot-password?error=invalid_token");
      }
    }

    return <ResetPasswordForm token={token} />;
  } catch (err) {
    redirect("/forgot-password?error=invalid_token");
  }
}
