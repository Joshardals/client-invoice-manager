import { DashboardContent } from "@/components/Dashboard/DashboaordContent";
import { Sidebar } from "@/components/Dashboard/Sidebar";
import { getAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Viewport } from "next";

export const viewport: Viewport = {
  themeColor: "#101828",
};

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
