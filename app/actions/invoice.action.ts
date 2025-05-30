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
        status: "PENDING", // Default status
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

    revalidatePath("/dashboard/invoices");
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

export async function getInvoices() {
  try {
    const session = await getAuthSession();

    if (!session?.user) throw new Error("User not authenticated");

    const invoices = await prisma.invoice.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        items: true,
        client: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { success: true, invoices };
  } catch (error) {
    console.error("Failed to fetch invoices:", error);
    return {
      success: false,
      error: "Failed to fetch invoices. Please try again.",
    };
  }
}

export async function getDashboardStats() {
  try {
    const session = await getAuthSession();

    if (!session?.user) throw new Error("User not authenticated");

    // Get all clients count
    const clientsCount = await prisma.client.count({
      where: {
        userId: session.user.id,
      },
    });

    // Get all invoices with their amounts and status
    const invoices = await prisma.invoice.findMany({
      where: {
        userId: session.user.id,
      },
      select: {
        amount: true,
        status: true,
        currency: true,
      },
    });

    // Calculate stats
    const stats = invoices.reduce(
      (acc, inv) => {
        acc.totalInvoices++;

        if (inv.status === "PENDING") {
          acc.pendingAmount += inv.amount;
        } else if (inv.status === "PAID") {
          acc.paidAmount += inv.amount;
        }

        return acc;
      },
      {
        totalInvoices: 0,
        pendingAmount: 0,
        paidAmount: 0,
      }
    );

    return {
      success: true,
      stats: {
        totalClients: clientsCount,
        totalInvoices: stats.totalInvoices,
        pendingAmount: stats.pendingAmount,
        paidAmount: stats.paidAmount,
      },
    };
  } catch (error) {
    console.error("Failed to fetch dashboard stats:", error);
    return {
      success: false,
      error: "Failed to fetch dashboard stats. Please try again.",
    };
  }
}

export async function getRecentInvoices() {
  try {
    const session = await getAuthSession();

    if (!session?.user) throw new Error("User not authenticated");

    const invoices = await prisma.invoice.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        client: true,
        items: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    });

    return { success: true, invoices };
  } catch (error) {
    console.error("Failed to fetch recent invoices:", error);
    return {
      success: false,
      error: "Failed to fetch recent invoices. Please try again.",
    };
  }
}

export async function updateInvoice(invoiceId: string, data: InvoiceFormData) {
  try {
    const session = await getAuthSession();

    if (!session?.user) throw new Error("User not authenticated");

    // Calculate total amount from items
    const totalAmount = data.items.reduce(
      (sum, item) => sum + item.quantity * item.rate,
      0
    );

    const invoice = await prisma.invoice.update({
      where: {
        id: invoiceId,
        userId: session.user.id,
      },
      data: {
        title: data.title,
        description: data.description || null,
        amount: totalAmount,
        currency: data.currency,
        dueDate: new Date(data.dueDate + "T00:00:00.000Z"),
        invoiceDate: new Date(data.invoiceDate + "T00:00:00.000Z"),
        status: data.status,
        clientId: data.clientId,
        // First delete existing items then create new ones
        items: {
          deleteMany: {}, // This deletes all existing items
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

    revalidatePath("/dashboard/invoices");
    revalidatePath("/dashboard");
    return { success: true, invoice };
  } catch (error) {
    console.error("Failed to update invoice:", error);
    return {
      success: false,
      error: "Failed to update invoice. Please try again.",
    };
  }
}

export async function deleteInvoice(invoiceId: string) {
  try {
    const session = await getAuthSession();

    if (!session?.user) throw new Error("User not authenticated");

    // Delete all invoice items first
    await prisma.invoiceItem.deleteMany({
      where: {
        invoiceId: invoiceId,
      },
    });

    // Then delete the invoice
    await prisma.invoice.delete({
      where: {
        id: invoiceId,
        userId: session.user.id,
      },
    });

    revalidatePath("/dashboard/invoices");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete invoice:", error);
    return {
      success: false,
      error: "Failed to delete invoice. Please try again.",
    };
  }
}
