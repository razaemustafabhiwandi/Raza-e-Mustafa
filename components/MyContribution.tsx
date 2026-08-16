"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getStoredProfileId } from "@/lib/profile-session";
import { ENTRY_TYPES, EntryType } from "@/lib/types";

export default function MyContribution() {
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);
  const [totals, setTotals] = useState<Record<EntryType, number> | null>(null);

  useEffect(() => {
    const id = getStoredProfileId();
    if (!id) {
      setHasProfile(false);
      return;
    }
    setHasProfile(true);
    fetch(`/api/profiles/${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setTotals(d?.totals ?? null))
      .catch(() => setTotals(null));
  }, []);

  if (hasProfile === null) return null;

  if (!hasProfile) {
    return (
      <div className="mt-6 rounded-xl bg-white/10 px-5 py-4 text-sm text-cream/80">
        Abhi tak aapne apna contribution darj nahi kiya &mdash;{" "}
        <Link href="/join" className="font-semibold text-gold underline underline-offset-2">
          shamil hokar shuru karein
        </Link>
        .
      </div>
    );
  }

  return (
    <div className="mt-6">
      <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-gold">
        Aapka Contribution
      </p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {ENTRY_TYPES.map((t) => (
          <div key={t.value} className="rounded-xl bg-white/10 px-3 py-3">
            <div className="text-xl font-black text-gold">
              {totals ? totals[t.value].toLocaleString() : "–"}
            </div>
            <div className="mt-0.5 text-xs text-cream/70">{t.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
