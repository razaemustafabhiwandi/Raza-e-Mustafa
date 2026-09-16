import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { requireAdmin } from "@/lib/adminAuth";
import { EntryType } from "@/lib/types";

export async function GET() {
  const adminId = await requireAdmin();
  if (!adminId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [{ data: entries, error: entriesError }, { data: profiles, error: profilesError }] =
    await Promise.all([
      supabaseAdmin.from("entries").select("profile_id, type, count"),
      supabaseAdmin.from("profiles").select("id, name, phone"),
    ]);

  if (entriesError) return NextResponse.json({ error: entriesError.message }, { status: 500 });
  if (profilesError) return NextResponse.json({ error: profilesError.message }, { status: 500 });

  const profileById = new Map((profiles ?? []).map((p) => [p.id, p]));
  const perProfile = new Map<
    string,
    { profile_id: string; total: number; breakdown: Record<EntryType, number> }
  >();

  for (const e of entries ?? []) {
    const existing = perProfile.get(e.profile_id);
    if (existing) {
      existing.total += e.count;
      existing.breakdown[e.type as EntryType] += e.count;
    } else {
      const breakdown: Record<EntryType, number> = { durood: 0, kalimah: 0, para: 0, surah: 0 };
      breakdown[e.type as EntryType] += e.count;
      perProfile.set(e.profile_id, { profile_id: e.profile_id, total: e.count, breakdown });
    }
  }

  const ranked = Array.from(perProfile.values()).sort((a, b) => b.total - a.total);

  // Admin view is not privacy-masked: every row shows the member's real name
  // and phone so admins can identify and follow up with contributors.
  const rows = ranked.map((r, i) => {
    const profile = profileById.get(r.profile_id);
    return {
      rank: i + 1,
      profile_id: r.profile_id,
      name: profile?.name ?? "Unknown",
      phone: profile?.phone ?? "-",
      total: r.total,
      breakdown: r.breakdown,
    };
  });

  const communityTotals: Record<EntryType, number> = { durood: 0, kalimah: 0, para: 0, surah: 0 };
  for (const e of entries ?? []) {
    communityTotals[e.type as EntryType] += e.count;
  }

  return NextResponse.json({ rows, totalMembers: ranked.length, communityTotals });
}
