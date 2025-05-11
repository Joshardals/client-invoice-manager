import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

interface SearchParams {
  token?: string;
}

interface PageProps {
  searchParams: SearchParams | Promise<SearchParams>;
}

export default async function ResetPasswordPage({ searchParams }: PageProps) {
  // Await the searchParams if it's a Promise
  const params = await (searchParams instanceof Promise
    ? searchParams
    : Promise.resolve(searchParams));
  const { token } = params;

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
