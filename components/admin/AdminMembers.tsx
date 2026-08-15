"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Profile } from "@/lib/types";

export default function AdminMembers() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);

  async function load(query: string) {
    setLoading(true);
    const res = await fetch(`/api/admin/profiles${query ? `?q=${encodeURIComponent(query)}` : ""}`);
    const data = await res.json();
    setProfiles(data.profiles ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load("");
  }, []);

  return (
    <div>
      <div className="mb-4 flex items-center gap-2 rounded-xl border border-primary/20 bg-white/80 px-3 py-2">
        <Search className="h-4 w-4 text-primary/40" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && load(q)}
          placeholder="Naam ya phone se search karein"
          className="w-full bg-transparent text-sm outline-none"
        />
        <button
          onClick={() => load(q)}
          className="shrink-0 text-sm font-medium text-primary/60 hover:text-primary"
        >
          Search
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-primary/50">Load ho raha hai...</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl bg-white/80 shadow-sm ring-1 ring-primary/10">
          <table className="w-full text-left text-sm">
            <thead className="bg-primary-light text-primary/70">
              <tr>
                <th className="px-4 py-3 font-medium">Naam</th>
                <th className="px-4 py-3 font-medium">Phone</th>
                <th className="px-4 py-3 font-medium">Address</th>
                <th className="px-4 py-3 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody>
              {profiles.map((p) => (
                <tr key={p.id} className="border-t border-primary/5">
                  <td className="px-4 py-3">{p.name}</td>
                  <td className="px-4 py-3">{p.phone}</td>
                  <td className="px-4 py-3 text-primary/60">{p.address || "-"}</td>
                  <td className="px-4 py-3 text-primary/50">
                    {new Date(p.created_at).toLocaleDateString("en-IN")}
                  </td>
                </tr>
              ))}
              {profiles.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-primary/50">
                    Koi member nahi mila.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
