import { EntryType, entryTypeLabel } from "@/lib/types";
import HeroCTA from "@/components/HeroCTA";
import AnimatedCounter from "@/components/AnimatedCounter";
import MyContribution from "@/components/MyContribution";

export default function RabiKpiBanner({
  overall,
  totals,
}: {
  overall: number;
  totals: Record<EntryType, number>;
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
    </section>
  );
}
