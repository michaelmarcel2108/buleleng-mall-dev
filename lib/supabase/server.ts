import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const COOKIE_NAME = "rdcourt-session";

export async function createClient() {
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
              cookieStore.set(name, value, {
                ...options,
                path: "/",
                secure: true,
                httpOnly: true,
                sameSite: "lax",
              }),
            );
          } catch {
            // Server actions handle redirects
          }
        },
      },
      cookieOptions: {
        name: COOKIE_NAME,
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
        sameSite: "lax",
        secure: true,
      },
    },
  );
}
