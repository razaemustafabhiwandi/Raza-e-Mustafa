import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { EntryType } from "@/lib/types";

export async function GET() {
  const [{ data: entries, error: entriesError }, { data: profiles, error: profilesError }] =
    await Promise.all([
      supabaseAdmin.from("entries").select("profile_id, type, count"),
      supabaseAdmin.from("profiles").select("id, name"),
    ]);

  if (entriesError) return NextResponse.json({ error: entriesError.message }, { status: 500 });
  if (profilesError) return NextResponse.json({ error: profilesError.message }, { status: 500 });

  const nameById = new Map((profiles ?? []).map((p) => [p.id, p.name]));

  const communityTotals: Record<EntryType, number> = { durood: 0, kalimah: 0, para: 0, surah: 0 };
  const perProfile = new Map<string, { profile_id: string; name: string; total: number }>();

  for (const e of entries ?? []) {
    const type = e.type as EntryType;
    communityTotals[type] += e.count;

    const existing = perProfile.get(e.profile_id);
    if (existing) {
      existing.total += e.count;
    } else {
      perProfile.set(e.profile_id, {
        profile_id: e.profile_id,
        name: nameById.get(e.profile_id) ?? "Member",
        total: e.count,
      });
    }
  }

  const topContributors = Array.from(perProfile.values())
    .sort((a, b) => b.total - a.total)
    .slice(0, 50);

  const overall = Object.values(communityTotals).reduce((a, b) => a + b, 0);

  return NextResponse.json({
    communityTotals,
    overall,
    memberCount: profiles?.length ?? 0,
    topContributors,
  });
}
