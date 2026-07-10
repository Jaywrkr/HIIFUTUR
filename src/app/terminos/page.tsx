import Link from "next/link";

export const metadata = { title: "Terminos — EJECUTA" };

export default function TerminosPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <Link href="/" className="text-xs uppercase tracking-widest text-neutral-500 hover:text-accent transition-colors">
        ← EJECUTA
      </Link>
      <p className="kicker mt-8">Legal</p>
      <h1 className="text-3xl font-extrabold tracking-tight mb-2">Terminos de uso</h1>
      <p className="muted mb-10">Ultima actualizacion: julio 2026.</p>

      <div className="flex flex-col gap-8 mb-16">
        <section>
          <p className="font-bold mb-2">Que es EJECUTA</p>
          <p className="muted">
            EJECUTA es un sistema de ejecucion sostenible: modulos interactivos, un habit tracker
            progresivo y mediciones periodicas (Wheel of Life). Es una herramienta de habitos y
            productividad personal, no consejo medico, financiero, ni psicologico.
          </p>
        </section>

        <section>
          <p className="font-bold mb-2">Tu cuenta</p>
          <p className="muted">
            Eres responsable de mantener segura tu contraseña. No compartas tu cuenta. Puedes
            eliminar tu cuenta cuando quieras desde{" "}
            <Link href="/cuenta" className="link-accent">Mi cuenta</Link>.
          </p>
        </section>

        <section>
          <p className="font-bold mb-2">Uso aceptable</p>
          <p className="muted">
            No uses EJECUTA para nada ilegal, para intentar acceder a cuentas de otras personas, o
            para interferir con el funcionamiento del servicio.
          </p>
        </section>

        <section>
          <p className="font-bold mb-2">Sin garantias</p>
          <p className="muted">
            EJECUTA se ofrece &ldquo;tal cual&rdquo;. Hacemos lo posible por mantenerlo funcionando
            de forma estable, pero no garantizamos que este libre de errores o interrupciones.
          </p>
        </section>

        <section>
          <p className="font-bold mb-2">Cambios</p>
          <p className="muted">
            Podemos actualizar estos terminos conforme el producto evoluciona. Si el cambio es
            importante, lo vas a notar — no escondemos cambios relevantes en letra chica.
          </p>
        </section>

        <section>
          <p className="font-bold mb-2">Contacto</p>
          <p className="muted">
            Preguntas sobre estos terminos: escribe a{" "}
            <a href="mailto:jaywrkr@gmail.com" className="link-accent">jaywrkr@gmail.com</a>.
          </p>
        </section>
      </div>

      <p className="muted">
        Ver tambien: <Link href="/privacidad" className="link-accent">Politica de privacidad</Link>
      </p>
    </main>
  );
}
