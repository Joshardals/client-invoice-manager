"use server";
import { getAuthSession } from "@/lib/auth";
import { InvoiceFormData } from "@/lib/form/validation";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

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
        dueDate: new Date(data.dueDate + "T00:00:00.000Z"),
        invoiceDate: new Date(data.invoiceDate + "T00:00:00.000Z"),
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

    revalidatePath("/dashboard/clients");
    revalidatePath("/dashboard");
    return { success: true, invoice };
  } catch (error) {
    console.error("Failed to create invoice:", error);
    return {
      success: false,
      error: "Failed to create invoice. Please try again.",
    };
  }
}
