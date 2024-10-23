import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import SessionProviders from "@/providers/SessionProviders";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { TanStackProvider } from "@/providers/TanstackProvider";
import { AppProvider } from "@/contexts";
import { Toaster } from "@/components/ui/toaster";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});
export const metadata: Metadata = {
  title: "Personal Finance Manager - Track Your Expenses & Budget",
  description:
    "Easily manage your finances with our personal finance app. Track expenses, create budgets, monitor savings, and get insights to make smarter financial decisions.",
  keywords:
    "personal finance, expense tracking, budgeting, savings, finance management, money management, financial planning",
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  openGraph: {
    title: "Personal Finance Manager - Track Your Expenses & Budget",
    description:
      "Take control of your financial future. Our personal finance app helps you manage expenses, create budgets, and gain insights into your spending habits.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Analytics />
        <SpeedInsights />
        <Toaster />

        <SessionProviders>
          <AppProvider>
            <TanStackProvider>{children}</TanStackProvider>
          </AppProvider>
        </SessionProviders>
      </body>
    </html>
  );
}
