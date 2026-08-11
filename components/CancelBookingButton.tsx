"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiXCircle } from "react-icons/fi";

interface CancelBookingButtonProps {
  bookingId: string;
}

export default function CancelBookingButton({
  bookingId,
}: CancelBookingButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;

    setLoading(true);

    try {
      const res = await fetch(`/api/bookings/${bookingId}/cancel`, {
        method: "PATCH",
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        alert(data.message || "Failed to cancel booking");
        return;
      }

      router.refresh();
    } catch {
      alert("An error occurred while cancelling booking.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCancel}
      disabled={loading}
      className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 px-3 py-1.5 rounded-lg border border-rose-900/40 transition-colors disabled:opacity-50"
    >
      <FiXCircle className="w-3.5 h-3.5" />
      <span>{loading ? "Cancelling..." : "Cancel"}</span>
    </button>
  );
}
