"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getStoredProfileId } from "@/lib/profile-session";

export default function HeroCTA() {
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);

  useEffect(() => {
    setHasProfile(!!getStoredProfileId());
  }, []);

  if (hasProfile === null) return <div className="h-12" />;

  return (
    <div className="flex flex-wrap gap-3">
      <Link
        href={hasProfile ? "/dashboard" : "/join"}
        className="shine-btn rounded-full bg-primary px-6 py-3 text-sm font-semibold text-cream shadow-md transition hover:-translate-y-0.5 hover:bg-primary-dark hover:shadow-lg"
      >
        {hasProfile ? "Apna Count Update Karein" : "Abhi Shamil Hon"}
      </Link>
      {!hasProfile && (
        <Link
          href="/login"
          className="rounded-full border border-primary/20 bg-white/70 px-6 py-3 text-sm font-semibold text-primary transition hover:bg-white"
        >
          Pehle Se Account Hai? Login
        </Link>
      )}
    </div>
  );
}
