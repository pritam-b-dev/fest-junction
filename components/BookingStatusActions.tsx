"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiCheck, FiCheckCircle, FiXCircle } from "react-icons/fi";
import { BookingStatus } from "@/lib/types";

interface BookingStatusActionsProps {
  bookingId: string;
  status: BookingStatus;
}

export default function BookingStatusActions({
  bookingId,
  status,
}: BookingStatusActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const updateStatus = async (
    newStatus: "CONFIRMED" | "COMPLETED" | "CANCELLED",
  ) => {
    if (newStatus === "CANCELLED" && !confirm("Cancel this booking?")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/bookings/${bookingId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        alert(data.message || "Failed to update booking");
        return;
      }
      router.refresh();
    } catch {
      alert("Error updating booking status.");
    } finally {
      setLoading(false);
    }
  };

  if (status === "PENDING") {
    return (
      <div className="flex items-center gap-2 justify-end">
        <button
          onClick={() => updateStatus("CONFIRMED")}
          disabled={loading}
          className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/40 px-2.5 py-1.5 rounded-lg border border-emerald-900/40 disabled:opacity-50"
        >
          <FiCheck className="w-3.5 h-3.5" /> Confirm
        </button>
        <button
          onClick={() => updateStatus("CANCELLED")}
          disabled={loading}
          className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 px-2.5 py-1.5 rounded-lg border border-rose-900/40 disabled:opacity-50"
        >
          <FiXCircle className="w-3.5 h-3.5" /> Reject
        </button>
      </div>
    );
  }

  if (status === "CONFIRMED") {
    return (
      <div className="flex items-center gap-2 justify-end">
        <button
          onClick={() => updateStatus("COMPLETED")}
          disabled={loading}
          className="inline-flex items-center gap-1 text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/40 px-2.5 py-1.5 rounded-lg border border-cyan-900/40 disabled:opacity-50"
        >
          <FiCheckCircle className="w-3.5 h-3.5" /> Mark Completed
        </button>
        <button
          onClick={() => updateStatus("CANCELLED")}
          disabled={loading}
          className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 px-2.5 py-1.5 rounded-lg border border-rose-900/40 disabled:opacity-50"
        >
          <FiXCircle className="w-3.5 h-3.5" /> Cancel
        </button>
      </div>
    );
  }

  return null;
}
