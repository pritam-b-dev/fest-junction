import Link from "next/link";
import { FiCalendar, FiUser } from "react-icons/fi";

export default function Navbar() {
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
          <Link
            href="/dashboard/bookings"
            className="hover:text-brand-accent transition-colors"
          >
            My Bookings
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-brand-primary hover:bg-brand-hover text-white transition-all shadow-md shadow-violet-900/20"
          >
            <FiUser className="w-4 h-4" />
            <span>Login</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
