"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { KeyRound } from "lucide-react";
import { setStoredProfileId } from "@/lib/profile-session";

export default function JoinPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!/^\d{4,6}$/.test(pin)) {
      setError("PIN 4 se 6 digits ka hona chahiye (sirf numbers).");
      return;
    }
    if (pin !== confirmPin) {
      setError("Dono PIN match nahi ho rahe.");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/profiles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone, address, pin }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Kuch ghalat ho gaya.");
      return;
    }

    setStoredProfileId(data.profile.id);
    router.push("/dashboard");
  }

  return (
    <div className="mx-auto max-w-md px-4 py-14">
      <h1 className="font-heading text-3xl font-bold text-primary">Jamat Mein Shamil Hon</h1>
      <p className="mt-2 text-sm text-primary/60">
        Apna naam, phone number aur address darj karein, aur apna account secure karne ke liye ek
        Security PIN set karein.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-primary/80">Naam</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-primary/20 bg-white px-4 py-2.5 outline-none ring-primary focus:ring-2"
            placeholder="Aapka poora naam"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-primary/80">Phone Number</label>
          <input
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-xl border border-primary/20 bg-white px-4 py-2.5 outline-none ring-primary focus:ring-2"
            placeholder="e.g. 9876543210"
            type="tel"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-primary/80">
            Address <span className="font-normal text-primary/40">(optional)</span>
          </label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full rounded-xl border border-primary/20 bg-white px-4 py-2.5 outline-none ring-primary focus:ring-2"
            placeholder="Mohalla, shehar"
            rows={2}
          />
        </div>

        <div className="rounded-xl border border-gold/30 bg-gold-light/40 p-4">
          <p className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-primary">
            <KeyRound className="h-4 w-4 text-gold" /> Security PIN
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-primary/70">PIN (4-6 digits)</label>
              <input
                required
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
                className="w-full rounded-xl border border-primary/20 bg-white px-4 py-2.5 tracking-widest outline-none ring-primary focus:ring-2"
                placeholder="••••"
                type="password"
                inputMode="numeric"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-primary/70">PIN Confirm Karein</label>
              <input
                required
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
                className="w-full rounded-xl border border-primary/20 bg-white px-4 py-2.5 tracking-widest outline-none ring-primary focus:ring-2"
                placeholder="••••"
                type="password"
                inputMode="numeric"
              />
            </div>
          </div>
          <p className="mt-2 text-xs text-primary/50">
            Yeh PIN aapko dobara login karte waqt chahiye hoga &mdash; kisi ko na batayein.
          </p>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="shine-btn mt-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-cream shadow-md transition hover:bg-primary-dark disabled:opacity-60"
        >
          {loading ? "Ho raha hai..." : "Shamil Hon"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-primary/60">
        Pehle se account hai?{" "}
        <Link href="/login" className="font-semibold text-primary">
          Login karein
        </Link>
      </p>
    </div>
  );
}
