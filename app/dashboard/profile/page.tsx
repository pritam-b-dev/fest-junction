"use client";

import { useState } from "react";
import { useSession } from "@/lib/useSession";
import { User } from "@/lib/types";
import {
  FiUser,
  FiPhone,
  FiImage,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";

interface ProfileFormProps {
  user: User;
  refetchSession: () => Promise<void>;
}

function ProfileForm({ user, refetchSession }: ProfileFormProps) {
  const [name, setName] = useState(user.name || "");
  const [phone, setPhone] = useState(user.phone || "");
  const [avatar, setAvatar] = useState(user.avatar || "");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError(null);

    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, avatar }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to update profile");
      }

      setSuccess(true);
      await refetchSession();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5"
    >
      {success && (
        <div className="bg-emerald-950/40 border border-emerald-800/60 rounded-xl p-4 flex items-center gap-3 text-emerald-300 text-xs">
          <FiCheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>Profile updated successfully!</span>
        </div>
      )}

      {error && (
        <div className="bg-rose-950/40 border border-rose-800/60 rounded-xl p-4 flex items-center gap-3 text-rose-300 text-xs">
          <FiAlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-300 flex items-center gap-2">
          <FiUser className="w-3.5 h-3.5 text-brand-primary" />
          <span>Full Name</span>
        </label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-primary"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-300 flex items-center gap-2">
          <FiPhone className="w-3.5 h-3.5 text-brand-accent" />
          <span>Phone Number</span>
        </label>
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+1 234 567 890"
          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-primary"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-300 flex items-center gap-2">
          <FiImage className="w-3.5 h-3.5 text-cyan-400" />
          <span>Avatar URL</span>
        </label>
        <input
          type="url"
          value={avatar}
          onChange={(e) => setAvatar(e.target.value)}
          placeholder="https://example.com/avatar.jpg"
          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-primary"
        />
      </div>

      <div className="pt-2 flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2.5 rounded-xl bg-brand-primary text-white text-xs font-semibold hover:bg-brand-hover transition-colors disabled:opacity-50"
        >
          {loading ? "Saving Changes..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}

export default function ProfilePage() {
  const { user, loading, refetchSession } = useSession();

  if (loading || !user) {
    return (
      <div className="space-y-6">
        <h2 className="font-display text-xl font-bold text-white">
          Profile Settings
        </h2>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-slate-400 text-xs">
          Loading user profile...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="font-display text-xl font-bold text-white">
        Profile Settings
      </h2>
      <ProfileForm key={user.id} user={user} refetchSession={refetchSession} />
    </div>
  );
}
