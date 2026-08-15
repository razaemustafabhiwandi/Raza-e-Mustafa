import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { Announcement, EntryType, entryTypeLabel } from "@/lib/types";
import { getDailyHadith, getDailySeerat, getDailyFaizlat } from "@/lib/islamicContent";
import { getPrayerTimesAndHijri } from "@/lib/prayerTimes";
import HeroCTA from "@/components/HeroCTA";
import StatCard from "@/components/StatCard";
import HomeAnnouncements from "@/components/HomeAnnouncements";
import IslamicCorner from "@/components/IslamicCorner";
import SectionLabel from "@/components/SectionLabel";
import Link from "next/link";
import Image from "next/image";

export const revalidate = 0;

async function getHomeData() {
  const [{ data: entries }, { count: memberCount }, { data: announcements }, prayerData] =
    await Promise.all([
      supabaseAdmin.from("entries").select("type, count"),
      supabaseAdmin.from("profiles").select("id", { count: "exact", head: true }),
      supabaseAdmin
        .from("announcements")
        .select("id, title, body, is_active, created_at")
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(3),
      getPrayerTimesAndHijri(),
    ]);

  const totals: Record<EntryType, number> = { durood: 0, kalimah: 0, para: 0, surah: 0 };
  for (const e of entries ?? []) {
    totals[e.type as EntryType] += e.count;
  }
  const overall = Object.values(totals).reduce((a, b) => a + b, 0);

  return {
    totals,
    overall,
    memberCount: memberCount ?? 0,
    announcements: (announcements ?? []) as Announcement[],
    prayerData,
  };
}

export default async function Home() {
  const { totals, overall, memberCount, announcements, prayerData } = await getHomeData();

  return (
    <div className="mx-auto max-w-5xl px-4 pb-16">
      <section className="relative flex flex-col items-center gap-6 py-14 text-center">
        <div className="sparkle-field">
          <span className="sparkle" style={{ top: "12%", left: "8%", animationDelay: "0s" }} />
          <span className="sparkle" style={{ top: "22%", left: "88%", animationDelay: "0.6s" }} />
          <span className="sparkle" style={{ top: "68%", left: "15%", animationDelay: "1.2s" }} />
          <span className="sparkle" style={{ top: "78%", left: "92%", animationDelay: "1.8s" }} />
          <span className="sparkle" style={{ top: "45%", left: "50%", animationDelay: "2.4s" }} />
          <span className="sparkle" style={{ top: "8%", left: "48%", animationDelay: "0.9s" }} />
        </div>

        <Image
          src="/jrm-logo.png"
          alt="Jamat Raza-e-Mustafa"
          width={112}
          height={106}
          className="h-24 w-auto drop-shadow-md sm:h-28"
          priority
        />
        <p className="bismillah text-2xl text-gold">بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ</p>
        <h1 className="shine-text font-heading text-4xl font-black sm:text-5xl">
          Raza-e-Mustafa Bhiwandi
        </h1>
        <p className="max-w-xl text-primary/70">
          Rabi-ul-Awwal Sharif ke is mubarak mahine mein aayein, apna Durood Sharif, Kalimah aur
          Quran Sharif ki tilawat ka safar shuru karein aur poori Jamat ke saath apna count jama
          karein.
        </p>

        <HeroCTA />
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <SectionLabel>Elaan (Announcements)</SectionLabel>
          <Link href="/announcements" className="text-sm font-medium text-primary/60 hover:text-primary">
            Sab Dekhein &rarr;
          </Link>
        </div>
        <HomeAnnouncements announcements={announcements} />
      </section>

      <IslamicCorner
        prayerData={prayerData}
        hadith={getDailyHadith()}
        seerat={getDailySeerat()}
        faizlat={getDailyFaizlat()}
      />

      <section className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Jamat Members" value={memberCount} />
        <StatCard label="Kul Ibadat (Overall)" value={overall} />
        {(["durood", "kalimah"] as EntryType[]).map((t) => (
          <StatCard key={t} label={entryTypeLabel(t)} value={totals[t]} />
        ))}
      </section>

      <section className="pattern-bg-dark mt-14 rounded-2xl px-6 py-10 text-center text-cream">
        <h2 className="font-heading text-2xl font-bold">Leaderboard Dekhein</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-cream/80">
          Dekhein Jamat ke sabse ziyada ibadat karne wale members kaun hain aur khud bhi shamil
          hon.
        </p>
        <Link
          href="/leaderboard"
          className="shine-btn mt-5 inline-block rounded-full bg-gold px-6 py-3 text-sm font-semibold text-primary-dark shadow-md transition hover:brightness-105"
        >
          Leaderboard Kholen
        </Link>
      </section>
    </div>
  );
}
