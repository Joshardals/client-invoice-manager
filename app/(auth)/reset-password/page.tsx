import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

type PageProps = {
  searchParams: {
    token?: string;
  };
};

export default async function ResetPasswordPage({ searchParams }: PageProps) {
  const { token } = searchParams;

  if (!token) {
    redirect("/forgot-password");
  }

  try {
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
