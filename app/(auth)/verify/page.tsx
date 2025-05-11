import { VerifyEmailForm } from "@/components/auth/VerifyEmailForm";
import { verify } from "jsonwebtoken";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: { session?: string };
}) {
  const { session } = await searchParams;
  if (!session) {
    redirect("/register");
  }

  try {
    const decoded = verify(session, process.env.NEXTAUTH_SECRET!) as {
      userId: string;
      email: string;
    };

    // Check if user exists and their verification status
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { emailVerified: true },
    });

    if (!user) {
      redirect("/register");
    }

    // If email is already verified, redirect to login
    if (user.emailVerified) {
      redirect("/login");
    }

    return <VerifyEmailForm />;
  } catch (error) {
    redirect("/register");
  }
}
