import type { ComponentType } from "react";
import Image from "next/image";
import { Phone, Camera, Video, Users, MessageCircle, AtSign } from "lucide-react";
import SectionLabel from "@/components/SectionLabel";
import StatCard from "@/components/StatCard";
import {
  BRANCH,
  SARPARAST,
  ZIMMEDAAR,
  TANZEEMI_STATS,
  MAKTAB_STATS,
  SOCIAL_LINKS,
} from "@/lib/branchInfo";

const SOCIAL_ICONS: Record<string, ComponentType<{ className?: string }>> = {
  Instagram: Camera,
  YouTube: Video,
  Facebook: Users,
  "WhatsApp Channel": MessageCircle,
  Threads: AtSign,
};

function TimelineList({
  items,
}: {
  items: { title: string; subtitle?: string; contact?: string }[];
}) {
  return (
    <div className="relative border-l-2 border-primary/15 pl-6">
      {items.map((item, i) => (
        <div key={i} className="relative pb-6 last:pb-0">
          <span className="absolute -left-[29px] top-1 h-3 w-3 rounded-full border-2 border-primary bg-gold" />
          <p className="font-semibold text-red">{item.title}</p>
          {item.subtitle && <p className="text-sm text-primary/60">{item.subtitle}</p>}
          {item.contact && (
            <p className="mt-1 flex items-center gap-1.5 text-sm text-primary/70">
              <Phone className="h-3.5 w-3.5" /> {item.contact}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-8 flex flex-col items-center gap-3 text-center">
        <Image
          src="/jrm-logo.png"
          alt="Jamat Raza-e-Mustafa"
          width={90}
          height={85}
          className="h-20 w-auto"
        />
        <h1 className="font-heading text-3xl font-black text-primary">Hamari Jamat</h1>
        <p className="max-w-lg text-sm text-primary/60">
          Jamat Raza-e-Mustafa &mdash; Sarkar-e-Alahazrat Imam Ahmed Raza Khan (Qaddasallahu
          Sirrahul Azeez) ki qayam karda 1920 se ek azeem shan wali deeni wa milli tehreek,
          Markaz-e-Ahle Sunnat Bareilly Shareef se wabasta.
        </p>
      </div>

      <section className="mb-10">
        <SectionLabel>Branch Information</SectionLabel>
        <div className="glow-card rounded-2xl bg-white/85 p-6 shadow-sm">
          <p className="font-heading text-lg font-bold text-primary">{BRANCH.name}</p>
          <p className="mt-1 text-sm text-primary/70">{BRANCH.address}</p>
        </div>
      </section>

      <section className="mb-10">
        <SectionLabel>Sarparast Details</SectionLabel>
        <div className="glow-card rounded-2xl bg-white/85 p-6 shadow-sm">
          <TimelineList
            items={SARPARAST.map((s) => ({ title: s.name, contact: s.contact }))}
          />
        </div>
      </section>

      <section className="mb-10">
        <SectionLabel>Zimmedaar Details</SectionLabel>
        <div className="glow-card rounded-2xl bg-white/85 p-6 shadow-sm">
          <TimelineList
            items={ZIMMEDAAR.map((z) => ({
              title: z.name,
              subtitle: z.role,
              contact: z.contact,
            }))}
          />
        </div>
      </section>

      <section className="mb-10">
        <SectionLabel>Tanzeemi Maloomaat</SectionLabel>
        <div className="grid grid-cols-3 gap-4">
          {TANZEEMI_STATS.map((s) => (
            <StatCard key={s.label} label={s.label} value={s.value} />
          ))}
        </div>
      </section>

      <section className="mb-10">
        <SectionLabel>Maktab Details</SectionLabel>
        <div className="grid grid-cols-3 gap-4">
          {MAKTAB_STATS.map((s) => (
            <StatCard key={s.label} label={s.label} value={s.value} />
          ))}
        </div>
      </section>

      <section>
        <SectionLabel>Social Media</SectionLabel>
        <div className="grid gap-3 sm:grid-cols-2">
          {SOCIAL_LINKS.map((s) => {
            const Icon = SOCIAL_ICONS[s.platform] ?? AtSign;
            return (
              <a
                key={s.platform}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="glow-card flex items-center gap-3 rounded-xl bg-white/85 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-cream">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="min-w-0">
                  <span className="block font-semibold text-primary">{s.platform}</span>
                  <span className="block truncate text-xs text-primary/50">{s.handle}</span>
                  <span className="block text-xs font-semibold text-red">{s.metric}</span>
                </span>
              </a>
            );
          })}
        </div>
      </section>
    </div>
  );
}
