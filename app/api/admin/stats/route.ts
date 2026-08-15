import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { requireAdmin } from "@/lib/adminAuth";
import { EntryType } from "@/lib/types";

export async function GET() {
  const adminId = await requireAdmin();
  if (!adminId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [{ count: memberCount }, { count: entryCount }, { count: announcementCount }, { data: entries }] =
    await Promise.all([
      supabaseAdmin.from("profiles").select("id", { count: "exact", head: true }),
      supabaseAdmin.from("entries").select("id", { count: "exact", head: true }),
      supabaseAdmin.from("announcements").select("id", { count: "exact", head: true }),
      supabaseAdmin.from("entries").select("type, count"),
    ]);

  const communityTotals: Record<EntryType, number> = { durood: 0, kalimah: 0, para: 0, surah: 0 };
  for (const e of entries ?? []) {
    communityTotals[e.type as EntryType] += e.count;
  }

  return NextResponse.json({
    memberCount: memberCount ?? 0,
    entryCount: entryCount ?? 0,
    announcementCount: announcementCount ?? 0,
    communityTotals,
  });
}
