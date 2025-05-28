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
