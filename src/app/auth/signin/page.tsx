"use client";
import { signIn } from "next-auth/react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import LogInForm from "@/components/auth/LoginForm";
import { Button } from "@/components/ui/button";

export default function SignUp() {
  return (
    <div className="text-center min-h-screen flex justify-center items-center">
      <Card>
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <LogInForm />
        </CardContent>
        <CardFooter className="flex flex-col w-full space-y-2">
          <span className="">Or </span>
          <form
            action={async () => {
              await signIn("github");
            }}
          >
            <Button type="submit" className="w-full">
              Sign In with GitHub
            </Button>
          </form>
          <p>
            Don&apos;t have an account?{" "}
            <a href="/auth/signup" className="font-bold underline">
              Sign Up
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
