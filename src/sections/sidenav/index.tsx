"use client";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useComingSoonToast } from "@/hooks/commingSoonToast";
import {
  Home,
  LogOut,
  Menu,
  Moon,
  PieChart,
  Settings,
  Sun,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const SideNavBar = () => {
  const darkMode = false;
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { comingSoonToast } = useComingSoonToast();

  return (
    <div>
      <Sheet open={open} onOpenChange={() => setOpen((prev) => !prev)}>
        <SheetTrigger>
          <Menu
            className={`w-6 h-6 ${
              darkMode ? "text-orange-400" : "text-orange-600"
            }`}
          />
        </SheetTrigger>
        <SheetContent
          side="left"
          className="w-[300px] sm:w-[400px] bg-gradient-to-br from-orange-50 to-orange-100 "
        >
          <nav className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-10 mt-6">
              <h2 className="text-2xl font-bold text-primary">Mony</h2>
              <Button variant="ghost" size="icon">
                {darkMode ? (
                  <Sun className="h-6 w-6" />
                ) : (
                  <Moon className="h-6 w-6" />
                )}
              </Button>
            </div>
            <div className="space-y-4 flex-grow">
              <Button
                variant="ghost"
                className="w-full justify-start  px-0 "
                onClick={() => {
                  router.push("/dashboard");
                  setOpen(false);
                }}
              >
                <Home className="mr-2 h-5 w-5" />
                Dashboard
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start px-0"
                onClick={() => {
                  router.push("/dashboard/analytics");
                  setOpen(false);
                }}
              >
                <PieChart className="mr-2 h-5 w-5" />
                Analytics
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start px-0"
                onClick={() => comingSoonToast()}
              >
                <Settings className="mr-2 h-5 w-5" />
                Settings
              </Button>
            </div>
            <Button
              variant="ghost"
              className="w-full justify-start mt-auto mb-6 px-0"
              onClick={() => signOut()}
            >
              <LogOut className="mr-2 h-5 w-5" />
              Logout
            </Button>
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default SideNavBar;
