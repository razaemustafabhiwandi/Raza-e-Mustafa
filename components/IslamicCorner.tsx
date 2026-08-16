import type { ReactNode } from "react";
import { BookOpenText, Moon, Sparkles } from "lucide-react";
import { Quote } from "@/lib/islamicContent";
import SectionLabel from "@/components/SectionLabel";
import PrayerTimesCard from "@/components/PrayerTimesCard";

function QuoteCard({
  icon,
  title,
  quote,
}: {
  icon: ReactNode;
  title: string;
  quote: Quote;
}) {
  return (
    <div className="glow-card flex flex-col rounded-2xl bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2 text-gold">
        {icon}
        <h3 className="font-heading text-sm font-semibold uppercase tracking-wide text-primary">
          {title}
        </h3>
      </div>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-primary/80">{quote.text}</p>
      {quote.source && (
        <p className="mt-3 text-xs font-medium text-primary/40">&mdash; {quote.source}</p>
      )}
    </div>
  );
}

export default function IslamicCorner({
  hadith,
  seerat,
  faizlat,
}: {
  hadith: Quote;
  seerat: Quote;
  faizlat: Quote;
}) {
  return (
    <section>
      <SectionLabel>Islami Gushah</SectionLabel>

      <PrayerTimesCard />

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <QuoteCard icon={<BookOpenText className="h-4 w-4" />} title="Aaj Ka Hadith" quote={hadith} />
        <QuoteCard icon={<Sparkles className="h-4 w-4" />} title="Seerat-e-Mustafa" quote={seerat} />
        <QuoteCard icon={<Moon className="h-4 w-4" />} title="Faizlat-e-Durood" quote={faizlat} />
      </div>
    </section>
  );
}
