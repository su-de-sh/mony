import { PrismaClient, CategoryType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Don't delete existing categories to avoid foreign key constraints
  // Instead, only add new categories if they don't exist

  // Define all categories we want to ensure exist
  const categories = [
    { name: "Salary", type: CategoryType.INCOME },
    { name: "Business", type: CategoryType.INCOME },
    { name: "Investments", type: CategoryType.INCOME },
    { name: "Freelancing", type: CategoryType.INCOME },
    { name: "Rent Income", type: CategoryType.INCOME },
    { name: "Loan Received", type: CategoryType.INCOME },
    { name: "Other Income", type: CategoryType.INCOME },
    { name: "Groceries", type: CategoryType.EXPENSE },
    { name: "Rent Expense", type: CategoryType.EXPENSE },
    { name: "Utilities", type: CategoryType.EXPENSE },
    { name: "Entertainment", type: CategoryType.EXPENSE },
    { name: "Transportation", type: CategoryType.EXPENSE },
    { name: "Healthcare", type: CategoryType.EXPENSE },
    { name: "Insurance", type: CategoryType.EXPENSE },
    { name: "Education", type: CategoryType.EXPENSE },
    { name: "Loan Given", type: CategoryType.EXPENSE },
    { name: "Other Expense", type: CategoryType.EXPENSE },
    { name: "Clothing", type: CategoryType.EXPENSE },
    { name: "Travel", type: CategoryType.EXPENSE },
    { name: "Gifts", type: CategoryType.EXPENSE },
    { name: "Gadgets", type: CategoryType.EXPENSE },
    { name: "Food", type: CategoryType.EXPENSE },
    { name: "Pet", type: CategoryType.EXPENSE },
    { name: "Fitness", type: CategoryType.EXPENSE },
    { name: "Cosmetic", type: CategoryType.EXPENSE },
    { name: "Personal Care", type: CategoryType.EXPENSE },
    { name: "Home Improvement", type: CategoryType.EXPENSE },
    { name: "Subscription", type: CategoryType.EXPENSE },
    { name: "Investment", type: CategoryType.EXPENSE },
    { name: "EMI", type: CategoryType.EXPENSE },
  ];

  // Add each category if it doesn't exist yet
  for (const category of categories) {
    const existingCategory = await prisma.category.findUnique({
      where: { name: category.name },
    });

    if (!existingCategory) {
      await prisma.category.create({
        data: category,
      });
      console.log(`Added new category: ${category.name}`);
    }
  }

  console.log("Seed data updated successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
