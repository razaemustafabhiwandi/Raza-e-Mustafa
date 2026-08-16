"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getStoredProfileId } from "@/lib/profile-session";

export default function HeroCTA({
  joinLabel = "Abhi Shamil Hon",
  dashboardLabel = "Apna Count Update Karein",
  hideSecondary = false,
  variant = "primary",
}: {
  joinLabel?: string;
  dashboardLabel?: string;
  hideSecondary?: boolean;
  variant?: "primary" | "gold";
}) {
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);

  useEffect(() => {
    setHasProfile(!!getStoredProfileId());
  }, []);

  if (hasProfile === null) return <div className="h-12" />;

  const primaryClass =
    variant === "gold"
      ? "shine-btn rounded-full bg-gold px-6 py-3 text-sm font-semibold text-primary-dark shadow-md transition hover:-translate-y-0.5 hover:brightness-105 hover:shadow-lg"
      : "shine-btn rounded-full bg-primary px-6 py-3 text-sm font-semibold text-cream shadow-md transition hover:-translate-y-0.5 hover:bg-primary-dark hover:shadow-lg";

  return (
    <div className="flex flex-wrap justify-center gap-3">
      <Link href={hasProfile ? "/dashboard" : "/join"} className={primaryClass}>
        {hasProfile ? dashboardLabel : joinLabel}
      </Link>
      {!hasProfile && !hideSecondary && (
        <Link
          href="/login"
          className="rounded-full border border-primary/20 bg-white px-6 py-3 text-sm font-semibold text-primary transition hover:bg-white"
        >
          Pehle Se Account Hai? Login
        </Link>
      )}
    </div>
  );
}
