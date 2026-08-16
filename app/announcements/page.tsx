import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { Announcement } from "@/lib/types";
import AnnouncementCard from "@/components/AnnouncementCard";

export const revalidate = 0;

export default async function AnnouncementsPage() {
  const { data } = await supabaseAdmin
    .from("announcements")
    .select("id, title, body, is_active, created_at")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  const announcements = (data ?? []) as Announcement[];

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="mb-8 font-heading text-3xl font-bold text-primary">Elaan (Announcements)</h1>

      {announcements.length === 0 ? (
        <p className="rounded-2xl bg-white p-6 text-center text-sm text-primary/50">
          Abhi tak koi elaan nahi hai.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {announcements.map((a) => (
            <AnnouncementCard key={a.id} announcement={a} />
          ))}
        </div>
      )}
    </div>
  );
}
