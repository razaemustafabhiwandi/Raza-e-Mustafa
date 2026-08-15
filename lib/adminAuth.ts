import "server-only";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

// Resolves the current request to an admin user id, or null if the caller
// isn't signed in or isn't listed in the admins table. Route handlers should
// call this first and return 401 when it comes back null.
export async function requireAdmin(): Promise<string | null> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabaseAdmin
    .from("admins")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  return data ? user.id : null;
}
