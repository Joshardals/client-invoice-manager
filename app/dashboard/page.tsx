import SignOutButton from "@/components/auth/SignOutButton";
import { getAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getAuthSession();

  if (!session) redirect("/login");

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Welcome, {session.user?.name}</h1>
      <p className="mb-12">This is your protected dashboard.</p>

      <SignOutButton />
    </div>
  );
}
