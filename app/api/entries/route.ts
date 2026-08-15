import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { ENTRY_TYPES } from "@/lib/types";

const VALID_TYPES = new Set(ENTRY_TYPES.map((t) => t.value));

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const profileId = typeof body?.profile_id === "string" ? body.profile_id : "";
  const type = typeof body?.type === "string" ? body.type : "";
  const count = Number(body?.count);
  const note = typeof body?.note === "string" ? body.note.trim() : "";

  if (!profileId || !VALID_TYPES.has(type as never)) {
    return NextResponse.json({ error: "Profile aur type zaroori hain." }, { status: 400 });
  }
  if (!Number.isInteger(count) || count <= 0) {
    return NextResponse.json({ error: "Count ek positive number hona chahiye." }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("entries")
    .insert({ profile_id: profileId, type, count, note: note || null })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ entry: data }, { status: 201 });
}

export async function GET(req: NextRequest) {
  const profileId = req.nextUrl.searchParams.get("profile_id");
  if (!profileId) {
    return NextResponse.json({ error: "profile_id zaroori hai." }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("entries")
    .select()
    .eq("profile_id", profileId)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ entries: data });
}
