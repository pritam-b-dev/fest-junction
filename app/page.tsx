import { EventItem } from "@/lib/types";
import Link from "next/link";
import EventCard from "@/components/EventCard";
import { FiArrowRight, FiCompass, FiZap, FiCheckCircle } from "react-icons/fi";
import { IoShieldCheckmark } from "react-icons/io5";

const response = await fetch(`${process.env.API_URL}/events?limit=4`, {
  cache: "no-store",
});

const result = await response.json();

const events: EventItem[] = result.data || [];

export default function HomePage() {
  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 md:pt-32 md:pb-24 overflow-hidden border-b border-slate-800/80">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(124,58,237,0.25),rgba(255,255,255,0))]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 border border-brand-primary/30 text-xs font-semibold text-brand-accent">
            <FiZap className="w-3.5 h-3.5" />
            <span>Your Ultimate Gateway to Live Experiences</span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
            Unforgettable Events, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-300 to-amber-400">
              Seamless Booking.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-400">
            Discover local concerts, tech summits, culinary workshops, and art
            festivals. Secure your spot in seconds with guaranteed real-time
            capacity tracking.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/events"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-brand-primary hover:bg-brand-hover text-white font-bold text-base transition-all shadow-lg shadow-violet-900/30 flex items-center justify-center gap-2"
            >
              <FiCompass className="w-5 h-5" />
              <span>Explore All Events</span>
            </Link>
            <Link
              href="/register"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-base transition-all flex items-center justify-center gap-2"
            >
              <span>Create Account</span>
            </Link>
          </div>

          {/* Highlights */}
          <div className="pt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto text-left border-t border-slate-800/80">
            <div className="flex items-center gap-3">
              <IoShieldCheckmark className="text-brand-accent w-6 h-6 flex-shrink-0" />
              <span className="text-xs text-slate-300 font-medium">
                Verified Event Organizers
              </span>
            </div>
            <div className="flex items-center gap-3">
              <FiCheckCircle className="text-brand-accent w-6 h-6 flex-shrink-0" />
              <span className="text-xs text-slate-300 font-medium">
                Instant Booking Confirmations
              </span>
            </div>
            <div className="flex items-center gap-3">
              <FiZap className="text-brand-accent w-6 h-6 flex-shrink-0" />
              <span className="text-xs text-slate-300 font-medium">
                Real-time Seat Reservation
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Events Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
              Featured Gatherings
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Handpicked events happening soon around you.
            </p>
          </div>
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand-accent hover:underline"
          >
            <span>View all events</span>
            <FiArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {events.map((event) => (
            <EventCard
              key={event.id}
              id={event.id}
              slug={event.slug}
              title={event.title}
              categoryName={event.category?.name || "General"}
              startDate={event.startDate}
              price={event.price}
              imageUrl={event.images?.[0]}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
