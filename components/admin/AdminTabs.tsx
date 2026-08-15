"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabaseClient";
import AdminStats from "@/components/admin/AdminStats";
import AdminAnnouncements from "@/components/admin/AdminAnnouncements";
import AdminMembers from "@/components/admin/AdminMembers";
import AdminEntries from "@/components/admin/AdminEntries";

const TABS = [
  { key: "stats", label: "Overview" },
  { key: "announcements", label: "Announcements" },
  { key: "members", label: "Members" },
  { key: "entries", label: "Entries" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export default function AdminTabs() {
  const [tab, setTab] = useState<TabKey>("stats");
  const router = useRouter();

  async function handleLogout() {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div className="flex gap-2 overflow-x-auto">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${
                tab === t.key
                  ? "bg-primary text-cream"
                  : "bg-white/70 text-primary/60 hover:bg-white"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <button
          onClick={handleLogout}
          className="flex shrink-0 items-center gap-1 text-sm text-primary/50 hover:text-primary"
        >
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </div>

      {tab === "stats" && <AdminStats />}
      {tab === "announcements" && <AdminAnnouncements />}
      {tab === "members" && <AdminMembers />}
      {tab === "entries" && <AdminEntries />}
    </div>
  );
}
