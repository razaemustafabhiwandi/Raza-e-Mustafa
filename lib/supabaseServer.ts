import "server-only";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

// Resolves the caller's Supabase Auth session from cookies. Uses the publishable
// key only — this can tell us WHO is calling, not grant elevated access.
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // called from a Server Component render — safe to ignore, middleware refreshes it
          }
        },
      },
    }
  );
}
