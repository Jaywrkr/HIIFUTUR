import Link from "next/link";

export const metadata = { title: "Página no encontrada — ANKLA" };

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 text-center">
      <div>
        <p className="kicker mx-auto">404</p>
        <h1 className="text-3xl font-thin tracking-tight mb-2">Esta página no existe.</h1>
        <p className="muted mb-8">O se movió, o el link está mal. Cualquiera de las dos, no es tu culpa.</p>
        <Link href="/" className="btn-primary">Volver al inicio</Link>
      </div>
    </main>
  );
}
