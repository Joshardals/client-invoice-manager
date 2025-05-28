import { DashboardContent } from "@/components/Dashboard/DashboardContent";
import { Sidebar } from "@/components/Dashboard/Sidebar";
import { getAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAuthSession();

  if (!session) redirect("/login");
  return (
    <div className="min-h-screen bg-gray-50 ">
      <Sidebar />
      <DashboardContent>{children}</DashboardContent>
    </div>
  );
}
