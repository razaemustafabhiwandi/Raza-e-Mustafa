"use client";

import { useEffect, useState } from "react";
import { Trash2, EyeOff, Eye } from "lucide-react";
import { Announcement } from "@/lib/types";

export default function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  async function load() {
    const res = await fetch("/api/admin/announcements");
    const data = await res.json();
    setAnnouncements(data.announcements ?? []);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await fetch("/api/admin/announcements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, body }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "Kuch ghalat ho gaya.");
      return;
    }
    setTitle("");
    setBody("");
    load();
  }

  async function toggleActive(a: Announcement) {
    await fetch(`/api/admin/announcements/${a.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_active: !a.is_active }),
    });
    load();
  }

  async function remove(id: string) {
    await fetch(`/api/admin/announcements/${id}`, { method: "DELETE" });
    setConfirmingId(null);
    load();
  }

  return (
    <div className="flex flex-col gap-8">
      <form
        onSubmit={handleCreate}
        className="flex flex-col gap-3 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-primary/10"
      >
        <h3 className="font-semibold text-primary">Naya Elaan</h3>
        <input
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="rounded-xl border border-primary/20 bg-white px-4 py-2.5 outline-none ring-primary focus:ring-2"
        />
        <textarea
          required
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Elaan ka matn..."
          rows={3}
          className="rounded-xl border border-primary/20 bg-white px-4 py-2.5 outline-none ring-primary focus:ring-2"
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          disabled={loading}
          className="self-start rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-cream disabled:opacity-60"
        >
          {loading ? "..." : "Post Karein"}
        </button>
      </form>

      <div className="flex flex-col gap-3">
        {announcements.map((a) => (
          <div
            key={a.id}
            className={`rounded-2xl p-5 shadow-sm ring-1 ring-primary/10 ${
              a.is_active ? "bg-white" : "bg-white/40 opacity-60"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-semibold text-primary">{a.title}</h3>
                <p className="mt-1 whitespace-pre-wrap text-sm text-primary/70">{a.body}</p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <button
                  onClick={() => toggleActive(a)}
                  title={a.is_active ? "Hide" : "Show"}
                  className="rounded-full p-2 text-primary/60 hover:bg-primary-light"
                >
                  {a.is_active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
                {confirmingId === a.id ? (
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    <span className="text-xs text-primary/60">Pakka?</span>
                    <button
                      onClick={() => remove(a.id)}
                      className="rounded-full bg-red-500 px-2 py-1 text-xs font-semibold text-white"
                    >
                      Haan
                    </button>
                    <button
                      onClick={() => setConfirmingId(null)}
                      className="rounded-full bg-primary-light px-2 py-1 text-xs font-semibold text-primary/70"
                    >
                      Nahi
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmingId(a.id)}
                    title="Delete"
                    className="rounded-full p-2 text-red-500 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        {announcements.length === 0 && (
          <p className="text-sm text-primary/50">Koi announcement nahi hai.</p>
        )}
      </div>
    </div>
  );
}
