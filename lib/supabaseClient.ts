"use client";
import { createBrowserClient } from "@supabase/ssr";

// Browser client using the publishable (anon) key. Used only for admin sign-in/sign-out —
// public visitors never authenticate, they just hold a profile id in localStorage.
export function createSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
