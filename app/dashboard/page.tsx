import { Suspense } from "react";
import { Dashboard } from "@/components/Dashboard/Dashboard";
import {
  getDashboardStats,
  getRecentInvoices,
} from "../actions/invoice.action";
import { DashboardSkeleton } from "@/components/Dashboard/DashboardSkeleton";
import { Invoice } from "@/typings";
import { getAuthSession } from "@/lib/auth";

export interface DashboardStats {
  totalClients: number;
  totalInvoices: number;
  pendingAmount: number;
  paidAmount: number;
}

export default async function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  );
}

async function DashboardContent() {
  const [session, invoicesResponse, statsResponse] = await Promise.all([
    getAuthSession(),
    getRecentInvoices(),
    getDashboardStats(),
  ]);

  const name = session?.user.name?.split(" ")[0] || "User";

  if (!invoicesResponse.success) {
    throw new Error(invoicesResponse.error || "Failed to load recent invoices");
  }

  if (!statsResponse.success) {
    throw new Error(statsResponse.error || "Failed to load dashboard stats");
  }

  const invoices: Invoice[] = invoicesResponse.invoices || [];
  const stats: DashboardStats = statsResponse.stats || {
    totalClients: 0,
    totalInvoices: 0,
    pendingAmount: 0,
    paidAmount: 0,
  };

  return <Dashboard recentInvoices={invoices} name={name} stats={stats} />;
}
