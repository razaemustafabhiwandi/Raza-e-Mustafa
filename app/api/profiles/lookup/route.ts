import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { normalizePhone } from "@/lib/phone";

export async function GET(req: NextRequest) {
  const rawPhone = req.nextUrl.searchParams.get("phone")?.trim();
  if (!rawPhone) {
    return NextResponse.json({ error: "Phone number chahiye." }, { status: 400 });
  }

  const phone = normalizePhone(rawPhone);
  if (!phone) {
    return NextResponse.json(
      { error: "Sahi 10-digit mobile number darj karein (e.g. 9876543210)." },
      { status: 400 }
    );
  }

  const { data, error } = await supabaseAdmin
    .from("profiles")
    .select()
    .eq("phone", phone)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json(
      { error: "Is number se koi account nahi mila. Pehle join karein." },
      { status: 404 }
    );
  }

  return NextResponse.json({ profile: data });
}
