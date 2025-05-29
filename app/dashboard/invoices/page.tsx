import { Suspense } from "react";
import { getInvoices } from "@/app/actions/invoice.action";
import { AllInvoices } from "@/components/Dashboard/invoices/AllInvoices";
import { InvoicesSkeleton } from "@/components/Dashboard/invoices/InvoicesSkeleton";

export default async function InvoicesPage() {
  return (
    <Suspense fallback={<InvoicesSkeleton />}>
      <InvoicesContent />
    </Suspense>
  );
}

async function InvoicesContent() {
  const invoices = await getInvoices();

  if (!invoices.success) {
    throw new Error(invoices.error || "Failed to load invoices");
  }

  return <AllInvoices key={Date.now()} allInvoices={invoices} />;
}
