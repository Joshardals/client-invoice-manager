"use server";
import { getAuthSession } from "@/lib/auth";
import { ClientFormData } from "@/lib/form/validation";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createClient(data: ClientFormData) {
  try {
    const session = await getAuthSession();

    if (!session?.user) throw new Error("User not authenticated");

    const client = await prisma.client.create({
      data: {
        name: data.fullName,
        email: data.email,
        phone: data.phone || null,
        company: data.company || null,
        address: data.address || null,
        notes: data.notes || null,
        userId: session?.user.id,
      },
    });

    revalidatePath("/dashboard/clients");
    revalidatePath("/dashboard");
    return { success: true, client };
  } catch (error) {
    console.error("Failed to create client:", error);
    return {
      success: false,
      error: "Failed to create client. Please try again.",
    };
  }
}

export async function getClients() {
  try {
    const session = await getAuthSession();

    if (!session?.user) throw new Error("User not authenticated");

    const clients = await prisma.client.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        invoices: {
          include: {
            client: true,
            items: true,
          },
        },
      },
    });

    return { success: true, clients };
  } catch (error) {
    console.error("Failed to fetch clients:", error);
    return {
      success: false,
      error: "Failed to fetch clients. Please try again.",
    };
  }
}

export async function updateClient(clientId: string, data: ClientFormData) {
  try {
    const session = await getAuthSession();

    if (!session?.user) throw new Error("User not authenticated");

    const client = await prisma.client.update({
      where: {
        id: clientId,
        userId: session.user.id,
      },
      data: {
        name: data.fullName,
        email: data.email,
        phone: data.phone || null,
        company: data.company || null,
        address: data.address || null,
        notes: data.notes || null,
      },
    });

    return { success: true, client };
  } catch (error) {
    console.error("Failed to update client:", error);
    return {
      success: false,
      error: "Failed to update client. Please try again.",
    };
  }
}

export async function deleteClient(clientId: string) {
  try {
    const session = await getAuthSession();
    if (!session?.user) throw new Error("User not authenticated");

    // First check if client has any invoices
    const clientWithInvoices = await prisma.client.findFirst({
      where: {
        id: clientId,
        userId: session.user.id,
      },
      include: {
        _count: {
          select: { invoices: true },
        },
      },
    });

    if (!clientWithInvoices) {
      throw new Error("Client not found");
    }

    if (clientWithInvoices._count.invoices > 0) {
      return {
        success: false,
        error: "HAS_INVOICES",
        invoiceCount: clientWithInvoices._count.invoices,
      };
    }

    // If no invoices, proceed with deletion
    await prisma.client.delete({
      where: {
        id: clientId,
        userId: session.user.id,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to delete client:", error);
    return {
      success: false,
      error: "Failed to delete client. Please try again.",
    };
  }
}

// Force delete with all related invoices
export async function forceDeleteClientWithInvoices(clientId: string) {
  try {
    const session = await getAuthSession();
    if (!session?.user) throw new Error("User not authenticated");

    // Delete in transaction to ensure atomicity
    await prisma.$transaction(async (tx) => {
      // First delete all invoice items
      await tx.invoiceItem.deleteMany({
        where: {
          invoice: {
            clientId: clientId,
            userId: session.user.id,
          },
        },
      });

      // Then delete all invoices
      await tx.invoice.deleteMany({
        where: {
          clientId: clientId,
          userId: session.user.id,
        },
      });

      // Finally delete the client
      await tx.client.delete({
        where: {
          id: clientId,
          userId: session.user.id,
        },
      });
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to delete client and invoices:", error);
    return {
      success: false,
      error: "Failed to delete client and related invoices. Please try again.",
    };
  }
}
