import { Megaphone } from "lucide-react";
import { Announcement } from "@/lib/types";

export default function AnnouncementCard({ announcement }: { announcement: Announcement }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-primary/10">
      <div className="flex items-start gap-3">
        <Megaphone className="mt-1 h-5 w-5 shrink-0 text-gold" />
        <div>
          <h3 className="font-semibold text-primary">{announcement.title}</h3>
          <p className="mt-1 whitespace-pre-wrap text-sm text-primary/70">{announcement.body}</p>
          <p className="mt-2 text-xs text-primary/40">
            {new Date(announcement.created_at).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      </div>
    </div>
  );
}
