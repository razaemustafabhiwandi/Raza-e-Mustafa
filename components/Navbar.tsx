"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { getStoredProfileId } from "@/lib/profile-session";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/announcements", label: "Announcements" },
  { href: "/about", label: "Hamari Jamat" },
];

export default function Navbar() {
  const [hasProfile, setHasProfile] = useState(false);
  const [open, setOpen] = useState(false);
  const [overall, setOverall] = useState<number | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    setHasProfile(!!getStoredProfileId());
  }, [pathname]);

  useEffect(() => {
    fetch("/api/stats/overall")
      .then((r) => r.json())
      .then((d) => setOverall(d.overall))
      .catch(() => {});
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-primary/10 bg-cream/90 backdrop-blur">
      {overall !== null && (
        <div className="bg-primary py-1.5 text-center text-sm font-medium text-cream">
          Ab Tak Kul Ibadat:{" "}
          <span className="text-base font-black text-gold">{overall.toLocaleString()}</span>
        </div>
      )}
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 text-primary">
          <Image src="/jrm-logo.png" alt="Jamat Raza-e-Mustafa" width={40} height={38} className="h-10 w-auto" priority />
          <span className="font-heading text-lg font-bold leading-tight tracking-wide sm:text-xl">
            Raza-e-Mustafa Bhiwandi
          </span>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-sm font-medium transition hover:text-primary ${
                pathname === l.href ? "text-primary" : "text-primary/60"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href={hasProfile ? "/dashboard" : "/join"}
            className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-cream shadow-sm transition hover:bg-primary-dark"
          >
            {hasProfile ? "Mera Dashboard" : "Shamil Ho"}
          </Link>
        </div>

        <button
          className="md:hidden text-primary"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-primary/10 bg-cream px-4 py-3 md:hidden">
          <div className="flex flex-col gap-3">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-sm font-medium text-primary/80"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href={hasProfile ? "/dashboard" : "/join"}
              onClick={() => setOpen(false)}
              className="rounded-full bg-primary px-4 py-2 text-center text-sm font-semibold text-cream"
            >
              {hasProfile ? "Mera Dashboard" : "Shamil Ho"}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
