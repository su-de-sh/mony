import { PrismaClient, CategoryType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Delete existing categories
  await prisma.category.deleteMany({});

  // Seed categories
  const categories = [
    { name: "Salary", type: CategoryType.INCOME },
    { name: "Business", type: CategoryType.INCOME },
    { name: "Investments", type: CategoryType.INCOME },
    { name: "Freelancing", type: CategoryType.INCOME },
    { name: "Rent Income", type: CategoryType.INCOME },
    { name: "Other Income", type: CategoryType.INCOME },
    { name: "Groceries", type: CategoryType.EXPENSE },
    { name: "Rent Expense", type: CategoryType.EXPENSE },
    { name: "Utilities", type: CategoryType.EXPENSE },
    { name: "Entertainment", type: CategoryType.EXPENSE },
    { name: "Transportation", type: CategoryType.EXPENSE },
    { name: "Healthcare", type: CategoryType.EXPENSE },
    { name: "Insurance", type: CategoryType.EXPENSE },
    { name: "Education", type: CategoryType.EXPENSE },
    { name: "Other Expense", type: CategoryType.EXPENSE },
    { name: "Clothing", type: CategoryType.EXPENSE },
    { name: "Travel", type: CategoryType.EXPENSE },
    { name: "Gifts", type: CategoryType.EXPENSE },
    { name: "Gadgets", type: CategoryType.EXPENSE },
    { name: "Food", type: CategoryType.EXPENSE },
    { name: "Pet", type: CategoryType.EXPENSE },
    { name: "Fitness", type: CategoryType.EXPENSE },
  ];

  for (const category of categories) {
    await prisma.category.create({
      data: category,
    });
  }

  console.log("Seed data inserted successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });