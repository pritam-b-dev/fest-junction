import { redirect } from "next/navigation";
import { serverFetch } from "@/lib/serverFetch";
import { ApiResponse, Category, User, Booking } from "@/lib/types";
import AdminDashboardManager from "@/components/AdminDashboardManager";

export default async function AdminPage() {
  const sessionRes = await serverFetch<ApiResponse<User>>("/auth/me");

  if (!sessionRes.ok || !sessionRes.data?.success || !sessionRes.data?.data) {
    redirect("/");
  }

  if (sessionRes.data.data.role !== "ADMIN") {
    redirect("/");
  }

  const [categoriesRes, usersRes, bookingsRes] = await Promise.all([
    serverFetch<ApiResponse<Category[]>>("/categories"),
    serverFetch<ApiResponse<User[]>>("/users"),
    serverFetch<ApiResponse<Booking[]>>("/bookings"),
  ]);

  const categories = categoriesRes.data?.data || [];
  const users = usersRes.data?.data || [];
  const bookings = bookingsRes.data?.data || [];

  return (
    <AdminDashboardManager
      categories={categories}
      users={users}
      bookings={bookings}
    />
  );
}
