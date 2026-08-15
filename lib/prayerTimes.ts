import "server-only";

export type PrayerData = {
  timings: {
    fajr: string;
    sunrise: string;
    dhuhr: string;
    asr: string;
    maghrib: string;
    isha: string;
  };
  hijri: { day: string; month: string; year: string; weekday: string };
  gregorian: string;
};

// Bhiwandi, India — method=1 (Karachi) + school=1 (Hanafi Asr) matches the
// calculation convention most South Asian Hanafi masjids follow.
export async function getPrayerTimesAndHijri(): Promise<PrayerData | null> {
  try {
    const res = await fetch(
      "https://api.aladhan.com/v1/timingsByCity?city=Bhiwandi&country=India&method=1&school=1",
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return null;

    const json = await res.json();
    const t = json?.data?.timings;
    const h = json?.data?.date?.hijri;
    const gregorian = json?.data?.date?.readable;
    if (!t || !h) return null;

    return {
      timings: {
        fajr: t.Fajr,
        sunrise: t.Sunrise,
        dhuhr: t.Dhuhr,
        asr: t.Asr,
        maghrib: t.Maghrib,
        isha: t.Isha,
      },
      hijri: {
        day: h.day,
        month: h.month?.en ?? "",
        year: h.year,
        weekday: h.weekday?.en ?? "",
      },
      gregorian,
    };
  } catch {
    return null;
  }
}
