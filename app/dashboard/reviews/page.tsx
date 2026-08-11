import { serverFetch } from "@/lib/serverFetch";
import { ApiResponse, Booking } from "@/lib/types";
import ReviewForm from "@/components/ReviewForm";
import { FiCheck } from "react-icons/fi";

export default async function ReviewsPage() {
  const res = await serverFetch<ApiResponse<Booking[]>>("/bookings/my");
  const bookings = res.data?.data || [];

  const pendingReviews = bookings.filter(
    (b) => b.status === "COMPLETED" && !b.hasReview,
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-bold text-white">
          Pending Reviews
        </h2>
        <span className="text-xs text-slate-400">
          {pendingReviews.length} event{pendingReviews.length === 1 ? "" : "s"}{" "}
          awaiting feedback
        </span>
      </div>

      {pendingReviews.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-4">
          <div className="inline-flex p-4 rounded-full bg-slate-800 text-emerald-400">
            <FiCheck className="w-8 h-8" />
          </div>
          <h3 className="font-display font-bold text-lg text-white">
            All Caught Up!
          </h3>
          <p className="text-slate-400 text-xs max-w-sm mx-auto">
            You have no pending reviews for attended events. Completed event
            bookings without reviews will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingReviews.map((b) => (
            <ReviewForm
              key={b.id}
              eventId={b.eventId}
              eventTitle={b.event?.title || "Attended Event"}
            />
          ))}
        </div>
      )}
    </div>
  );
}
