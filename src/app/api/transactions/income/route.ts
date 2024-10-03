// /app/api/income/route.ts

import { getServerSession } from "next-auth/next";
import { startOfMonth, endOfMonth } from "date-fns";
// Adjust the path according to your file structure
import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server"; // Use NextResponse to handle the response
import { options } from "../../auth/[...nextauth]/options";

export async function GET(request: NextRequest) {
  const currentMonth = request.nextUrl.searchParams.get("currentMonth");

  console.log("[route.ts--[13]], currentMonth", currentMonth);

  // Fetch the session, which contains the authenticated user's info
  const session = await getServerSession(options);

  if (!session) {
    // If no session, return 401 Unauthorized
    return NextResponse.json(
      { error: "You must be logged in to access this resource" },
      { status: 401 }
    );
  }

  const userId = session.user.id; // Assuming `id` is part of the user session object

  try {
    const startDate = startOfMonth(new Date(currentMonth));
    const endDate = endOfMonth(new Date(currentMonth));

    // Fetch income records for the authenticated user for the current year and month
    const incomeRecords = await prisma.income.findMany({
      where: {
        user_id: userId, // Use the userId from the session
        date: {
          gte: startDate, // Start of the current month
          lte: endDate, // End of the current month
        },
      },
      select: {
        id: true,
        amount: true,
        date: true,
        Category: {
          select: {
            name: true,
          },
        },
      },
    });

    console.log("[route.ts--[50]], incomeRecords", incomeRecords);

    // Return the response as JSON
    return NextResponse.json(incomeRecords, { status: 200 });
  } catch (error) {
    console.error("Error fetching income:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching income" },
      { status: 500 }
    );
  }
}
