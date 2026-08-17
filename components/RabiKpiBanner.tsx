import Link from "next/link";
import { EntryType, entryTypeLabel } from "@/lib/types";
import HeroCTA from "@/components/HeroCTA";
import AnimatedCounter from "@/components/AnimatedCounter";
import MyContribution from "@/components/MyContribution";

const MEDAL = ["🥇", "🥈", "🥉"];

export default function RabiKpiBanner({
  overall,
  totals,
  topContributors,
}: {
  overall: number;
  totals: Record<EntryType, number>;
  topContributors: { name: string; total: number }[];
}) {
  return (
    <section className="pattern-bg-dark glow-card rounded-2xl px-6 py-8 text-center text-cream shadow-lg">
      <p className="text-xs font-semibold uppercase tracking-widest text-gold">
        Mahe Rabi-ul-Awwal Sharif Mubarak
      </p>
      <p className="mt-3 font-heading text-5xl font-black text-gold sm:text-6xl">
        <AnimatedCounter value={overall} />
      </p>
      <p className="mt-1 text-sm text-cream/80">Kul Ibadat Ab Tak Jama Ho Chuki Hai</p>

      <div className="mt-5 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-cream/70">
        {(["durood", "kalimah", "para", "surah"] as EntryType[]).map((t) => (
          <span key={t}>
            {entryTypeLabel(t)}: <span className="font-semibold text-cream">{totals[t]}</span>
          </span>
        ))}
      </div>

      <MyContribution />

      <div className="mt-6 flex justify-center">
        <HeroCTA
          joinLabel="Apna Durood Sharif Darj Karein"
          dashboardLabel="Aur Durood Sharif Darj Karein"
          hideSecondary
          variant="gold"
        />
      </div>

      {topContributors.length > 0 && (
        <div className="mt-6 border-t border-white/10 pt-5">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-gold">
            Sabse Aage Log
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {topContributors.map((c, i) => (
              <div
                key={c.name + i}
                className="flex max-w-[220px] items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm"
              >
                <span className="shrink-0">{MEDAL[i]}</span>
                <span className="truncate font-medium text-cream">{c.name}</span>
                <span className="shrink-0 font-bold text-gold">{c.total.toLocaleString()}</span>
              </div>
            ))}
          </div>
          <Link
            href="/leaderboard"
            className="mt-3 inline-block text-xs text-cream/60 underline underline-offset-2 hover:text-cream"
          >
            Poora Leaderboard Dekhein &rarr;
          </Link>
        </div>
      )}
    </section>
  );
}
