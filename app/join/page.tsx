"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { setStoredProfileId } from "@/lib/profile-session";

export default function JoinPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch("/api/profiles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone, address }),
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
        Apna naam, phone number aur address darj karein &mdash; koi password ki zaroorat nahi.
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
