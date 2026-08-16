"use client";

import { useState } from "react";
import { ENTRY_TYPES, EntryType } from "@/lib/types";

export default function EntryForm({
  profileId,
  onAdded,
}: {
  profileId: string;
  onAdded: () => void;
}) {
  const [type, setType] = useState<EntryType>("durood");
  const [count, setCount] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch("/api/entries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profile_id: profileId, type, count: Number(count), note }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Kuch ghalat ho gaya.");
      return;
    }

    setCount("");
    setNote("");
    onAdded();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-primary/80">Type</label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {ENTRY_TYPES.map((t) => (
            <button
              type="button"
              key={t.value}
              onClick={() => setType(t.value)}
              className={`rounded-xl border px-3 py-2 text-sm font-medium transition ${
                type === t.value
                  ? "border-primary bg-primary text-cream"
                  : "border-primary/20 bg-white text-primary/70 hover:bg-white"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-primary/80">Count</label>
        <input
          required
          type="number"
          min={1}
          value={count}
          onChange={(e) => setCount(e.target.value)}
          className="w-full rounded-xl border border-primary/20 bg-white px-4 py-2.5 outline-none ring-primary focus:ring-2"
          placeholder="e.g. 100"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-primary/80">
          Note <span className="font-normal text-primary/40">(optional)</span>
        </label>
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full rounded-xl border border-primary/20 bg-white px-4 py-2.5 outline-none ring-primary focus:ring-2"
          placeholder="e.g. Para 5"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="shine-btn rounded-full bg-gold px-6 py-3 text-sm font-semibold text-primary-dark shadow-md transition hover:brightness-105 disabled:opacity-60"
      >
        {loading ? "Jama ho raha hai..." : "Count Jama Karein"}
      </button>
    </form>
  );
}
