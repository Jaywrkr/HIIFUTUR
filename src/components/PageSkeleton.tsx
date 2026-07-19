export function PageSkeleton() {
  return (
    <>
      <nav className="app-nav">
        <div className="app-nav-inner">
          <span className="app-logo">EJECUTA</span>
        </div>
      </nav>
      <main className="app-main animate-pulse">
        <div className="h-3 w-32 bg-line rounded-full mb-4" />
        <div className="h-8 w-64 bg-line rounded-lg mb-8" />
        <div className="flex flex-col gap-4">
          <div className="h-20 bg-line rounded-lg" />
          <div className="h-20 bg-line rounded-lg" />
          <div className="h-20 bg-line rounded-lg" />
        </div>
      </main>
    </>
  );
}
