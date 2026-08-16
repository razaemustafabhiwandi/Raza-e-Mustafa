"use client";

import { useState } from "react";
import { Megaphone, ChevronRight } from "lucide-react";
import { Announcement } from "@/lib/types";
import AnnouncementModal from "@/components/AnnouncementModal";

export default function HomeAnnouncements({ announcements }: { announcements: Announcement[] }) {
  const [selected, setSelected] = useState<Announcement | null>(null);

  if (announcements.length === 0) {
    return (
      <div className="glow-card rounded-2xl bg-white p-6 text-center text-sm text-primary/50">
        Abhi tak koi elaan nahi hai.
      </div>
    );
  }

  const [latest, ...rest] = announcements;

  return (
    <>
      <button
        onClick={() => setSelected(latest)}
        className="glow-card group flex w-full items-center gap-4 rounded-2xl bg-white p-5 text-left shadow-md transition hover:-translate-y-0.5 hover:shadow-lg"
      >
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold-light text-gold">
          <Megaphone className="h-5 w-5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-2">
            <span className="rounded-full bg-gold px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary-dark">
              Naya Elaan
            </span>
          </span>
          <span className="mt-1 block truncate font-semibold text-primary">{latest.title}</span>
        </span>
        <ChevronRight className="h-5 w-5 shrink-0 text-primary/40 transition group-hover:translate-x-1 group-hover:text-primary" />
      </button>

      {rest.length > 0 && (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {rest.map((a) => (
            <button
              key={a.id}
              onClick={() => setSelected(a)}
              className="rounded-xl bg-white p-4 text-left text-sm shadow-sm ring-1 ring-primary/10 transition hover:bg-white"
            >
              <span className="block truncate font-medium text-primary">{a.title}</span>
              <span className="mt-1 block truncate text-xs text-primary/50">{a.body}</span>
            </button>
          ))}
        </div>
      )}

      <AnnouncementModal announcement={selected} onClose={() => setSelected(null)} />
    </>
  );
}
