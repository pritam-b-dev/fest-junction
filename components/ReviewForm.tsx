"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiStar, FiCheckCircle } from "react-icons/fi";

interface ReviewFormProps {
  eventId: string;
  eventTitle: string;
}

export default function ReviewForm({ eventId, eventTitle }: ReviewFormProps) {
  const router = useRouter();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      setError("Please write a short review comment.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId, rating, comment }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to submit review");
      }

      setSubmitted(true);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-emerald-950/40 border border-emerald-800/60 rounded-xl p-4 flex items-center gap-3 text-emerald-300 text-xs">
        <FiCheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
        <span>
          Thank you! Your review for &quot;{eventTitle}&quot; has been recorded.
        </span>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4"
    >
      <div className="flex justify-between items-start gap-4">
        <div>
          <h4 className="font-display font-bold text-white text-base">
            {eventTitle}
          </h4>
          <p className="text-slate-400 text-xs">
            Share your experience with other attendees
          </p>
        </div>

        <div className="flex items-center gap-1 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className="p-1 hover:scale-110 transition-transform"
            >
              <FiStar
                className={`w-4 h-4 ${
                  star <= rating
                    ? "text-amber-400 fill-amber-400"
                    : "text-slate-700"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      {error && (
        <p className="text-xs text-rose-400 bg-rose-950/40 p-2.5 rounded-lg border border-rose-900/40">
          {error}
        </p>
      )}

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="How was the organization, performance, and overall vibe?"
        rows={3}
        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-primary"
      />

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 rounded-xl bg-brand-primary text-white text-xs font-semibold hover:bg-brand-hover transition-colors disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Post Review"}
        </button>
      </div>
    </form>
  );
}
