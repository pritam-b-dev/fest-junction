import { redirect } from "next/navigation";
import { serverFetch } from "@/lib/serverFetch";
import { ApiResponse, Category, EventItem, Booking, User } from "@/lib/types";
import MyEventsManager from "@/components/MyEventsManager";

export default async function MyEventsPage() {
  const sessionRes = await serverFetch<ApiResponse<User>>("/auth/me");

  if (!sessionRes.ok || !sessionRes.data?.success || !sessionRes.data?.data) {
    redirect("/");
  }

  const role = sessionRes.data.data.role;
  if (role !== "ORGANIZER" && role !== "ADMIN") {
    redirect("/");
  }

  const [eventsRes, categoriesRes, bookingsRes] = await Promise.all([
    serverFetch<ApiResponse<EventItem[]>>("/events/my"),
    serverFetch<ApiResponse<Category[]>>("/categories"),
    serverFetch<ApiResponse<Booking[]>>("/bookings/organizer"),
  ]);

  const events = eventsRes.data?.data || [];
  const categories = categoriesRes.data?.data || [];
  const bookings = bookingsRes.data?.data || [];

  return (
    <MyEventsManager
      events={events}
      categories={categories}
      bookings={bookings}
    />
  );
}
