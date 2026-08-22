"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Lock } from "lucide-react";
import { getStoredProfileId } from "@/lib/profile-session";

type Row = { rank: number; total: number; name: string | null; isYou: boolean };

const MEDAL = ["🥇", "🥈", "🥉"];

function RankBadge({ rank }: { rank: number }) {
  if (rank <= 3) {
    return (
      <span className="flex h-9 w-9 shrink-0 items-center justify-center text-2xl">
        {MEDAL[rank - 1]}
      </span>
    );
  }
  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-light text-sm font-bold text-primary">
      {rank}
    </span>
  );
}

function RowItem({ row, dark = false }: { row: Row; dark?: boolean }) {
  return (
    <li
      className={`flex items-center justify-between gap-3 rounded-xl px-4 py-3 shadow-sm sm:px-5 ${
        row.isYou
          ? "bg-gold-light ring-2 ring-gold"
          : dark
          ? "bg-white/10"
          : "bg-white ring-1 ring-primary/10"
      }`}
    >
      <div className="flex min-w-0 items-center gap-3">
        <RankBadge rank={row.rank} />
        {row.name === null ? (
          <span
            className={`flex items-center gap-1.5 truncate italic ${
              dark ? "text-cream/50" : "text-primary/40"
            }`}
          >
            <Lock className="h-3.5 w-3.5 shrink-0" />
            Jamat Member
          </span>
        ) : (
          <span className={`truncate font-semibold ${row.isYou ? "text-primary" : dark ? "text-cream" : "text-red"}`}>
            {row.name}
          </span>
        )}
        {row.isYou && (
          <span className="shrink-0 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold uppercase text-cream">
            Aap
          </span>
        )}
      </div>
      <span
        className={`shrink-0 rounded-lg px-2 py-0.5 font-bold ${
          row.isYou ? "bg-primary text-cream" : "bg-gold text-primary-dark"
        }`}
      >
        {row.total.toLocaleString()}
      </span>
    </li>
  );
}

export default function LeaderboardList({
  limit = 50,
  dark = false,
  showLink = false,
}: {
  limit?: number;
  dark?: boolean;
  showLink?: boolean;
}) {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [you, setYou] = useState<Row | null>(null);

  useEffect(() => {
    const profileId = getStoredProfileId();
    const qs = new URLSearchParams({ limit: String(limit) });
    if (profileId) qs.set("profile_id", profileId);

    fetch(`/api/leaderboard?${qs}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        setRows(d?.topContributors ?? []);
        setYou(d?.you ?? null);
      })
      .catch(() => setRows([]));
  }, [limit]);

  if (rows === null) {
    return (
      <p className={`text-sm ${dark ? "text-cream/60" : "text-primary/50"}`}>Load ho raha hai...</p>
    );
  }

  if (rows.length === 0) {
    return (
      <p className={`rounded-2xl p-6 text-center text-sm ${dark ? "bg-white/10 text-cream/70" : "bg-white text-primary/50"}`}>
        Abhi tak koi entry nahi hai. Sabse pehle shamil hon!
      </p>
    );
  }

  return (
    <div>
      <ol className="flex flex-col gap-2">
        {rows.map((row) => (
          <RowItem key={row.rank} row={row} dark={dark} />
        ))}
      </ol>

      {you && (
        <div className="mt-4">
          <p className={`mb-2 text-xs font-semibold uppercase tracking-widest ${dark ? "text-gold" : "text-primary/50"}`}>
            Aapki Position
          </p>
          <ol>
            <RowItem row={you} dark={dark} />
          </ol>
        </div>
      )}

      {showLink && (
        <Link
          href="/leaderboard"
          className={`mt-3 inline-block text-xs underline underline-offset-2 ${
            dark ? "text-cream/60 hover:text-cream" : "text-primary/60 hover:text-primary"
          }`}
        >
          Poora Leaderboard Dekhein &rarr;
        </Link>
      )}
    </div>
  );
}
