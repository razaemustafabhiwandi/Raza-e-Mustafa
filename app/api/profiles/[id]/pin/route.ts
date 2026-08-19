import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { hashPin, isValidPin, verifyPin } from "@/lib/pin";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json().catch(() => null);
  const newPin = typeof body?.newPin === "string" ? body.newPin.trim() : "";
  const currentPin = typeof body?.currentPin === "string" ? body.currentPin.trim() : "";

  if (!isValidPin(newPin)) {
    return NextResponse.json(
      { error: "Naya PIN 4 se 6 digits ka hona chahiye (sirf numbers)." },
      { status: 400 }
    );
  }

  const { data: profile, error: fetchError } = await supabaseAdmin
    .from("profiles")
    .select("id, pin_hash")
    .eq("id", id)
    .maybeSingle();

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 });
  }
  if (!profile) {
    return NextResponse.json({ error: "Profile nahi mila." }, { status: 404 });
  }

  if (profile.pin_hash) {
    if (!currentPin) {
      return NextResponse.json(
        { error: "PIN badalne ke liye purana PIN darj karein." },
        { status: 400 }
      );
    }
    const ok = await verifyPin(currentPin, profile.pin_hash);
    if (!ok) {
      return NextResponse.json({ error: "Purana PIN ghalat hai." }, { status: 401 });
    }
  }

  const pin_hash = await hashPin(newPin);
  const { error: updateError } = await supabaseAdmin
    .from("profiles")
    .update({ pin_hash })
    .eq("id", id);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
