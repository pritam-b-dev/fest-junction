"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Category, User, Booking } from "@/lib/types";
import { FiPlus, FiTrash2, FiEdit2, FiX } from "react-icons/fi";

interface AdminDashboardManagerProps {
  categories: Category[];
  users: User[];
  bookings: Booking[];
}

export default function AdminDashboardManager({
  categories,
  users,
  bookings,
}: AdminDashboardManagerProps) {
  const router = useRouter();

  const [categoryName, setCategoryName] = useState("");
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCreateOrUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) return;

    setLoading(true);

    try {
      const url = editingCategory
        ? `/api/categories/${editingCategory.id}`
        : "/api/categories";
      const method = editingCategory ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: categoryName }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        alert(data.message || "Failed to save category.");
        return;
      }

      setCategoryName("");
      setEditingCategory(null);
      router.refresh();
    } catch {
      alert("Error saving category.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Delete this category?")) return;

    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok || !data.success) {
        alert(data.message || "Failed to delete category.");
        return;
      }
      router.refresh();
    } catch {
      alert("Error deleting category.");
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm("Soft delete this user?")) return;

    try {
      const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok || !data.success) {
        alert(data.message || "Failed to delete user.");
        return;
      }
      router.refresh();
    } catch {
      alert("Error deleting user.");
    }
  };

  return (
    <div className="space-y-10">
      {/* Categories CRUD */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
        <h3 className="font-display font-bold text-lg text-white">
          Categories Management
        </h3>

        <form
          onSubmit={handleCreateOrUpdateCategory}
          className="flex gap-2 text-xs"
        >
          <input
            type="text"
            required
            placeholder="Category name..."
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-brand-primary"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2.5 rounded-xl bg-brand-primary text-white font-semibold flex items-center gap-1.5 hover:bg-brand-hover disabled:opacity-50"
          >
            <FiPlus className="w-4 h-4" />
            <span>{editingCategory ? "Update" : "Add"}</span>
          </button>
          {editingCategory && (
            <button
              type="button"
              onClick={() => {
                setEditingCategory(null);
                setCategoryName("");
              }}
              className="p-2.5 rounded-xl border border-slate-800 text-slate-400 hover:text-white"
            >
              <FiX className="w-4 h-4" />
            </button>
          )}
        </form>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="text-[11px] uppercase bg-slate-950 text-slate-400">
              <tr>
                <th className="p-3 rounded-l-xl">Name</th>
                <th className="p-3">Slug</th>
                <th className="p-3 text-right rounded-r-xl">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {categories.map((c) => (
                <tr key={c.id}>
                  <td className="p-3 font-semibold text-white">{c.name}</td>
                  <td className="p-3 text-slate-400">{c.slug}</td>
                  <td className="p-3 text-right space-x-2">
                    <button
                      onClick={() => {
                        setEditingCategory(c);
                        setCategoryName(c.name);
                      }}
                      className="text-slate-400 hover:text-white"
                    >
                      <FiEdit2 className="w-4 h-4 inline" />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(c.id)}
                      className="text-rose-400 hover:text-rose-300"
                    >
                      <FiTrash2 className="w-4 h-4 inline" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Users List */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
        <h3 className="font-display font-bold text-lg text-white">
          Users Directory
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="text-[11px] uppercase bg-slate-950 text-slate-400">
              <tr>
                <th className="p-3 rounded-l-xl">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Role</th>
                <th className="p-3 text-right rounded-r-xl">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {users.map((u) => (
                <tr key={u.id}>
                  <td className="p-3 font-semibold text-white">{u.name}</td>
                  <td className="p-3 text-slate-400">{u.email}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300">
                      {u.role}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => handleDeleteUser(u.id)}
                      className="text-rose-400 hover:text-rose-300"
                      title="Soft Delete"
                    >
                      <FiTrash2 className="w-4 h-4 inline" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* All Bookings Table */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
        <h3 className="font-display font-bold text-lg text-white">
          All System Bookings
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="text-[11px] uppercase bg-slate-950 text-slate-400">
              <tr>
                <th className="p-3 rounded-l-xl">Event</th>
                <th className="p-3">Seats</th>
                <th className="p-3">Total</th>
                <th className="p-3 rounded-r-xl">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {bookings.map((b) => (
                <tr key={b.id}>
                  <td className="p-3 font-semibold text-white">
                    {b.event?.title || "Event ID: " + b.eventId}
                  </td>
                  <td className="p-3">{b.seats}</td>
                  <td className="p-3 font-bold text-white">${b.totalPrice}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300">
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
