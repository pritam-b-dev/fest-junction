import { redirect } from "next/navigation";
import { serverFetch } from "@/lib/serverFetch";
import { ApiResponse, User } from "@/lib/types";
import DashboardNav from "@/components/DashboardNav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sessionRes = await serverFetch<ApiResponse<User>>("/auth/me");

  if (!sessionRes.ok || !sessionRes.data?.success || !sessionRes.data?.data) {
    redirect("/login");
  }

  const user = sessionRes.data.data;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-slate-800 pb-6 flex flex-wrap justify-between items-end gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-accent">
            Dashboard
          </span>
          <h1 className="font-display text-3xl font-extrabold text-white">
            Welcome back, {user.name}
          </h1>
        </div>
        <div className="text-xs text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">
          Role:{" "}
          <span className="font-bold text-white capitalize">
            {user.role.toLowerCase()}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1">
          <DashboardNav userRole={user.role} />
        </aside>

        <main className="lg:col-span-3">{children}</main>
      </div>
    </div>
  );
}
