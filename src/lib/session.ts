import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/auth";
import { userExists } from "@/lib/queries";

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  const user = session?.user ?? null;
  if (!user) return null;

  // The JWT session strategy doesn't re-check the database — a session
  // whose account was deleted (or a stale cookie from a wiped account)
  // would otherwise sail through as "logged in" and crash the first write
  // that uses this id as a foreign key. Treat it as logged out instead.
  const id = (user as { id?: string }).id;
  if (!id || !(await userExists(id))) return null;

  return user;
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}
