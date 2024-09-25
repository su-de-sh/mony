import User from "@/components/user";
import prisma from "@/lib/db";
import React from "react";

const Home = async () => {
  const incomes = await prisma.incomeCategories.findMany();

  return (
    <div>
      {incomes.map((income) => {
        return <div key={income.id}>{income.name}</div>;
      })}
      <User />
    </div>
  );
};

export default Home;
