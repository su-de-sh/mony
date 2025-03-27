"use client";
import React, { useState } from "react";
import { Input } from "../../ui/input";
import { signUp } from "@/app/actions/signup";
import { signIn } from "next-auth/react";
import { Button } from "../../ui/button";

const SignUpForm = () => {
  const [error, setError] = useState("");

  const handleSubmit = async (formData: FormData) => {
    setError("");

    try {
      const result = await signUp(formData);
      if (result.success) {
        await signIn("credentials", {
          email: formData.get("email") as string,
          password: formData.get("password") as string,
          redirect: true,
          redirectTo: "/dashboard",
        });
      } else {
        setError(result.error || "An error occurred during signup");
      }
    } catch (err) {
      setError("An unexpected error occurred " + " " + err.message);
    }
  };
  return (
    <form action={handleSubmit} className="space-y-4">
      <Input type="text" id="name" placeholder="Name" name="name" required />

      <Input
        type="email"
        id="email"
        placeholder="Email"
        name="email"
        required
      />
      <Input
        type="password"
        id="password"
        placeholder="Password"
        name="password"
        required
      />
      {error && <p className=" text-xs text-destructive">{error}</p>}
      <Button type="submit" className="w-full bg-[#FF9F43]">
        Sign Up
      </Button>
    </form>
  );
};

export default SignUpForm;
