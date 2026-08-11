"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserRole } from "@/lib/types";
import { FiCalendar, FiStar, FiUser, FiShield } from "react-icons/fi";
import { BsCalendarEvent } from "react-icons/bs";

interface DashboardNavProps {
  userRole: UserRole;
}

export default function DashboardNav({ userRole }: DashboardNavProps) {
  const pathname = usePathname();

  const navItems = [
    { label: "My Bookings", href: "/dashboard/bookings", icon: FiCalendar },
    { label: "Pending Reviews", href: "/dashboard/reviews", icon: FiStar },
    { label: "Profile Settings", href: "/dashboard/profile", icon: FiUser },
  ];

  if (userRole === "ORGANIZER" || userRole === "ADMIN") {
    navItems.push({
      label: "My Events",
      href: "/dashboard/organizer",
      icon: BsCalendarEvent,
    });
  }

  if (userRole === "ADMIN") {
    navItems.push({
      label: "Admin Panel",
      href: "/dashboard/admin",
      icon: FiShield,
    });
  }

  return (
    <nav className="flex flex-row lg:flex-col gap-1 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              isActive
                ? "bg-brand-primary text-white shadow-md shadow-violet-950/40"
                : "text-slate-400 hover:text-white hover:bg-slate-900"
            }`}
          >
            <Icon className="w-4 h-4 shrink-0" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
