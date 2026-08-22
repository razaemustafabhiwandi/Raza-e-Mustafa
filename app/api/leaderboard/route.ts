import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { EntryType } from "@/lib/types";

export async function GET(req: NextRequest) {
  const viewerId = req.nextUrl.searchParams.get("profile_id") ?? "";
  const limit = Math.min(Number(req.nextUrl.searchParams.get("limit")) || 50, 100);

  const [{ data: entries, error: entriesError }, { data: profiles, error: profilesError }] =
    await Promise.all([
      supabaseAdmin.from("entries").select("profile_id, type, count"),
      supabaseAdmin.from("profiles").select("id, name"),
    ]);

  if (entriesError) return NextResponse.json({ error: entriesError.message }, { status: 500 });
  if (profilesError) return NextResponse.json({ error: profilesError.message }, { status: 500 });

  const nameById = new Map((profiles ?? []).map((p) => [p.id, p.name]));
  const perProfile = new Map<string, { profile_id: string; total: number }>();

  for (const e of entries ?? []) {
    const existing = perProfile.get(e.profile_id);
    if (existing) existing.total += e.count;
    else perProfile.set(e.profile_id, { profile_id: e.profile_id, total: e.count });
  }

  const ranked = Array.from(perProfile.values()).sort((a, b) => b.total - a.total);

  // Always let the viewer see their own rank/row even if it falls outside the
  // requested top-N slice, so "kahan hoon main" always has an answer.
  const top = ranked.slice(0, limit);
  const viewerRankIndex = ranked.findIndex((r) => r.profile_id === viewerId);
  const viewerInTop = top.some((r) => r.profile_id === viewerId);
  const viewerRow =
    viewerId && !viewerInTop && viewerRankIndex !== -1 ? ranked[viewerRankIndex] : null;

  function toEntry(r: { profile_id: string; total: number }, rank: number) {
    const isYou = r.profile_id === viewerId;
    const name = nameById.get(r.profile_id) ?? "Member";
    return {
      rank,
      total: r.total,
      // Privacy: real names are only ever sent for the viewer's own row.
      // Every other row's name is withheld entirely (null) — the client
      // renders a clean, consistent placeholder instead of a masked string.
      name: isYou ? name : null,
      isYou,
    };
  }

  const topContributors = top.map((r, i) => toEntry(r, i + 1));
  const you = viewerRow ? toEntry(viewerRow, viewerRankIndex + 1) : null;

  const totals: Record<EntryType, number> = { durood: 0, kalimah: 0, para: 0, surah: 0 };
  for (const e of entries ?? []) {
    totals[e.type as EntryType] += e.count;
  }

  return NextResponse.json({
    topContributors,
    you,
    totalMembers: ranked.length,
    communityTotals: totals,
  });
}
