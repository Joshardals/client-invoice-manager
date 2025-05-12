import { VerifyEmailForm } from "@/components/auth/VerifyEmailForm";
import { verify } from "jsonwebtoken";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { VerificationData } from "@/typings";

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ session?: string }>;
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

    // Get user and verification data in one query
    const [user, verificationToken] = await Promise.all([
      prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          emailVerified: true,
          email: true,
        },
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
      redirect("/register");
    }

    if (user.emailVerified) {
      redirect("/login");
    }

    const initialData: VerificationData = {
      email: user.email,
      verificationExpires: verificationToken?.expires.toISOString() || null,
    };

    // Pass initial data to client component
    return <VerifyEmailForm sessionToken={session} initialData={initialData} />;
  } catch (error) {
    redirect("/register");
  }
}
