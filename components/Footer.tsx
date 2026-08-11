import Link from "next/link";
import { FiCalendar, FiHeart } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 text-sm mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <Link
              href="/"
              className="flex items-center gap-2 text-xl font-bold font-display text-white mb-3"
            >
              <span className="p-1.5 rounded-lg bg-brand-primary text-white">
                <FiCalendar className="w-4 h-4" />
              </span>
              <span>
                Fest<span className="text-brand-accent">Junction</span>
              </span>
            </Link>
            <p className="max-w-sm text-slate-400">
              Discover, book, and experience unforgettable live festivals,
              concerts, and tech summits all in one place.
            </p>
          </div>

          <div>
            <h3 className="font-display font-semibold text-white mb-3">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/events"
                  className="hover:text-white transition-colors"
                >
                  Browse All Events
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="hover:text-white transition-colors"
                >
                  Account Login
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="hover:text-white transition-colors"
                >
                  Register Account
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-display font-semibold text-white mb-3">
              Organizers
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/dashboard/my-events"
                  className="hover:text-white transition-colors"
                >
                  Host an Event
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/admin"
                  className="hover:text-white transition-colors"
                >
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} FestJunction. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Crafted with <FiHeart className="text-brand-accent w-3 h-3" /> for
            festival lovers.
          </p>
        </div>
      </div>
    </footer>
  );
}
