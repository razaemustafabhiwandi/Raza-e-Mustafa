"use client";

import { useState } from "react";
import { ShieldAlert } from "lucide-react";

export default function SetPinPrompt({
  profileId,
  onDone,
}: {
  profileId: string;
  onDone: () => void;
}) {
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!/^\d{4,6}$/.test(pin)) {
      setError("PIN 4 se 6 digits ka hona chahiye.");
      return;
    }
    if (pin !== confirmPin) {
      setError("Dono PIN match nahi ho rahe.");
      return;
    }

    setLoading(true);
    const res = await fetch(`/api/profiles/${profileId}/pin`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ newPin: pin }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Kuch ghalat ho gaya.");
      return;
    }

    onDone();
  }

  return (
    <div className="mb-8 rounded-2xl border border-gold/40 bg-gold-light/40 p-5">
      <p className="flex items-center gap-2 font-semibold text-primary">
        <ShieldAlert className="h-5 w-5 text-gold" /> Apna Account Secure Karein
      </p>
      <p className="mt-1 text-sm text-primary/70">
        Aapke account par abhi Security PIN set nahi hai, isliye koi bhi sirf aapka phone number
        jaan kar login kar sakta hai. Abhi ek PIN set kar lein.
      </p>
      <form onSubmit={handleSubmit} className="mt-4 grid gap-3 sm:grid-cols-2">
        <input
          required
          value={pin}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
          className="w-full rounded-xl border border-primary/20 bg-white px-4 py-2.5 tracking-widest outline-none ring-primary focus:ring-2"
          placeholder="Naya PIN"
          type="password"
          inputMode="numeric"
        />
        <input
          required
          value={confirmPin}
          onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
          className="w-full rounded-xl border border-primary/20 bg-white px-4 py-2.5 tracking-widest outline-none ring-primary focus:ring-2"
          placeholder="PIN Confirm Karein"
          type="password"
          inputMode="numeric"
        />
        {error && <p className="text-sm text-red-600 sm:col-span-2">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-cream shadow-sm transition hover:bg-primary-dark disabled:opacity-60 sm:col-span-2"
        >
          {loading ? "Set ho raha hai..." : "PIN Set Karein"}
        </button>
      </form>
    </div>
  );
}
