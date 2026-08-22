import { Trophy } from "lucide-react";
import LeaderboardList from "@/components/LeaderboardList";

export default function LeaderboardPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="mb-2 flex items-center gap-2">
        <Trophy className="h-7 w-7 text-gold" />
        <h1 className="font-heading text-3xl font-bold text-primary">Leaderboard</h1>
      </div>
      <p className="mb-8 text-sm text-primary/50">
        Privacy ke liye baaki members ke naam masked hain &mdash; sirf aapka apna naam aapko saaf
        dikhega.
      </p>

      <LeaderboardList limit={50} />
    </div>
  );
}
