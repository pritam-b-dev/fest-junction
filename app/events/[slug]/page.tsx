import { notFound } from "next/navigation";
import { serverFetch } from "@/lib/serverFetch";
import { ApiResponse, EventItem, Review } from "@/lib/types";
import BookingWidget from "@/components/BookingWidget";
import {
  FiCalendar,
  FiMapPin,
  FiUser,
  FiStar,
  FiTag,
  FiArrowLeft,
} from "react-icons/fi";
import Link from "next/link";

interface EventDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function EventDetailPage({
  params,
}: EventDetailPageProps) {
  const { slug } = await params;

  const eventRes = await serverFetch<ApiResponse<EventItem>>(`/events/${slug}`);

  if (!eventRes.ok || !eventRes.data?.success || !eventRes.data?.data) {
    notFound();
  }

  const event = eventRes.data.data;

  const reviewsRes = await serverFetch<ApiResponse<Review[]>>(
    `/reviews?eventId=${event.id}`,
  );
  const reviews = reviewsRes.data?.data || [];
  const averageRating = reviewsRes.data?.meta?.averageRating || 0;

  const formattedDate = new Date(event.startDate).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <Link
        href="/events"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <FiArrowLeft className="w-4 h-4" />
        <span>Back to all events</span>
      </Link>

      <div className="relative h-72 sm:h-96 w-full rounded-3xl overflow-hidden bg-slate-900 border border-slate-800">
        <img
          src={
            event.images?.[0] ||
            "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80"
          }
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between gap-4">
          <div className="bg-slate-950/80 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-semibold text-brand-accent border border-amber-500/20 inline-flex items-center gap-2">
            <FiTag className="w-3.5 h-3.5" />
            <span>{event.category?.name || "Gathering"}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-4">
            <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-white leading-tight">
              {event.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-300 pt-2">
              <div className="flex items-center gap-2">
                <FiCalendar className="text-brand-primary w-4 h-4" />
                <span>{formattedDate}</span>
              </div>
              {event.location && (
                <div className="flex items-center gap-2">
                  <FiMapPin className="text-brand-accent w-4 h-4" />
                  <span>{event.location}</span>
                </div>
              )}
              {event.organizer && (
                <div className="flex items-center gap-2 text-slate-400">
                  <FiUser className="w-4 h-4" />
                  <span>Hosted by {event.organizer.name}</span>
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-slate-800 pt-6 space-y-3">
            <h3 className="font-display font-bold text-xl text-white">
              About Event
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
              {event.description || "No description provided for this event."}
            </p>
          </div>

          <div className="border-t border-slate-800 pt-8 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-xl text-white">
                Attendee Reviews
              </h3>
              <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 text-sm">
                <FiStar className="text-amber-400 fill-amber-400 w-4 h-4" />
                <span className="font-bold text-white">
                  {averageRating.toFixed(1)}
                </span>
                <span className="text-slate-500 text-xs">
                  ({reviews.length} reviews)
                </span>
              </div>
            </div>

            {reviews.length === 0 ? (
              <div className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-6 text-center text-xs text-slate-400">
                No reviews yet. Be the first to attend and leave a review!
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-white">
                        {rev.user?.name || "Anonymous Attendee"}
                      </span>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <FiStar
                            key={i}
                            className={`w-3 h-3 ${
                              i < rev.rating
                                ? "text-amber-400 fill-amber-400"
                                : "text-slate-700"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-300">{rev.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="sticky top-24">
            <BookingWidget
              eventId={event.id}
              price={event.price}
              capacity={event.capacity}
              bookedSeats={event.capacity - (event.availableSeats ?? 0)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
