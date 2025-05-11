// import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
// import prisma from "@/lib/prisma";
// import { verify } from "jsonwebtoken";
// import { redirect } from "next/navigation";

import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

// // Define the Props type to match the expected PageProps
// type Props = {
//   searchParams: { token?: string };
// };

// export default async function ResetPasswordPage({ searchParams }: Props) {
//   const { token } = searchParams;

//   if (!token) {
//     redirect("/forgot-password");
//   }

//   try {
//     const decoded = verify(token, process.env.NEXTAUTH_SECRET!) as {
//       userId: string;
//       type: string;
//     };

//     if (decoded.type !== "password_reset") {
//       redirect("/forgot-password");
//     }

//     const resetToken = await prisma.passwordReset.findFirst({
//       where: {
//         token,
//         used: false,
//         expires: { gt: new Date() },
//       },
//     });

//     if (!resetToken) {
//       redirect("/forgot-password");
//     }

//     return <ResetPasswordForm token={token} />;
//   } catch (err) {
//     redirect("/forgot-password");
//   }
// }

export default async function ResetPasswordPage() {
  return <ResetPasswordForm />;
}
