"use client";

import { useEffect, useState } from "react";
import { EntryType } from "@/lib/types";

type Row = {
  rank: number;
  profile_id: string;
  name: string;
  phone: string;
  total: number;
  breakdown: Record<EntryType, number>;
};

const MEDAL = ["🥇", "🥈", "🥉"];

export default function AdminLeaderboard() {
  const [rows, setRows] = useState<Row[] | null>(null);

  useEffect(() => {
    fetch("/api/admin/leaderboard")
      .then((r) => r.json())
      .then((d) => setRows(d.rows ?? []));
  }, []);

  if (!rows) return <p className="text-sm text-primary/50">Load ho raha hai...</p>;

  return (
    <div className="overflow-x-auto rounded-2xl bg-white shadow-sm ring-1 ring-primary/10">
      <table className="w-full text-left text-sm">
        <thead className="bg-primary-light text-primary/70">
          <tr>
            <th className="px-4 py-3 font-medium">#</th>
            <th className="px-4 py-3 font-medium">Naam</th>
            <th className="px-4 py-3 font-medium">Phone</th>
            <th className="px-4 py-3 font-medium">Durood</th>
            <th className="px-4 py-3 font-medium">Kalimah</th>
            <th className="px-4 py-3 font-medium">Para</th>
            <th className="px-4 py-3 font-medium">Surah</th>
            <th className="px-4 py-3 font-medium">Total</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.profile_id} className="border-t border-primary/5">
              <td className="px-4 py-3">
                {row.rank <= 3 ? MEDAL[row.rank - 1] : row.rank}
              </td>
              <td className="px-4 py-3 font-semibold text-primary">{row.name}</td>
              <td className="px-4 py-3 text-primary/60">{row.phone}</td>
              <td className="px-4 py-3 text-primary/60">{row.breakdown.durood}</td>
              <td className="px-4 py-3 text-primary/60">{row.breakdown.kalimah}</td>
              <td className="px-4 py-3 text-primary/60">{row.breakdown.para}</td>
              <td className="px-4 py-3 text-primary/60">{row.breakdown.surah}</td>
              <td className="px-4 py-3 font-bold text-primary">{row.total.toLocaleString()}</td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={8} className="px-4 py-6 text-center text-primary/50">
                Abhi tak koi entry nahi hai.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
