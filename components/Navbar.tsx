"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiCalendar, FiUser, FiLogOut } from "react-icons/fi";
import { useSession } from "@/lib/useSession";

export default function Navbar() {
  const router = useRouter();
  const { user, loading, refetchSession } = useSession();

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    await refetchSession();
    router.push("/");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold font-display text-white"
        >
          <span className="p-2 rounded-xl bg-brand-primary text-white">
            <FiCalendar className="w-5 h-5" />
          </span>
          <span>
            Fest<span className="text-brand-accent">Junction</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <Link
            href="/events"
            className="hover:text-brand-accent transition-colors"
          >
            Explore Events
          </Link>
          {user && (
            <Link
              href="/dashboard/bookings"
              className="hover:text-brand-accent transition-colors"
            >
              My Bookings
            </Link>
          )}
          {(user?.role === "ORGANIZER" || user?.role === "ADMIN") && (
            <Link
              href="/dashboard/my-events"
              className="hover:text-brand-accent transition-colors"
            >
              My Hosted Events
            </Link>
          )}
          {user?.role === "ADMIN" && (
            <Link
              href="/dashboard/admin"
              className="hover:text-brand-accent transition-colors"
            >
              Admin Portal
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-4">
          {loading ? (
            <div className="w-20 h-8 bg-slate-800 animate-pulse rounded-full" />
          ) : user ? (
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard/profile"
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 hover:border-brand-primary/50 text-xs font-semibold text-slate-200 transition-colors"
              >
                <FiUser className="w-3.5 h-3.5 text-brand-accent" />
                <span>{user.name || user.email}</span>
              </Link>

              <button
                onClick={handleLogout}
                title="Sign Out"
                className="p-2 rounded-full bg-slate-900 hover:bg-red-500/10 text-slate-400 hover:text-red-400 border border-slate-800 transition-colors"
              >
                <FiLogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-brand-primary hover:bg-brand-hover text-white transition-all shadow-md shadow-violet-900/20"
              >
                <FiUser className="w-4 h-4" />
                <span>Login</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
