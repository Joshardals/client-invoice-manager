import { Dashboard } from "@/components/Dashboard/Dashboard";
import { Viewport } from "next";

export const viewport: Viewport = {
  themeColor: "black",
};

export default async function DashboardPage() {
  return <Dashboard />;
}
