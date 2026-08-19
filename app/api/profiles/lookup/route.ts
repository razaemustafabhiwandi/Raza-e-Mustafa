import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { normalizePhone } from "@/lib/phone";
import { verifyPin } from "@/lib/pin";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const rawPhone = typeof body?.phone === "string" ? body.phone.trim() : "";
  const pin = typeof body?.pin === "string" ? body.pin.trim() : "";

  if (!rawPhone || !pin) {
    return NextResponse.json({ error: "Phone number aur PIN dono chahiye." }, { status: 400 });
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
    .select("id, name, phone, address, created_at, pin_hash")
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

  const profile = {
    id: data.id,
    name: data.name,
    phone: data.phone,
    address: data.address,
    created_at: data.created_at,
  };

  // Legacy accounts created before Security PIN existed: let them in once,
  // the dashboard will prompt them to set a PIN right away.
  if (!data.pin_hash) {
    return NextResponse.json({ profile, needsPinSetup: true });
  }

  const ok = await verifyPin(pin, data.pin_hash);
  if (!ok) {
    return NextResponse.json({ error: "Galat PIN. Dobara koshish karein." }, { status: 401 });
  }

  return NextResponse.json({ profile });
}
