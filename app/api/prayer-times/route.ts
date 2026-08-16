import { NextRequest, NextResponse } from "next/server";
import { fetchPrayerTimes } from "@/lib/prayerTimes";

export async function GET(req: NextRequest) {
  const lat = req.nextUrl.searchParams.get("lat");
  const lon = req.nextUrl.searchParams.get("lon");

  let location = "Bhiwandi";
  let prayerData;

  if (lat && lon) {
    const latNum = Number(lat);
    const lonNum = Number(lon);
    prayerData = await fetchPrayerTimes({ lat: latNum, lon: lonNum });
    location = "Aapki Location";

    try {
      const geoRes = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latNum}&longitude=${lonNum}&localityLanguage=en`,
        { cache: "no-store" }
      );
      if (geoRes.ok) {
        const geoJson = await geoRes.json();
        location = geoJson.city || geoJson.locality || geoJson.principalSubdivision || location;
      }
    } catch {
      // keep generic fallback label
    }
  } else {
    prayerData = await fetchPrayerTimes({ city: "Bhiwandi", country: "India" });
  }

  if (!prayerData) {
    return NextResponse.json({ error: "Prayer times abhi available nahi hain." }, { status: 503 });
  }

  return NextResponse.json({ ...prayerData, location });
}
