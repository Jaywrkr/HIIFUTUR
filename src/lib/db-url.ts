// Vercel/Neon connection strings ship their own `sslmode=require` query
// param. Passing that AND an explicit `ssl` option on the pg Pool is what
// triggers pg-connection-string's "SSL modes are treated as aliases"
// deprecation warning on every connection — the two specify SSL twice,
// ambiguously. Stripping sslmode here leaves TLS behavior controlled solely
// by the `ssl` option on the Pool and silences the noise.
export function withoutSslModeParam(url: string | undefined): string | undefined {
  if (!url) return url;
  try {
    const parsed = new URL(url);
    parsed.searchParams.delete("sslmode");
    return parsed.toString();
  } catch {
    return url;
  }
}
