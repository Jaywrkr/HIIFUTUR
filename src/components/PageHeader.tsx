export function PageHeader({
  kicker,
  title,
  subtitle,
}: {
  kicker: string;
  title: string;
  subtitle?: React.ReactNode;
}) {
  return (
    <div className="mb-10">
      <p className="kicker">{kicker}</p>
      <h1 className="text-2xl font-bold uppercase tracking-wide mb-2">{title}</h1>
      {subtitle ? <p className="muted max-w-xl">{subtitle}</p> : null}
    </div>
  );
}
