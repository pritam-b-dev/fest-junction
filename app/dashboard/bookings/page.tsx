import { serverFetch } from "@/lib/serverFetch";
import { ApiResponse, Booking, BookingStatus } from "@/lib/types";
import CancelBookingButton from "@/components/CancelBookingButton";
import Link from "next/link";
import { FiCalendar, FiMapPin, FiInbox } from "react-icons/fi";

export default async function BookingsPage() {
  const res = await serverFetch<ApiResponse<Booking[]>>("/bookings/my");
  const bookings = res.data?.data || [];

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-emerald-950/80 text-emerald-400 border-emerald-800/80";
      case "PENDING":
        return "bg-amber-950/80 text-amber-400 border-amber-800/80";
      case "COMPLETED":
        return "bg-cyan-950/80 text-cyan-400 border-cyan-800/80";
      case "CANCELLED":
        return "bg-rose-950/80 text-rose-400 border-rose-800/80";
      default:
        return "bg-slate-800 text-slate-300 border-slate-700";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-bold text-white">
          Your Bookings
        </h2>
        <span className="text-xs text-slate-400">
          {bookings.length} total reservations
        </span>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-4">
          <div className="inline-flex p-4 rounded-full bg-slate-800 text-slate-500">
            <FiInbox className="w-8 h-8" />
          </div>
          <h3 className="font-display font-bold text-lg text-white">
            No Bookings Yet
          </h3>
          <p className="text-slate-400 text-xs max-w-sm mx-auto">
            You haven&apos;t reserved tickets for any events. Browse our catalog
            to find exciting upcoming events.
          </p>
          <Link
            href="/events"
            className="inline-block px-4 py-2 rounded-xl bg-brand-primary text-white font-semibold text-xs"
          >
            Explore Events
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => {
            const isCancellable =
              booking.status === "PENDING" || booking.status === "CONFIRMED";
            const formattedDate = booking.event?.startDate
              ? new Date(booking.event.startDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "TBA";

            return (
              <div
                key={booking.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-xl bg-slate-950 overflow-hidden shrink-0 border border-slate-800">
                    <img
                      src={
                        booking.event?.imageUrl ||
                        "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=400&q=80"
                      }
                      alt={booking.event?.title || "Event"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${getStatusBadge(
                          booking.status,
                        )}`}
                      >
                        {booking.status}
                      </span>
                    </div>
                    <Link
                      href={`/events/${booking.event?.slug}`}
                      className="font-display font-bold text-white text-base hover:text-brand-accent transition-colors block"
                    >
                      {booking.event?.title || "Unknown Event"}
                    </Link>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
                      <span className="flex items-center gap-1">
                        <FiCalendar className="w-3.5 h-3.5 text-brand-primary" />
                        {formattedDate}
                      </span>
                      {booking.event?.location && (
                        <span className="flex items-center gap-1">
                          <FiMapPin className="w-3.5 h-3.5 text-brand-accent" />
                          {booking.event.location}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto border-t sm:border-t-0 border-slate-800 pt-3 sm:pt-0 gap-3">
                  <div className="text-left sm:text-right">
                    <span className="text-[11px] text-slate-400 block">
                      {booking.seats}{" "}
                      {booking.seats === 1 ? "Ticket" : "Tickets"}
                    </span>
                    <span className="font-bold text-white text-sm">
                      ${booking.totalPrice}
                    </span>
                  </div>

                  {isCancellable && (
                    <CancelBookingButton bookingId={booking.id} />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
