import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/button";

const Home = async () => {
  return (
    <div className="min-h-screen border border-red-400 flex flex-col justify-center items-center p-4">
      <h1 className="font-bold text-4xl">Welcome to Mony.</h1>
      <p>
        Mony is a simple budgeting app that helps you track your expenses and
        income. It&apos;s easy to use and free to use.
      </p>
      <Link href="/api/auth/signin">
        <Button>Login</Button>
      </Link>
    </div>
  );
};

export default Home;
