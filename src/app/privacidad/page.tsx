import Link from "next/link";

export const metadata = { title: "Privacidad — EJECUTA" };

export default function PrivacidadPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <Link href="/" className="text-xs uppercase tracking-widest text-neutral-500 hover:text-accent transition-colors">
        ← EJECUTA
      </Link>
      <p className="kicker mt-8">Legal</p>
      <h1 className="text-3xl font-extrabold tracking-tight mb-2">Politica de privacidad</h1>
      <p className="muted mb-10">Ultima actualizacion: julio 2026.</p>

      <div className="flex flex-col gap-8 mb-16">
        <section>
          <p className="font-bold mb-2">Que guardamos</p>
          <p className="muted">
            Tu nombre, tu email, tu contraseña (encriptada, nunca en texto plano), los habitos que
            creas y cuando los marcas, tus respuestas en los modulos, y tus mediciones del Wheel of
            Life. Nada mas que eso.
          </p>
        </section>

        <section>
          <p className="font-bold mb-2">Para que lo usamos</p>
          <p className="muted">
            Para que la app funcione: mostrarte tu progreso, calcular tu racha, mandarte el correo
            de recuperacion de contraseña si lo pides, y avisarte por email si tienes un habito
            pendiente (puedes desactivar esto ultimo con un click desde el mismo correo).
          </p>
        </section>

        <section>
          <p className="font-bold mb-2">Con quien lo compartimos</p>
          <p className="muted">
            Con nadie para fines comerciales. No vendemos ni alquilamos tus datos. Usamos dos
            proveedores para que el servicio funcione: Vercel/Neon para guardar la base de datos, y
            Resend para enviar correos. Ambos solo procesan los datos necesarios para prestar ese
            servicio tecnico.
          </p>
        </section>

        <section>
          <p className="font-bold mb-2">Cookies</p>
          <p className="muted">
            Usamos una sola cookie de sesion para saber que estas logeado. No hay cookies de
            publicidad ni de rastreo de terceros.
          </p>
        </section>

        <section>
          <p className="font-bold mb-2">Borrar tus datos</p>
          <p className="muted">
            Puedes eliminar tu cuenta en cualquier momento desde{" "}
            <Link href="/cuenta" className="link-accent">Mi cuenta</Link>. Al hacerlo, se borra tu
            usuario, tus habitos, tu historial y tus mediciones — de forma permanente e inmediata.
            No guardamos una copia despues.
          </p>
        </section>

        <section>
          <p className="font-bold mb-2">Contacto</p>
          <p className="muted">
            Preguntas sobre tus datos: escribe a{" "}
            <a href="mailto:jaywrkr@gmail.com" className="link-accent">jaywrkr@gmail.com</a>.
          </p>
        </section>
      </div>

      <p className="muted">
        Ver tambien: <Link href="/terminos" className="link-accent">Terminos de uso</Link>
      </p>
    </main>
  );
}
