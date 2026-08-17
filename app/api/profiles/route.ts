import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { normalizePhone } from "@/lib/phone";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const rawPhone = typeof body?.phone === "string" ? body.phone.trim() : "";
  const address = typeof body?.address === "string" ? body.address.trim() : "";

  if (!name || !rawPhone) {
    return NextResponse.json(
      { error: "Naam aur phone number dono zaroori hain." },
      { status: 400 }
    );
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
    .insert({ name, phone, address: address || null })
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "Yeh phone number pehle se register hai. Login kar ke aage badhein." },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ profile: data }, { status: 201 });
}
