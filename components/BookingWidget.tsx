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
  const availableSeats = capacity - bookedSeats;

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
          <span className="text-xs font-semibold text-brand-accent">
            {availableSeats > 0 ? `${availableSeats} seats left` : "Sold Out"}
          </span>
        </div>
      </div>

      <div className="bg-slate-950/80 border border-brand-primary/20 rounded-xl p-4 text-center space-y-3">
        <p className="text-xs font-medium text-slate-400">
          Seat reservations and ticket checkout will be fully interactive in
          Phase 4.
        </p>
        <button
          disabled
          className="w-full py-3.5 px-4 rounded-xl bg-brand-primary/40 text-white/50 font-semibold text-sm cursor-not-allowed"
        >
          Reserve Seat (Event ID: {eventId.slice(0, 8)}...)
        </button>
      </div>
    </div>
  );
}
