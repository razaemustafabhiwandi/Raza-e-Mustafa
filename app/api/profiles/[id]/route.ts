import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { EntryType } from "@/lib/types";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const { data: profile, error: profileError } = await supabaseAdmin
    .from("profiles")
    .select()
    .eq("id", id)
    .maybeSingle();

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 500 });
  }
  if (!profile) {
    return NextResponse.json({ error: "Profile nahi mila." }, { status: 404 });
  }

  const { data: entries, error: entriesError } = await supabaseAdmin
    .from("entries")
    .select("type, count")
    .eq("profile_id", id);

  if (entriesError) {
    return NextResponse.json({ error: entriesError.message }, { status: 500 });
  }

  const totals: Record<EntryType, number> = {
    durood: 0,
    kalimah: 0,
    para: 0,
    surah: 0,
  };
  for (const e of entries ?? []) {
    totals[e.type as EntryType] += e.count;
  }

  return NextResponse.json({ profile, totals });
}
