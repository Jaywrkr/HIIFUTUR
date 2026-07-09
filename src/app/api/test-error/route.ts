export const dynamic = "force-dynamic";

export async function GET() {
  throw new Error("TEST ERROR FOR SENTRY WIRING VERIFICATION (prod)");
}
