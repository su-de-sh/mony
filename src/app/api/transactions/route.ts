// /app/api/income/route.ts

import { getServerSession } from "next-auth/next";
import { startOfMonth, endOfMonth } from "date-fns";
// Adjust the path according to your file structure
import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server"; // Use NextResponse to handle the response
import { options } from "./../auth/[...nextauth]/options";

export async function GET(request: NextRequest) {
  const month = request.nextUrl.searchParams.get("month");
  const year = request.nextUrl.searchParams.get("year");
  const currentMonth = request.nextUrl.searchParams.get("currentMonth");

  // Fetch the session, which contains the authenticated user's info
  const session = await getServerSession(options);

  if (!session) {
    // If no session, return 401 Unauthorized
    return NextResponse.json(
      { error: "You must be logged in to access this resource" },
      { status: 401 }
    );
  }

  if (!month && !year && !currentMonth) {
    return NextResponse.json(
      { error: "Month and year parameters are required" },
      { status: 400 }
    );
  }

  const userId = session.user.id; // Assuming `id` is part of the user session object

  try {
    let startDate, endDate;

    // Handle both new (month/year) and legacy (currentMonth) parameter formats
    if (month && year) {
      // Convert to numbers (month is 1-indexed in the request)
      const monthNum = parseInt(month, 10);
      const yearNum = parseInt(year, 10);

      // Create date for the first day of the specified month (month is 0-indexed in Date constructor)
      startDate = new Date(yearNum, monthNum - 1, 1);
      // Get the last day of the month
      endDate = endOfMonth(startDate);
    } else if (currentMonth) {
      // Legacy support for currentMonth parameter
      startDate = startOfMonth(new Date(currentMonth));
      endDate = endOfMonth(new Date(currentMonth));
    }

    // Fetch income records for the authenticated user for the current year and month
    const incomeRecords = await prisma.transaction.findMany({
      where: {
        userId: userId, // Use the userId from the session
        date: {
          gte: startDate, // Start of the current month
          lte: endDate, // End of the current month
        },
      },
      select: {
        id: true,
        amount: true,
        date: true,
        transactionType: true,
        category: {
          select: {
            name: true,
          },
        },
        remarks: true,
      },
    });

    // Return the response as JSON
    return NextResponse.json(incomeRecords, { status: 200 });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching transactions" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const session = await getServerSession(options);

  if (!session) {
    return NextResponse.json(
      { error: "You must be logged in to access this resource" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { id, amount, categoryName, transactionType, date, remarks } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Transaction ID is required" },
        { status: 400 }
      );
    }

    const userId = session.user.id;

    // Verify the transaction belongs to the user
    const existingTransaction = await prisma.transaction.findFirst({
      where: {
        id: parseInt(id),
        userId: userId,
      },
    });

    if (!existingTransaction) {
      return NextResponse.json(
        { error: "Transaction not found or unauthorized" },
        { status: 404 }
      );
    }

    // Find the category
    const category = await prisma.category.findUnique({
      where: { name: categoryName },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 400 }
      );
    }

    // Update the transaction
    const updatedTransaction = await prisma.transaction.update({
      where: { id: parseInt(id) },
      data: {
        amount: parseFloat(amount),
        transactionType: transactionType.toUpperCase(),
        categoryId: category.id,
        date: new Date(date),
        remarks: remarks || null,
      },
      include: {
        category: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json(updatedTransaction, { status: 200 });
  } catch (error) {
    console.error("Error updating transaction:", error);
    return NextResponse.json(
      { error: "An error occurred while updating the transaction" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const session = await getServerSession(options);

  if (!session) {
    return NextResponse.json(
      { error: "You must be logged in to access this resource" },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Transaction ID is required" },
        { status: 400 }
      );
    }

    const userId = session.user.id;

    // Verify the transaction belongs to the user
    const existingTransaction = await prisma.transaction.findFirst({
      where: {
        id: parseInt(id),
        userId: userId,
      },
    });

    if (!existingTransaction) {
      return NextResponse.json(
        { error: "Transaction not found or unauthorized" },
        { status: 404 }
      );
    }

    // Delete the transaction
    await prisma.transaction.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json(
      { message: "Transaction deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting transaction:", error);
    return NextResponse.json(
      { error: "An error occurred while deleting the transaction" },
      { status: 500 }
    );
  }
}
