import Link from "next/link";

export function VersionBadge() {
  return (
    <Link
      href="/changelog"
      className="version-badge"
      style={{
        position: "fixed",
        left: 16,
        zIndex: 40,
        background: "rgba(0, 0, 0, 0.7)",
        border: "1px solid rgba(255, 255, 255, 0.14)",
        borderRadius: 999,
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        padding: "4px 8px",
        textDecoration: "none",
      }}
    >
      <span
        className="font-mono"
        style={{ fontSize: 11, color: "rgba(255, 255, 255, 0.45)", letterSpacing: "0.05em" }}
      >
        v{process.env.APP_VERSION}
      </span>
    </Link>
  );
}
