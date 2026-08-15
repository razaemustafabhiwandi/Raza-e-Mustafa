import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { ENTRY_TYPES } from "@/lib/types";

const VALID_TYPES = new Set(ENTRY_TYPES.map((t) => t.value));

async function verifyOwnership(entryId: string, profileId: string) {
  const { data } = await supabaseAdmin
    .from("entries")
    .select("id, profile_id")
    .eq("id", entryId)
    .maybeSingle();

  return data?.profile_id === profileId;
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json().catch(() => null);
  const profileId = typeof body?.profile_id === "string" ? body.profile_id : "";
  const type = typeof body?.type === "string" ? body.type : "";
  const count = Number(body?.count);
  const note = typeof body?.note === "string" ? body.note.trim() : "";

  if (!profileId) {
    return NextResponse.json({ error: "profile_id zaroori hai." }, { status: 400 });
  }
  if (!(await verifyOwnership(id, profileId))) {
    return NextResponse.json({ error: "Yeh entry aapki nahi hai." }, { status: 403 });
  }
  if (!VALID_TYPES.has(type as never)) {
    return NextResponse.json({ error: "Type zaroori hai." }, { status: 400 });
  }
  if (!Number.isInteger(count) || count <= 0) {
    return NextResponse.json({ error: "Count ek positive number hona chahiye." }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("entries")
    .update({ type, count, note: note || null })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ entry: data });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const profileId = req.nextUrl.searchParams.get("profile_id") ?? "";

  if (!profileId) {
    return NextResponse.json({ error: "profile_id zaroori hai." }, { status: 400 });
  }
  if (!(await verifyOwnership(id, profileId))) {
    return NextResponse.json({ error: "Yeh entry aapki nahi hai." }, { status: 403 });
  }

  const { error } = await supabaseAdmin.from("entries").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
