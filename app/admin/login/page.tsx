"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabaseClient";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createSupabaseBrowserClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (signInError) {
      setError("Email ya password ghalat hai.");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <div className="mb-6 flex flex-col items-center gap-2 text-center">
        <ShieldCheck className="h-8 w-8 text-primary" />
        <h1 className="font-heading text-2xl font-bold text-primary">Admin Login</h1>
        <p className="text-sm text-primary/60">Sirf authorized admins ke liye.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-primary/80">Email</label>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-primary/20 bg-white/80 px-4 py-2.5 outline-none ring-primary focus:ring-2"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-primary/80">Password</label>
          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-primary/20 bg-white/80 px-4 py-2.5 outline-none ring-primary focus:ring-2"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-cream shadow-md transition hover:bg-primary-dark disabled:opacity-60"
        >
          {loading ? "..." : "Login"}
        </button>
      </form>
    </div>
  );
}
