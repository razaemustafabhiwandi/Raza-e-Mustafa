import { Trophy } from "lucide-react";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { EntryType } from "@/lib/types";

export const revalidate = 0;

async function getLeaderboard() {
  const [{ data: entries }, { data: profiles }] = await Promise.all([
    supabaseAdmin.from("entries").select("profile_id, type, count"),
    supabaseAdmin.from("profiles").select("id, name"),
  ]);

  const nameById = new Map((profiles ?? []).map((p) => [p.id, p.name]));
  const communityTotals: Record<EntryType, number> = { durood: 0, kalimah: 0, para: 0, surah: 0 };
  const perProfile = new Map<string, { profile_id: string; name: string; total: number }>();

  for (const e of entries ?? []) {
    const type = e.type as EntryType;
    communityTotals[type] += e.count;
    const existing = perProfile.get(e.profile_id);
    if (existing) existing.total += e.count;
    else
      perProfile.set(e.profile_id, {
        profile_id: e.profile_id,
        name: nameById.get(e.profile_id) ?? "Member",
        total: e.count,
      });
  }

  const topContributors = Array.from(perProfile.values())
    .sort((a, b) => b.total - a.total)
    .slice(0, 50);

  return { topContributors, communityTotals };
}

const MEDAL = ["🥇", "🥈", "🥉"];

export default async function LeaderboardPage() {
  const { topContributors } = await getLeaderboard();

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="mb-8 flex items-center gap-2">
        <Trophy className="h-7 w-7 text-gold" />
        <h1 className="font-heading text-3xl font-bold text-primary">Leaderboard</h1>
      </div>

      {topContributors.length === 0 ? (
        <p className="rounded-2xl bg-white p-6 text-center text-sm text-primary/50">
          Abhi tak koi entry nahi hai. Sabse pehle shamil hon!
        </p>
      ) : (
        <ol className="flex flex-col gap-2">
          {topContributors.map((c, i) => (
            <li
              key={c.profile_id}
              className="flex items-center justify-between gap-3 rounded-xl bg-white px-4 py-3 shadow-sm ring-1 ring-primary/10 sm:px-5"
            >
              <div className="flex min-w-0 items-center gap-3">
                {i < MEDAL.length ? (
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center text-2xl">
                    {MEDAL[i]}
                  </span>
                ) : (
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-light text-sm font-bold text-primary">
                    {i + 1}
                  </span>
                )}
                <span className="truncate font-semibold text-red">{c.name}</span>
              </div>
              <span className="shrink-0 rounded-lg bg-gold px-2 py-0.5 font-bold text-primary-dark">
                {c.total.toLocaleString()}
              </span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
