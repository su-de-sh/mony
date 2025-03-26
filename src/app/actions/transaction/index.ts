"use server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";

export const addTransaction = async (prevState, formData) => {
  const amount = formData.get("amount");
  const categoryName = formData.get("category");
  const type = formData.get("type");
  const remarks = formData.get("remarks");
  const date = formData.get("date")
    ? new Date(formData.get("date"))
    : new Date();

  try {
    const session = await getServerSession();
    if (!session) {
      return {
        message: "error",
        error: "User not authenticated.",
      };
    }

    const user = await prisma.user.findFirst({
      where: {
        email: session.user.email,
      },
    });

    if (!user) {
      return {
        message: "error",
        error: "User not found.",
      };
    }

    const category = await prisma.category.findUnique({
      where: {
        name: categoryName,
      },
    });

    if (!category) {
      return {
        message: "error",
        error: "Category not found.",
      };
    }

    await prisma.transaction.create({
      data: {
        amount: parseFloat(amount),
        transactionType: type.toUpperCase(),
        category: {
          connect: {
            id: category.id,
          },
        },
        date,
        remarks,
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    return {
      message: "success",
    };
  } catch (error) {
    console.error("Error in addTransaction:", error);
    return {
      message: "error",
      error: "Failed to add transaction. Please try again.",
    };
  }
};
