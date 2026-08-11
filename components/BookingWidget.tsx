"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "@/lib/useSession";
import { FiCheckCircle, FiAlertCircle, FiMinus, FiPlus } from "react-icons/fi";
import { IoTicket } from "react-icons/io5";

interface BookingWidgetProps {
  eventId: string;
  price: number;
  capacity?: number;
  bookedSeats?: number;
}

export default function BookingWidget({
  eventId,
  price,
  capacity = 100,
  bookedSeats = 0,
}: BookingWidgetProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useSession();

  const [seats, setSeats] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const availableSeats = Math.max(0, capacity - bookedSeats);
  const totalPrice = seats * price;

  const handleSeatsChange = (newSeats: number) => {
    if (newSeats >= 1 && newSeats <= availableSeats) {
      setSeats(newSeats);
      setError(null);
    }
  };

  const handleBooking = async () => {
    if (!user) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    if (availableSeats <= 0) {
      setError("Sorry, this event is fully booked.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId, seats }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to reserve tickets");
      }

      setSuccessMessage(
        `Successfully reserved ${seats} ticket${seats > 1 ? "s" : ""}!`,
      );
      setSeats(1);
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong during booking",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl shadow-violet-950/20">
      <div className="flex items-baseline justify-between border-b border-slate-800 pb-4">
        <div>
          <span className="text-xs text-slate-400 block">Ticket Price</span>
          <span className="font-display text-3xl font-bold text-white">
            {price === 0 ? "Free" : `$${price}`}
          </span>
        </div>
        <div className="text-right">
          <span className="text-xs text-slate-400 block">Availability</span>
          <span
            className={`text-xs font-semibold ${
              availableSeats > 0 ? "text-emerald-400" : "text-rose-400"
            }`}
          >
            {availableSeats > 0 ? `${availableSeats} seats left` : "Sold Out"}
          </span>
        </div>
      </div>

      {successMessage && (
        <div className="bg-emerald-950/50 border border-emerald-800/80 rounded-xl p-4 flex items-start gap-3 text-emerald-300 text-xs">
          <FiCheckCircle className="w-5 h-5 shrink-0 text-emerald-400 mt-0.5" />
          <div>
            <p className="font-semibold">{successMessage}</p>
            <p className="text-emerald-400/80 text-[11px] mt-1">
              Your reservation is confirmed. You can view your bookings in your
              attendee dashboard.
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-rose-950/50 border border-rose-800/80 rounded-xl p-4 flex items-start gap-3 text-rose-300 text-xs">
          <FiAlertCircle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-300">
            Select Seats
          </span>
          <div className="flex items-center gap-3 bg-slate-950 border border-slate-800 rounded-xl p-1">
            <button
              type="button"
              onClick={() => handleSeatsChange(seats - 1)}
              disabled={seats <= 1 || availableSeats <= 0}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
              aria-label="Decrease seats"
            >
              <FiMinus className="w-4 h-4" />
            </button>
            <span className="font-bold text-sm text-white min-w-[20px] text-center">
              {seats}
            </span>
            <button
              type="button"
              onClick={() => handleSeatsChange(seats + 1)}
              disabled={seats >= availableSeats || availableSeats <= 0}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
              aria-label="Increase seats"
            >
              <FiPlus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {price > 0 && (
          <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-800/80">
            <span className="text-slate-400">Total Amount</span>
            <span className="font-bold text-white text-base">
              ${totalPrice}
            </span>
          </div>
        )}

        <button
          type="button"
          onClick={handleBooking}
          disabled={loading || availableSeats <= 0}
          className="w-full py-3.5 px-4 rounded-xl bg-brand-primary text-white font-semibold text-sm hover:bg-brand-hover active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg shadow-violet-900/30"
        >
          <IoTicket className="w-4 h-4" />
          <span>
            {loading
              ? "Processing..."
              : !user
                ? "Login to Book"
                : availableSeats <= 0
                  ? "Sold Out"
                  : "Book Now"}
          </span>
        </button>
      </div>
    </div>
  );
}
