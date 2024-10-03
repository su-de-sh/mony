"use server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";

export const addTransaction = async (prevState, formData) => {
  const amount = formData.get("amount");
  const categoryName = formData.get("category");
  const type = formData.get("type");

  console.log("Prisma instance:", prisma);
  console.log("Prisma category:", prisma.category);

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

    console.log("User found:", user);
    console.log("Looking for category:", categoryName);

    const category = await prisma.category.findUnique({
      where: {
        name: categoryName,
      },
    });

    console.log("Category found:", category);

    if (!category) {
      return {
        message: "error",
        error: "Category not found.",
      };
    }

    const newTransaction = await prisma.transaction.create({
      data: {
        amount: parseFloat(amount),
        transactionType: type.toUpperCase(),
        category: {
          connect: {
            id: category.id,
          },
        },
        date: new Date(),
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    console.log("Transaction created:", newTransaction);

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
