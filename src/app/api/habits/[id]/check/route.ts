import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { markHabitDone } from "@/lib/habit-actions";

// Hit by the service worker's "Marcar hecho" notification action — a plain
// REST endpoint (not a Server Action) because a service worker's fetch()
// can't speak the Server Actions wire protocol. Auth rides on the same-origin
// session cookie, which fetch() sends automatically.
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const result = await markHabitDone(user.id, params.id);
  if (!result.ok) return NextResponse.json({ error: "not found" }, { status: 404 });

  return NextResponse.json({ ok: true });
}
