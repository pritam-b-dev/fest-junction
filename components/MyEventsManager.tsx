"use client";
import BookingStatusActions from "@/components/BookingStatusActions";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Category, EventItem, Booking } from "@/lib/types";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiX,
  FiCalendar,
  FiUsers,
} from "react-icons/fi";

interface MyEventsManagerProps {
  events: EventItem[];
  categories: Category[];
  bookings: Booking[];
}

export default function MyEventsManager({
  events,
  categories,
  bookings,
}: MyEventsManagerProps) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState(0);
  const [capacity, setCapacity] = useState(100);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED" | "CANCELLED">(
    "PUBLISHED",
  );

  const bookingCounts: Record<string, number> = {};
  bookings.forEach((b) => {
    if (b.status !== "CANCELLED") {
      bookingCounts[b.eventId] =
        (bookingCounts[b.eventId] || 0) + (b.seats || 1);
    }
  });

  const openCreateModal = () => {
    setEditingEvent(null);
    setTitle("");
    setDescription("");
    setImages("");
    setLocation("");
    setPrice(0);
    setCapacity(100);
    setStartDate("");
    setEndDate("");
    setCategoryId(categories[0]?.id || "");
    setStatus("PUBLISHED");
    setError(null);
    setShowModal(true);
  };

  const openEditModal = (event: EventItem) => {
    setEditingEvent(event);
    setTitle(event.title);
    setDescription(event.description || "");
    setImages(event.images?.join(", ") || "");
    setLocation(event.location || "");
    setPrice(event.price);
    setCapacity(event.capacity);
    setStartDate(
      event.startDate
        ? new Date(event.startDate).toISOString().slice(0, 16)
        : "",
    );
    setEndDate(
      event.endDate ? new Date(event.endDate).toISOString().slice(0, 16) : "",
    );
    setCategoryId(
      event.categoryId || event.category?.id || categories[0]?.id || "",
    );
    setStatus(event.status);
    setError(null);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const imageList = images
      .split(",")
      .map((url) => url.trim())
      .filter(Boolean);

    const payload = {
      title,
      description,
      images: imageList,
      location,
      price: Number(price),
      capacity: Number(capacity),
      startDate: new Date(startDate).toISOString(),
      endDate: endDate ? new Date(endDate).toISOString() : undefined,
      categoryId,
      status,
    };

    try {
      const url = editingEvent
        ? `/api/events/${editingEvent.id}`
        : "/api/events";
      const method = editingEvent ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to save event.");
      }

      setShowModal(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;

    try {
      const res = await fetch(`/api/events/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok || !data.success) {
        alert(data.message || "Failed to delete event.");
        return;
      }
      router.refresh();
    } catch {
      alert("Error deleting event.");
    }
  };

  const getStatusBadge = (st: string) => {
    switch (st) {
      case "PUBLISHED":
        return "bg-emerald-950/80 text-emerald-400 border-emerald-800/80";
      case "DRAFT":
        return "bg-amber-950/80 text-amber-400 border-amber-800/80";
      case "CANCELLED":
        return "bg-rose-950/80 text-rose-400 border-rose-800/80";
      default:
        return "bg-slate-800 text-slate-300 border-slate-700";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-bold text-white">
            My Events
          </h2>
          <p className="text-xs text-slate-400">
            Manage your created events and drafts
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-primary text-white text-xs font-semibold hover:bg-brand-hover transition-colors shadow-lg shadow-violet-950/40"
        >
          <FiPlus className="w-4 h-4" />
          <span>Create Event</span>
        </button>
      </div>

      {events.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 text-xs">
          No events created yet. Click &quot;Create Event&quot; above to publish
          your first event.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {events.map((event) => {
            const booked = bookingCounts[event.id] || event.bookedSeats || 0;
            return (
              <div
                key={event.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${getStatusBadge(event.status)}`}
                    >
                      {event.status}
                    </span>
                    <span className="text-[11px] text-brand-accent font-medium">
                      {event.category?.name || "Uncategorized"}
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-white text-base">
                    {event.title}
                  </h3>
                  <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
                    <span className="flex items-center gap-1">
                      <FiCalendar className="w-3.5 h-3.5 text-brand-primary" />
                      {new Date(event.startDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    <span className="flex items-center gap-1">
                      <FiUsers className="w-3.5 h-3.5 text-emerald-400" />
                      {booked} / {event.capacity} Booked
                    </span>
                    <span className="font-bold text-white">${event.price}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => openEditModal(event)}
                    className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
                    title="Edit"
                  >
                    <FiEdit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(event.id)}
                    className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-rose-400 hover:text-rose-300 hover:border-rose-900/60 transition-colors"
                    title="Delete"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
      <div className="space-y-4">
        <h2 className="font-display text-xl font-bold text-white">
          Booking Requests
        </h2>
        {bookings.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-400 text-xs">
            No bookings yet for your events.
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="text-[11px] uppercase bg-slate-950 text-slate-400">
                <tr>
                  <th className="p-3">Event</th>
                  <th className="p-3">Attendee</th>
                  <th className="p-3">Seats</th>
                  <th className="p-3">Total</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {bookings.map((b) => (
                  <tr key={b.id}>
                    <td className="p-3 font-semibold text-white">
                      {b.event?.title || "—"}
                    </td>
                    <td className="p-3 text-slate-400">
                      {b.user?.name || b.userId}
                    </td>
                    <td className="p-3">{b.seats}</td>
                    <td className="p-3 font-bold text-white">
                      ${b.totalPrice}
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300">
                        {b.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <BookingStatusActions
                        bookingId={b.id}
                        status={b.status}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl p-6 space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="font-display font-bold text-lg text-white">
                {editingEvent ? "Edit Event" : "Create New Event"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <p className="text-xs text-rose-400 bg-rose-950/40 p-3 rounded-xl border border-rose-900/40">
                {error}
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">
                    Category
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-brand-primary"
                  >
                    <option value="" disabled>
                      Select category
                    </option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Status</label>
                  <select
                    value={status}
                    onChange={(e) =>
                      setStatus(
                        e.target.value as "DRAFT" | "PUBLISHED" | "CANCELLED",
                      )
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-brand-primary"
                  >
                    <option value="PUBLISHED">Published</option>
                    <option value="DRAFT">Draft</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">
                  Image URLs (comma-separated)
                </label>
                <input
                  type="text"
                  value={images}
                  onChange={(e) => setImages(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">
                    Location
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-brand-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-brand-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">
                    Capacity
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={capacity}
                    onChange={(e) => setCapacity(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-brand-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">
                    Start Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-brand-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">
                    End Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-brand-primary"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-800 text-slate-300 font-semibold hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 rounded-xl bg-brand-primary text-white font-semibold hover:bg-brand-hover disabled:opacity-50"
                >
                  {loading
                    ? "Saving..."
                    : editingEvent
                      ? "Update Event"
                      : "Create Event"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
