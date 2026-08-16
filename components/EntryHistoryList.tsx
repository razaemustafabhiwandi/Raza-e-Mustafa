"use client";

import { useState } from "react";
import { Pencil, Trash2, Check, X } from "lucide-react";
import { Entry, EntryType, ENTRY_TYPES, entryTypeLabel } from "@/lib/types";

export default function EntryHistoryList({
  entries,
  profileId,
  onChanged,
}: {
  entries: Entry[];
  profileId: string;
  onChanged: () => void;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editType, setEditType] = useState<EntryType>("durood");
  const [editCount, setEditCount] = useState("");
  const [editNote, setEditNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  function startEdit(entry: Entry) {
    setEditingId(entry.id);
    setEditType(entry.type);
    setEditCount(String(entry.count));
    setEditNote(entry.note ?? "");
    setError(null);
  }

  function cancelEdit() {
    setEditingId(null);
    setError(null);
  }

  async function saveEdit(id: string) {
    setError(null);
    setBusy(true);
    const res = await fetch(`/api/entries/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        profile_id: profileId,
        type: editType,
        count: Number(editCount),
        note: editNote,
      }),
    });
    const data = await res.json();
    setBusy(false);

    if (!res.ok) {
      setError(data.error ?? "Kuch ghalat ho gaya.");
      return;
    }

    setEditingId(null);
    onChanged();
  }

  async function remove(id: string) {
    setBusy(true);
    await fetch(`/api/entries/${id}?profile_id=${profileId}`, { method: "DELETE" });
    setBusy(false);
    setConfirmingId(null);
    onChanged();
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-primary/10">
      <table className="w-full text-left text-sm">
        <thead className="bg-primary-light text-primary/70">
          <tr>
            <th className="px-4 py-3 font-medium">Type</th>
            <th className="px-4 py-3 font-medium">Count</th>
            <th className="px-4 py-3 font-medium">Note</th>
            <th className="px-4 py-3 font-medium">Tareekh</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {entries.map((e) =>
            editingId === e.id ? (
              <tr key={e.id} className="border-t border-primary/5 bg-primary-light/40">
                <td className="px-4 py-3">
                  <select
                    value={editType}
                    onChange={(ev) => setEditType(ev.target.value as EntryType)}
                    className="rounded-lg border border-primary/20 bg-white px-2 py-1 text-sm outline-none"
                  >
                    {ENTRY_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3">
                  <input
                    type="number"
                    min={1}
                    value={editCount}
                    onChange={(ev) => setEditCount(ev.target.value)}
                    className="w-20 rounded-lg border border-primary/20 bg-white px-2 py-1 text-sm outline-none"
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    value={editNote}
                    onChange={(ev) => setEditNote(ev.target.value)}
                    className="w-full rounded-lg border border-primary/20 bg-white px-2 py-1 text-sm outline-none"
                  />
                </td>
                <td className="px-4 py-3 text-primary/50">
                  {new Date(e.created_at).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                  })}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <button
                      disabled={busy}
                      onClick={() => saveEdit(e.id)}
                      title="Save"
                      className="rounded-full p-2 text-primary hover:bg-primary-light disabled:opacity-50"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                    <button
                      disabled={busy}
                      onClick={cancelEdit}
                      title="Cancel"
                      className="rounded-full p-2 text-primary/50 hover:bg-primary-light disabled:opacity-50"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
                </td>
              </tr>
            ) : (
              <tr key={e.id} className="border-t border-primary/5">
                <td className="px-4 py-3">{entryTypeLabel(e.type)}</td>
                <td className="px-4 py-3 font-semibold text-primary">{e.count}</td>
                <td className="px-4 py-3 text-primary/60">{e.note || "-"}</td>
                <td className="px-4 py-3 text-primary/50">
                  {new Date(e.created_at).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                  })}
                </td>
                <td className="px-4 py-3">
                  {confirmingId === e.id ? (
                    <div className="flex items-center gap-2 whitespace-nowrap">
                      <span className="text-xs text-primary/60">Pakka?</span>
                      <button
                        disabled={busy}
                        onClick={() => remove(e.id)}
                        className="rounded-full bg-red-500 px-2 py-1 text-xs font-semibold text-white disabled:opacity-50"
                      >
                        Haan
                      </button>
                      <button
                        disabled={busy}
                        onClick={() => setConfirmingId(null)}
                        className="rounded-full bg-primary-light px-2 py-1 text-xs font-semibold text-primary/70"
                      >
                        Nahi
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-1">
                      <button
                        disabled={busy}
                        onClick={() => startEdit(e)}
                        title="Edit"
                        className="rounded-full p-2 text-primary/60 hover:bg-primary-light disabled:opacity-50"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        disabled={busy}
                        onClick={() => setConfirmingId(e.id)}
                        title="Delete"
                        className="rounded-full p-2 text-red-500 hover:bg-red-50 disabled:opacity-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}
