"use server";

import prisma from "@/lib/db";
import { getServerSession } from "next-auth";

export const addTransaction = async (prevState, formData) => {
  const amount = formData.get("amount");
  const categoryName = formData.get("category");
  const type = formData.get("type");

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

    if (type === "income") {
      const category = await prisma.incomeCategories.findUnique({
        where: {
          name: categoryName,
        },
      });

      await prisma.income.create({
        data: {
          amount: parseFloat(amount),
          Category: {
            connect: {
              id: category.id,
            },
          },
          date: new Date(),

          User: {
            connect: {
              id: user.id,
            },
          },
        },
      });
    }

    if (type === "expense") {
      const category = await prisma.expenseCategories.findUnique({
        where: {
          name: categoryName,
        },
      });

      await prisma.expenses.create({
        data: {
          amount: parseFloat(amount),
          Category: {
            connect: {
              id: category.id,
            },
          },
          date: new Date(),

          User: {
            connect: {
              id: user.id,
            },
          },
        },
      });
    }

    return {
      message: "success",
    };
  } catch (error) {
    console.error(error);
    return {
      message: "error",
      error: "Failed to add transaction. Please try again.",
    };
  }
};
