"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { clearStoredProfileId, getStoredProfileId } from "@/lib/profile-session";
import { Entry, EntryType, Profile, ENTRY_TYPES } from "@/lib/types";
import EntryForm from "@/components/EntryForm";
import StatCard from "@/components/StatCard";
import EntryHistoryList from "@/components/EntryHistoryList";
import SetPinPrompt from "@/components/SetPinPrompt";

export default function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [totals, setTotals] = useState<Record<EntryType, number> | null>(null);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [hasPinSet, setHasPinSet] = useState(true);

  const load = useCallback(async (profileId: string) => {
    const [profileRes, entriesRes] = await Promise.all([
      fetch(`/api/profiles/${profileId}`),
      fetch(`/api/entries?profile_id=${profileId}`),
    ]);

    if (!profileRes.ok) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    const profileData = await profileRes.json();
    const entriesData = await entriesRes.json();

    setProfile(profileData.profile);
    setTotals(profileData.totals);
    setHasPinSet(Boolean(profileData.hasPinSet));
    setEntries(entriesData.entries ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    const id = getStoredProfileId();
    if (!id) {
      router.replace("/join");
      return;
    }
    load(id);
  }, [load, router]);

  function handleLogout() {
    clearStoredProfileId();
    router.push("/");
  }

  if (loading) {
    return <div className="mx-auto max-w-3xl px-4 py-14 text-center text-primary/50">Load ho raha hai...</div>;
  }

  if (notFound || !profile || !totals) {
    return (
      <div className="mx-auto max-w-md px-4 py-14 text-center">
        <p className="text-primary/70">Profile nahi mil saka. Dobara login karein.</p>
        <button
          onClick={handleLogout}
          className="mt-4 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-cream"
        >
          Login Page Par Jayein
        </button>
      </div>
    );
  }

  const overall = Object.values(totals).reduce((a, b) => a + b, 0);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold text-primary">
            Assalamu Alaikum, {profile.name}
          </h1>
          <p className="mt-1 text-sm text-primary/60">Apka safar mubarak ho.</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1 text-sm text-primary/50 hover:text-primary"
        >
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </div>

      {!hasPinSet && (
        <div className="mt-6">
          <SetPinPrompt profileId={profile.id} onDone={() => load(profile.id)} />
        </div>
      )}

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-5">
        <StatCard label="Kul (Overall)" value={overall} />
        {ENTRY_TYPES.map((t) => (
          <StatCard key={t.value} label={t.label} value={totals[t.value]} />
        ))}
      </div>

      <div className="mt-10 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-primary/10">
        <h2 className="mb-4 font-heading text-xl font-semibold text-primary">Naya Count Jama Karein</h2>
        <EntryForm profileId={profile.id} onAdded={() => load(profile.id)} />
      </div>

      <div className="mt-10">
        <h2 className="mb-4 font-heading text-xl font-semibold text-primary">Apki History</h2>
        {entries.length === 0 ? (
          <p className="rounded-2xl bg-white p-6 text-center text-sm text-primary/50">
            Abhi tak koi entry nahi hai. Upar se pehla count jama karein.
          </p>
        ) : (
          <EntryHistoryList
            entries={entries}
            profileId={profile.id}
            onChanged={() => load(profile.id)}
          />
        )}
      </div>
    </div>
  );
}
