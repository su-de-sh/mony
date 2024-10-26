"use client";
import React from "react";
import { motion } from "framer-motion";
import { ChevronRight, DollarSign, PieChart, Shield, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MonyLogo } from "@/components/atom/Logo";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const features = [
  {
    icon: DollarSign,
    title: "Easy Expense Tracking",
    description:
      "Effortlessly log and categorize your expenses to stay on top of your spending habits.",
  },
  {
    icon: PieChart,
    title: "Insightful Analytics",
    description:
      "Visualize your financial data with intuitive charts and graphs for better decision-making.",
  },
  {
    icon: Shield,
    title: "Secure and Private",
    description:
      "Your financial data is encrypted and protected, ensuring your privacy and security.",
  },
];

const navItems = [
  {
    name: "Features",
    href: "#features",
  },
  {
    name: "Pricing",
    href: "#pricing",
  },
  {
    name: "About",
    href: "#about",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <MonyLogo />
              <span className="text-2xl font-bold text-gray-900">Mony</span>
            </div>
            <div className="hidden md:flex space-x-4">
              <Button variant="ghost">Features</Button>
              <Button variant="ghost">Pricing</Button>
              <Button variant="ghost">About</Button>
              <Link href="/auth/signup">
                <Button className="bg-[#FF9F43] text-white hover:bg-[#FF9F43]/90">
                  Sign Up
                </Button>
              </Link>
            </div>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle className="flex items-center space-x-2">
                    <MonyLogo />
                    <span className="text-2xl font-bold">Mony</span>
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col space-y-4 mt-8">
                  {navItems.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="text-lg font-medium text-gray-600 hover:text-[#FF9F43] transition-colors"
                    >
                      {item.name}
                    </a>
                  ))}
                  <Link href="/auth/signup">
                    <Button className="mt-4 bg-[#FF9F43] text-white hover:bg-[#FF9F43]/90">
                      Sign Up
                    </Button>
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <section className="text-center mb-16">
          <motion.h1
            className="text-5xl font-bold mb-4 text-gray-900 leading-tight"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Simplify Your <span className="text-[#FF9F43]">Financial Life</span>
          </motion.h1>
          <motion.p
            className="text-xl mb-8 text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Mony helps you track expenses, set budgets, and achieve your
            financial goals with ease.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4"
          >
            <Link href="/auth/signup">
              <Button
                size="lg"
                className="bg-[#FF9F43] text-white hover:bg-[#FF9F43]/90"
              >
                Get Started
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>

            <Link href="/auth/signin">
              <Button
                size="lg"
                variant="outline"
                className="border-[#FF9F43] text-[#FF9F43] hover:bg-[#FF9F43]/10"
              >
                Log in
              </Button>
            </Link>
          </motion.div>
        </section>

        <section className="grid md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="bg-white hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <CardHeader>
                  <div className="w-12 h-12 bg-[#FF9F43] rounded-full flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl font-semibold">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </section>

        <section className="text-center mb-16 bg-[#FF9F43] text-white py-16 rounded-3xl overflow-hidden relative">
          <div className="absolute inset-0 opacity-10">
            <svg
              className="w-full h-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <path d="M0 0 L50 100 L100 0 Z" fill="white" />
            </svg>
          </div>
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-4">Ready to Take Control?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of users who have already transformed their
              financial lives with Mony.
            </p>
            <Link href="/auth/signup">
              <Button
                size="lg"
                className="bg-white text-[#FF9F43] hover:bg-gray-100"
              >
                Start Your Journey
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-white text-gray-600 py-12 border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <MonyLogo />
              <span className="text-xl font-bold text-gray-900">Mony</span>
            </div>
            <div className="flex flex-wrap justify-center md:justify-end space-x-4">
              <a href="#" className="hover:text-[#FF9F43] transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-[#FF9F43] transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-[#FF9F43] transition-colors">
                Contact Us
              </a>
            </div>
          </div>
          <div className="mt-8 text-center text-sm">
            © {new Date().getFullYear()} Mony. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
