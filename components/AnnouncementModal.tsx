"use client";

import { useEffect } from "react";
import { X, Megaphone } from "lucide-react";
import { Announcement } from "@/lib/types";

export default function AnnouncementModal({
  announcement,
  onClose,
}: {
  announcement: Announcement | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!announcement) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [announcement, onClose]);

  if (!announcement) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="glow-card relative w-full max-w-lg rounded-2xl bg-cream p-6 shadow-2xl"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1.5 text-primary/50 hover:bg-primary-light hover:text-primary"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-start gap-3 pr-6">
          <Megaphone className="mt-1 h-6 w-6 shrink-0 text-gold" />
          <div>
            <h3 className="font-heading text-xl font-semibold text-primary">
              {announcement.title}
            </h3>
            <p className="mt-1 text-xs text-primary/40">
              {new Date(announcement.created_at).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-primary/80">
          {announcement.body}
        </p>
      </div>
    </div>
  );
}
