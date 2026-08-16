"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { setStoredProfileId } from "@/lib/profile-session";

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch(`/api/profiles/lookup?phone=${encodeURIComponent(phone)}`);
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
      <h1 className="font-heading text-3xl font-bold text-primary">Wapas Aayein</h1>
      <p className="mt-2 text-sm text-primary/60">
        Apna registered phone number darj karein, apka account khud khul jayega.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
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

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="shine-btn mt-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-cream shadow-md transition hover:bg-primary-dark disabled:opacity-60"
        >
          {loading ? "Dekh rahe hain..." : "Login"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-primary/60">
        Naya account banana hai?{" "}
        <Link href="/join" className="font-semibold text-primary">
          Shamil hon
        </Link>
      </p>
    </div>
  );
}
