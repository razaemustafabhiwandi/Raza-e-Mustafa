"use client";

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { entryTypeLabel } from "@/lib/types";

type EntryRow = {
  id: string;
  type: string;
  count: number;
  note: string | null;
  created_at: string;
  profiles: { name: string; phone: string } | null;
};

export default function AdminEntries() {
  const [entries, setEntries] = useState<EntryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/entries");
    const data = await res.json();
    setEntries(data.entries ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function remove(id: string) {
    await fetch(`/api/admin/entries/${id}`, { method: "DELETE" });
    setConfirmingId(null);
    load();
  }

  if (loading) return <p className="text-sm text-primary/50">Load ho raha hai...</p>;

  return (
    <div className="overflow-x-auto rounded-2xl bg-white/80 shadow-sm ring-1 ring-primary/10">
      <table className="w-full text-left text-sm">
        <thead className="bg-primary-light text-primary/70">
          <tr>
            <th className="px-4 py-3 font-medium">Member</th>
            <th className="px-4 py-3 font-medium">Type</th>
            <th className="px-4 py-3 font-medium">Count</th>
            <th className="px-4 py-3 font-medium">Note</th>
            <th className="px-4 py-3 font-medium">Tareekh</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {entries.map((e) => (
            <tr key={e.id} className="border-t border-primary/5">
              <td className="px-4 py-3">{e.profiles?.name ?? "-"}</td>
              <td className="px-4 py-3">{entryTypeLabel(e.type)}</td>
              <td className="px-4 py-3 font-semibold text-primary">{e.count}</td>
              <td className="px-4 py-3 text-primary/60">{e.note || "-"}</td>
              <td className="px-4 py-3 text-primary/50">
                {new Date(e.created_at).toLocaleDateString("en-IN")}
              </td>
              <td className="px-4 py-3">
                {confirmingId === e.id ? (
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    <span className="text-xs text-primary/60">Pakka?</span>
                    <button
                      onClick={() => remove(e.id)}
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
                    onClick={() => setConfirmingId(e.id)}
                    className="rounded-full p-2 text-red-500 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </td>
            </tr>
          ))}
          {entries.length === 0 && (
            <tr>
              <td colSpan={6} className="px-4 py-6 text-center text-primary/50">
                Koi entry nahi hai.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
