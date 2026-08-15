import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  const { data, error } = await supabaseAdmin.from("entries").select("count");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const overall = (data ?? []).reduce((sum, e) => sum + e.count, 0);
  return NextResponse.json({ overall });
}
