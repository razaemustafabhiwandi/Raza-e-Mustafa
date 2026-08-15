"use client";

import { useEffect, useState } from "react";
import StatCard from "@/components/StatCard";
import { ENTRY_TYPES, EntryType } from "@/lib/types";

type Stats = {
  memberCount: number;
  entryCount: number;
  announcementCount: number;
  communityTotals: Record<EntryType, number>;
};

export default function AdminStats() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((d) => setStats(d));
  }, []);

  if (!stats) return <p className="text-primary/50">Load ho raha hai...</p>;

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      <StatCard label="Members" value={stats.memberCount} />
      <StatCard label="Total Entries" value={stats.entryCount} />
      <StatCard label="Announcements" value={stats.announcementCount} />
      {ENTRY_TYPES.map((t) => (
        <StatCard key={t.value} label={t.label} value={stats.communityTotals[t.value]} />
      ))}
    </div>
  );
}
