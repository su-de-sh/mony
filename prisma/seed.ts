import prisma from "../src/lib/db";

async function main() {
  // Delete existing income categories
  await prisma.incomeCategories.deleteMany({});

  // Delete existing expense categories
  await prisma.expenseCategories.deleteMany({});

  // Seed income categories
  const incomeCategories = [
    { name: "Salary" },
    { name: "Business" },
    { name: "Investments" },
    { name: "Freelancing" },
    { name: "Rent" },
    { name: "Other" },
  ];

  // Seed expense categories
  const expenseCategories = [
    { name: "Groceries" },
    { name: "Rent" },
    { name: "Utilities" },
    { name: "Entertainment" },
    { name: "Transportation" },
    { name: "Healthcare" },
    { name: "Insurance" },
    { name: "Education" },
    { name: "Other" },
    { name: "Clothing" },
    { name: "Travel" },
    { name: "Gifts" },
    { name: "Gadgets" },
    { name: "Food" },
    { name: "Pet" },
    { name: "Fitness" },
  ];

  // Insert income categories
  for (const category of incomeCategories) {
    await prisma.incomeCategories.create({
      data: category,
    });
  }

  // Insert expense categories
  for (const category of expenseCategories) {
    await prisma.expenseCategories.create({
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
