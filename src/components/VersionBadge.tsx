export function VersionBadge() {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 16,
        left: 16,
        zIndex: 40,
        pointerEvents: "none",
        background: "rgba(0, 0, 0, 0.55)",
        border: "1px solid rgba(255, 255, 255, 0.12)",
        borderRadius: 6,
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        padding: "4px 8px",
      }}
    >
      <span
        className="font-mono"
        style={{ fontSize: 11, color: "rgba(255, 255, 255, 0.45)", letterSpacing: "0.05em" }}
      >
        v{process.env.APP_VERSION}
      </span>
    </div>
  );
}
