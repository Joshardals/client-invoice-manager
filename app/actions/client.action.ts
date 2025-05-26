"use server";
import { getAuthSession } from "@/lib/auth";
import { ClientFormData } from "@/lib/form/validation";
import prisma from "@/lib/prisma";

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
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        company: true,
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
