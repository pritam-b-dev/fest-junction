import { serverFetch } from "@/lib/serverFetch";
import { ApiResponse, Category, EventItem } from "@/lib/types";
import EventCard from "@/components/EventCard";
import CategoryFilter from "@/components/CategoryFilter";
import SearchInput from "@/components/SearchInput";
import Link from "next/link";
import {
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
  FiInbox,
} from "react-icons/fi";

interface EventsPageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
    page?: string;
  }>;
}

export default async function EventsPage({ searchParams }: EventsPageProps) {
  const resolvedParams = await searchParams;
  const category = resolvedParams.category || "";
  const search = resolvedParams.search || "";
  const currentPage = Number(resolvedParams.page) || 1;
  const limit = 8;

  const queryParams = new URLSearchParams();
  if (category) queryParams.set("category", category);
  if (search) queryParams.set("search", search);
  queryParams.set("page", currentPage.toString());
  queryParams.set("limit", limit.toString());

  const [categoriesRes, eventsRes] = await Promise.all([
    serverFetch<ApiResponse<Category[]>>("/categories"),
    serverFetch<ApiResponse<EventItem[]>>(`/events?${queryParams.toString()}`),
  ]);

  const categories = categoriesRes.data?.data || [];
  const events = eventsRes.data?.data || [];
  const meta = eventsRes.data?.meta || { page: 1, limit: 8, total: 0 };
  const totalPages = Math.ceil((meta.total || 0) / limit) || 1;

  const createPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (search) params.set("search", search);
    params.set("page", pageNumber.toString());
    return `/events?${params.toString()}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-brand-accent uppercase tracking-wider">
          <FiCalendar className="w-3.5 h-3.5" />
          <span>Discover Experiences</span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white">
          Explore Upcoming Events
        </h1>
        <p className="text-slate-400 text-sm max-w-2xl">
          Find and reserve tickets for live music festivals, tech summits,
          workshops, and community gatherings.
        </p>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2 border-b border-slate-800 pb-6">
        <CategoryFilter
          categories={categories}
          selectedCategory={category}
          currentSearch={search}
        />
        <SearchInput defaultValue={search} />
      </div>

      {events.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-4 my-8">
          <div className="inline-flex p-4 rounded-full bg-slate-800 text-slate-500">
            <FiInbox className="w-8 h-8" />
          </div>
          <h3 className="font-display font-bold text-xl text-white">
            No Events Found
          </h3>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            We couldn&apos;t find any events matching your criteria. Try
            adjusting your search term or selected category filter.
          </p>
          <Link
            href="/events"
            className="inline-block px-5 py-2.5 rounded-xl bg-brand-primary text-white font-semibold text-xs transition-colors hover:bg-brand-hover"
          >
            Reset All Filters
          </Link>
        </div>
      ) : (
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
              imageUrl={event.imageUrl}
            />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-8 border-t border-slate-800">
          <Link
            href={createPageUrl(currentPage - 1)}
            className={`p-2.5 rounded-xl border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-900 transition-colors ${
              currentPage <= 1 ? "pointer-events-none opacity-40" : ""
            }`}
          >
            <FiChevronLeft className="w-5 h-5" />
          </Link>
          <span className="text-xs font-semibold text-slate-400 px-3">
            Page {currentPage} of {totalPages}
          </span>
          <Link
            href={createPageUrl(currentPage + 1)}
            className={`p-2.5 rounded-xl border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-900 transition-colors ${
              currentPage >= totalPages ? "pointer-events-none opacity-40" : ""
            }`}
          >
            <FiChevronRight className="w-5 h-5" />
          </Link>
        </div>
      )}
    </div>
  );
}
