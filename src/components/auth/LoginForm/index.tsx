"use client";
import { useState } from "react";
import { Input } from "../../ui/input";
import { signIn } from "next-auth/react";
import { Button } from "../../ui/button";

const LogInForm = () => {
  const [error, setError] = useState("");

  const handleSubmit = async (formData: FormData) => {
    setError("");

    try {
      await signIn("credentials", {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
        redirect: true,
        redirectTo: "/dashboard",
      });
    } catch (err) {
      setError("An unexpected error occurred " + " " + err.message);
    }
  };
  return (
    <form action={handleSubmit} className="space-y-4">
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
      <Button type="submit" className="w-full">
        Sign In
      </Button>
    </form>
  );
};

export default LogInForm;
