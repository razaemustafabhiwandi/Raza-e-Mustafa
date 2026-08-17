"use client";

import { useEffect, useMemo, useState } from "react";
import { Moon, Clock, Check } from "lucide-react";
import { PrayerData } from "@/lib/prayerTimes";

type PrayerResponse = PrayerData & { location: string };
type PrayerKey = keyof PrayerData["timings"];

const PRAYER_ROWS: { key: PrayerKey; label: string }[] = [
  { key: "fajr", label: "Fajr" },
  { key: "sunrise", label: "Sunrise" },
  { key: "dhuhr", label: "Zuhr" },
  { key: "asr", label: "Asr" },
  { key: "maghrib", label: "Maghrib" },
  { key: "isha", label: "Isha" },
];

// Order used to work out which salah's window we're currently in — sunrise isn't
// a salah so it's excluded here (it still shows in the grid above).
const SALAH_ORDER: PrayerKey[] = ["fajr", "dhuhr", "asr", "maghrib", "isha"];

function cleanTime(value: string) {
  return value.split(" ")[0];
}

function parseMinutes(value: string) {
  const [h, m] = cleanTime(value).split(":").map(Number);
  return h * 60 + m;
}

function getCurrentSalah(timings: PrayerData["timings"], now: Date): PrayerKey {
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  let current: PrayerKey = "isha";
  for (const key of SALAH_ORDER) {
    if (nowMinutes >= parseMinutes(timings[key])) current = key;
  }
  return current;
}

function todayKey(now: Date) {
  return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
}

export default function PrayerTimesCard() {
  const [data, setData] = useState<PrayerResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState<Date | null>(null);
  const [pollAnswer, setPollAnswer] = useState<"yes" | "no" | null>(null);

  useEffect(() => {
    function loadFor(lat?: number, lon?: number) {
      const qs = lat != null && lon != null ? `?lat=${lat}&lon=${lon}` : "";
      fetch(`/api/prayer-times${qs}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => setData(d?.timings ? d : null))
        .catch(() => setData(null))
        .finally(() => setLoading(false));
    }

    if (typeof navigator !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => loadFor(pos.coords.latitude, pos.coords.longitude),
        () => loadFor(),
        { timeout: 8000 }
      );
    } else {
      loadFor();
    }
  }, []);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(id);
  }, []);

  const currentSalah = useMemo(() => {
    if (!data || !now) return null;
    return getCurrentSalah(data.timings, now);
  }, [data, now]);

  const pollStorageKey = currentSalah && now ? `namaz_poll_${todayKey(now)}_${currentSalah}` : null;

  useEffect(() => {
    if (!pollStorageKey) return;
    const saved = window.localStorage.getItem(pollStorageKey);
    setPollAnswer(saved === "yes" || saved === "no" ? saved : null);
  }, [pollStorageKey]);

  function answerPoll(answer: "yes" | "no") {
    if (!pollStorageKey) return;
    window.localStorage.setItem(pollStorageKey, answer);
    setPollAnswer(answer);
  }

  const currentLabel = PRAYER_ROWS.find((r) => r.key === currentSalah)?.label;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="pattern-bg-dark glow-card rounded-2xl p-5 text-cream shadow-sm">
        <div className="flex items-center gap-2 text-gold">
          <Moon className="h-5 w-5" />
          <h3 className="font-heading text-sm font-semibold uppercase tracking-wide">
            Aaj Ki Tareekh
          </h3>
        </div>
        {loading ? (
          <p className="mt-3 text-sm text-cream/70">Load ho raha hai...</p>
        ) : data ? (
          <>
            <p className="mt-3 font-heading text-2xl font-semibold">
              {data.hijri.day} {data.hijri.month} {data.hijri.year} AH
            </p>
            <p className="mt-1 text-sm text-cream/70">
              {data.hijri.weekday} &bull; {data.gregorian}
            </p>
          </>
        ) : (
          <p className="mt-3 text-sm text-cream/70">Hijri tareekh abhi available nahi hai.</p>
        )}
      </div>

      <div className="glow-card rounded-2xl bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2 text-gold">
          <Clock className="h-5 w-5" />
          <h3 className="font-heading text-sm font-semibold uppercase tracking-wide text-primary">
            Namaz Ke Auqaat {data ? `— ${data.location}` : ""}
          </h3>
        </div>
        {loading ? (
          <p className="mt-3 text-sm text-primary/50">Aapki location detect ho rahi hai...</p>
        ) : data ? (
          <>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center sm:grid-cols-6">
              {PRAYER_ROWS.map((row) => {
                const isCurrent = row.key === currentSalah;
                return (
                  <div
                    key={row.key}
                    className={`rounded-xl px-2 py-2 transition ${
                      isCurrent
                        ? "bg-gold text-primary-dark shadow-md ring-2 ring-gold"
                        : "bg-primary-light text-primary"
                    }`}
                  >
                    <div
                      className={`text-[11px] uppercase tracking-wide ${
                        isCurrent ? "text-primary-dark/70" : "text-primary/60"
                      }`}
                    >
                      {row.label}
                    </div>
                    <div className="mt-0.5 text-sm font-semibold">{cleanTime(data.timings[row.key])}</div>
                  </div>
                );
              })}
            </div>

            {currentLabel && (
              <div className="mt-4 rounded-xl bg-primary-light px-4 py-3">
                {pollAnswer ? (
                  <p className="flex items-center gap-2 text-sm font-medium text-primary">
                    <Check className="h-4 w-4 text-gold" />
                    {pollAnswer === "yes"
                      ? `Jazak Allah! Aapne ${currentLabel} darj kar li.`
                      : `Theek hai, ${currentLabel} ki yaad dila di gayi hai.`}
                  </p>
                ) : (
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-medium text-primary">
                      Kya aapne <span className="font-semibold">{currentLabel}</span> padhi?
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => answerPoll("yes")}
                        className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-cream transition hover:bg-primary-dark"
                      >
                        Haan
                      </button>
                      <button
                        onClick={() => answerPoll("no")}
                        className="rounded-full border border-primary/20 bg-white px-4 py-2 text-xs font-semibold text-primary transition hover:bg-primary-light"
                      >
                        Abhi Nahi
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <p className="mt-3 text-sm text-primary/50">Namaz ke auqaat abhi available nahi hain.</p>
        )}
        <p className="mt-3 text-xs text-primary/40">
          Apne ilaqe ki local masjid se jamat ka sahi waqt zaroor confirm kar lein.
        </p>
      </div>
    </div>
  );
}
