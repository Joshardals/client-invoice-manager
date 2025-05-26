"use server";
import { getAuthSession } from "@/lib/auth";
import { InvoiceFormData } from "@/lib/form/validation";
import prisma from "@/lib/prisma";

export async function createInvoice(data: InvoiceFormData) {
  try {
    const session = await getAuthSession();

    if (!session?.user) throw new Error("User not authenticated");

    // Calculate total amount from items
    const totalAmount = data.items.reduce(
      (sum, item) => sum + item.quantity * item.rate,
      0
    );

    const invoice = await prisma.invoice.create({
      data: {
        title: data.title,
        description: data.description || null,
        amount: totalAmount,
        currency: data.currency,
        status: "pending", // Default status for new invoices
        dueDate: data.dueDate,
        invoiceDate: data.invoiceDate,
        userId: session.user.id,
        clientId: data.clientId,
        items: {
          create: data.items.map((item) => ({
            description: item.description,
            quantity: item.quantity,
            rate: item.rate,
            total: item.quantity * item.rate,
          })),
        },
      },
      include: {
        items: true,
        client: true,
      },
    });

    return { success: true, invoice };
  } catch (error) {
    console.error("Failed to create invoice:", error);
    return {
      success: false,
      error: "Failed to create invoice. Please try again.",
    };
  }
}
