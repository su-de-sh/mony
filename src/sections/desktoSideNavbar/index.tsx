"use client";
import React, { useEffect, useState } from "react";
import {
  Home,
  Users,
  Settings,
  BarChart,
  Mail,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { MonyLogo } from "@/components/atom/Logo";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAppContext } from "@/contexts";
import { usePathname } from "next/navigation";
import Link from "next/link";

const DesktopSideNavbar = () => {
  const { data: session } = useSession();
  const { setIsSideNavBarOpen } = useAppContext();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsSideNavBarOpen(!isCollapsed);
  }, [isCollapsed, setIsSideNavBarOpen]);

  const menuItems = [
    { title: "Dashboard", icon: Home, path: "/dashboard" },
    { title: "Analytics", icon: BarChart, path: "/dashboard/analytics" },
    { title: "Users", icon: Users, path: "/dashboard/users" },
    { title: "Messages", icon: Mail, path: "/dashboard/messages" },
    { title: "Settings", icon: Settings, path: "/dashboard/settings" },
  ];

  const isActiveRoute = (path) => {
    if (path === "/dashboard" && pathname === "/dashboard") {
      return true;
    }
    return pathname.startsWith(path) && path !== "/dashboard";
  };

  return (
    <div
      className={`hidden md:block fixed min-h-screen bg-[#FFF2E3] text-white shadow-lg transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
      style={{ zIndex: 50 }}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-1/2 z-50 flex h-6 w-6 items-center justify-center rounded-full bg-orange-400 text-white"
      >
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </button>

      {/* Logo Section */}
      <div className="flex h-16 items-center px-2 border-b border-gray-900">
        {isCollapsed ? (
          <span className="flex-none w-12 flex justify-center">
            <MonyLogo />
          </span>
        ) : (
          <span className="text-xl ml-1 font-bold flex items-center gap-2 text-orange-400">
            <MonyLogo />
            Mony
          </span>
        )}
      </div>

      {/* Navigation Items */}
      <nav className="mt-8 px-2">
        {menuItems.map((item) => {
          const isActive = isActiveRoute(item.path);
          return (
            <Link
              key={item.title}
              href={item.path}
              className={`mb-2 overflow-hidden flex items-center whitespace-nowrap rounded-lg py-4 transition-colors ${
                isActive
                  ? "bg-orange-400 text-white"
                  : "text-gray-700 hover:bg-orange-400 hover:text-white"
              }`}
            >
              <span className="flex items-center justify-center flex-none w-12">
                <item.icon className="h-5 w-5" />
              </span>
              {!isCollapsed && (
                <span className="text-sm font-medium flex-none">
                  {item.title}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Profile Section */}
      <div className="absolute bottom-0 flex w-full items-center border-t border-gray-700 p-2">
        <Avatar>
          <AvatarImage src={session?.user?.image} alt={session?.user?.name} />
          <AvatarFallback className="bg-orange-400">
            {session?.user?.name?.[0]}
          </AvatarFallback>
        </Avatar>
        {!isCollapsed && (
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-600">
              {session?.user?.name}
            </p>
            <p className="text-xs text-gray-500">{session?.user?.email}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DesktopSideNavbar;
