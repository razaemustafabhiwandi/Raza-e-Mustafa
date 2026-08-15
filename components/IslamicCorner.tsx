import type { ReactNode } from "react";
import { BookOpenText, Moon, Clock, Sparkles } from "lucide-react";
import { Quote } from "@/lib/islamicContent";
import { PrayerData } from "@/lib/prayerTimes";
import SectionLabel from "@/components/SectionLabel";

const PRAYER_ROWS: { key: keyof PrayerData["timings"]; label: string }[] = [
  { key: "fajr", label: "Fajr" },
  { key: "sunrise", label: "Sunrise" },
  { key: "dhuhr", label: "Zuhr" },
  { key: "asr", label: "Asr" },
  { key: "maghrib", label: "Maghrib" },
  { key: "isha", label: "Isha" },
];

function cleanTime(value: string) {
  return value.split(" ")[0];
}

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
    <div className="glow-card flex flex-col rounded-2xl bg-white/85 p-5 shadow-sm">
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
  prayerData,
  hadith,
  seerat,
  faizlat,
}: {
  prayerData: PrayerData | null;
  hadith: Quote;
  seerat: Quote;
  faizlat: Quote;
}) {
  return (
    <section className="mt-14">
      <SectionLabel>Islami Gushah</SectionLabel>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="pattern-bg-dark glow-card rounded-2xl p-5 text-cream shadow-sm">
          <div className="flex items-center gap-2 text-gold">
            <Moon className="h-5 w-5" />
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wide">
              Aaj Ki Tareekh
            </h3>
          </div>
          {prayerData ? (
            <>
              <p className="mt-3 font-heading text-2xl font-semibold">
                {prayerData.hijri.day} {prayerData.hijri.month} {prayerData.hijri.year} AH
              </p>
              <p className="mt-1 text-sm text-cream/70">
                {prayerData.hijri.weekday} &bull; {prayerData.gregorian}
              </p>
            </>
          ) : (
            <p className="mt-3 text-sm text-cream/70">Hijri tareekh abhi available nahi hai.</p>
          )}
        </div>

        <div className="glow-card rounded-2xl bg-white/85 p-5 shadow-sm">
          <div className="flex items-center gap-2 text-gold">
            <Clock className="h-5 w-5" />
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wide text-primary">
              Namaz Ke Auqaat &mdash; Bhiwandi
            </h3>
          </div>
          {prayerData ? (
            <div className="mt-3 grid grid-cols-3 gap-2 text-center sm:grid-cols-6">
              {PRAYER_ROWS.map((row) => (
                <div key={row.key} className="rounded-xl bg-primary-light px-2 py-2">
                  <div className="text-[11px] uppercase tracking-wide text-primary/60">
                    {row.label}
                  </div>
                  <div className="mt-0.5 text-sm font-semibold text-primary">
                    {cleanTime(prayerData.timings[row.key])}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-sm text-primary/50">Namaz ke auqaat abhi available nahi hain.</p>
          )}
          <p className="mt-3 text-xs text-primary/40">
            Fiqh Hanafi (Asr) ke mutabiq &mdash; local masjid se tasdeeq zaroor kar lein.
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <QuoteCard icon={<BookOpenText className="h-4 w-4" />} title="Aaj Ka Hadith" quote={hadith} />
        <QuoteCard icon={<Sparkles className="h-4 w-4" />} title="Seerat-e-Mustafa" quote={seerat} />
        <QuoteCard icon={<Moon className="h-4 w-4" />} title="Faizlat-e-Durood" quote={faizlat} />
      </div>
    </section>
  );
}
