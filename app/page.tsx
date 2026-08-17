import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { Announcement, EntryType } from "@/lib/types";
import { getDailyHadith, getDailySeerat, getDailyFaizlat, getDailyDurood } from "@/lib/islamicContent";
import HeroCTA from "@/components/HeroCTA";
import RabiKpiBanner from "@/components/RabiKpiBanner";
import HomeAnnouncements from "@/components/HomeAnnouncements";
import IslamicCorner from "@/components/IslamicCorner";
import SectionLabel from "@/components/SectionLabel";
import IslamicDivider from "@/components/IslamicDivider";
import Link from "next/link";
import Image from "next/image";

export const revalidate = 0;

async function getHomeData() {
  const [{ data: entries }, { data: profiles }, { data: announcements }] = await Promise.all([
    supabaseAdmin.from("entries").select("profile_id, type, count"),
    supabaseAdmin.from("profiles").select("id, name"),
    supabaseAdmin
      .from("announcements")
      .select("id, title, body, is_active, created_at")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(3),
  ]);

  const nameById = new Map((profiles ?? []).map((p) => [p.id, p.name]));
  const totals: Record<EntryType, number> = { durood: 0, kalimah: 0, para: 0, surah: 0 };
  const perProfile = new Map<string, { name: string; total: number }>();

  for (const e of entries ?? []) {
    totals[e.type as EntryType] += e.count;
    const existing = perProfile.get(e.profile_id);
    if (existing) existing.total += e.count;
    else perProfile.set(e.profile_id, { name: nameById.get(e.profile_id) ?? "Member", total: e.count });
  }
  const overall = Object.values(totals).reduce((a, b) => a + b, 0);

  const topContributors = Array.from(perProfile.values())
    .sort((a, b) => b.total - a.total)
    .slice(0, 3);

  return {
    totals,
    overall,
    topContributors,
    announcements: (announcements ?? []) as Announcement[],
  };
}

export default async function Home() {
  const { totals, overall, topContributors, announcements } = await getHomeData();
  const durood = getDailyDurood();

  return (
    <div className="mx-auto max-w-5xl px-4 pb-16">
      <section className="relative flex flex-col items-center gap-3 py-8 text-center">
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
          width={96}
          height={91}
          className="h-20 w-auto drop-shadow-md sm:h-24"
          priority
        />
        <p className="bismillah text-2xl text-gold">بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ</p>
        <p className="text-xs font-semibold uppercase tracking-widest text-primary/50">
          Jamat Raza-e-Mustafa Bhiwandi Present&apos;s
        </p>
        <h1 className="shine-text font-heading text-4xl font-black sm:text-5xl">
          Raza-e-Mustafa Bhiwandi
        </h1>
        <p className="max-w-xl text-primary/70">
          Rabi-ul-Awwal Sharif ke is mubarak mahine mein aayein, apna Durood Sharif, Kalimah aur
          Quran Sharif ki tilawat ka safar shuru karein aur poori Jamat ke saath apna count jama
          karein.
        </p>

        <div className="glow-card mt-2 w-full max-w-2xl rounded-2xl border-t-4 border-gold bg-white px-5 py-6 shadow-md sm:px-8 sm:py-7">
          <p className="text-xs font-semibold uppercase tracking-widest text-gold">
            Aaj Ka Durood Sharif
          </p>
          <p dir="rtl" className="bismillah mt-4 text-lg leading-relaxed text-primary sm:text-2xl sm:leading-loose md:text-3xl">
            {durood.arabic}
          </p>
          <p className="mt-4 text-sm font-semibold text-primary/60">{durood.name}</p>
        </div>

        <div className="mt-1">
          <HeroCTA />
        </div>
      </section>

      <RabiKpiBanner overall={overall} totals={totals} topContributors={topContributors} />

      <IslamicDivider />

      <section>
        <div className="mb-4 flex items-center justify-between">
          <SectionLabel>Elaan (Announcements)</SectionLabel>
          <Link href="/announcements" className="text-sm font-medium text-primary/60 hover:text-primary">
            Sab Dekhein &rarr;
          </Link>
        </div>
        <HomeAnnouncements announcements={announcements} />
      </section>

      <IslamicDivider />

      <IslamicCorner
        hadith={getDailyHadith()}
        seerat={getDailySeerat()}
        faizlat={getDailyFaizlat()}
      />

      <IslamicDivider />

      <section className="pattern-bg-dark rounded-2xl px-6 py-10 text-center text-cream">
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
