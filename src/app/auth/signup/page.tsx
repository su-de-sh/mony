"use client";
import { signIn } from "next-auth/react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SignUpForm from "@/components/auth/SignUpForm";

export default function SignUp() {
  return (
    <div className="text-center min-h-screen flex justify-center items-center">
      <Card>
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
        </CardHeader>
        <CardContent>
          <SignUpForm />
        </CardContent>
        <CardFooter className="flex flex-col w-full space-y-2">
          <span className="">Or </span>
          <form
            action={async () => {
              await signIn("github");
            }}
          >
            <Button type="submit" className="w-full">
              Sign Up with GitHub
            </Button>
          </form>
          <p>
            Already have an account?{" "}
            <a href="/api/auth/signin" className="font-bold underline">
              Sign In
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
