import Link from "next/link";

export const metadata = { title: "Privacidad — Ankla", alternates: { canonical: "/privacidad" } };

export default function PrivacidadPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <Link href="/" className="text-xs uppercase tracking-widest text-neutral-500 hover:text-accent transition-colors">
        ← Ankla
      </Link>
      <p className="kicker mt-8">Legal</p>
      <h1 className="text-3xl font-thin tracking-tight mb-2">Política de privacidad</h1>
      <p className="muted mb-10">Última actualización: julio de 2026.</p>

      <div className="flex flex-col gap-8 mb-16">
        <section>
          <h2 className="font-bold mb-2">Quién es responsable de tus datos</h2>
          <p className="muted">
            El responsable del tratamiento de tus datos es{" "}
            <span className="text-neutral-300">Jay Jaramillo (jaywrkr)</span>, que opera Ankla desde Ecuador. Para
            cualquier tema de datos puedes escribir a{" "}
            <a href="mailto:jaywrkr@gmail.com" className="link-accent">jaywrkr@gmail.com</a>.
          </p>
        </section>

        <section>
          <h2 className="font-bold mb-2">Qué guardamos</h2>
          <p className="muted">
            Tu nombre, tu email, tu contraseña (encriptada, nunca en texto plano), los hábitos que
            creas y cuándo los marcas, tus respuestas en los módulos, y tus mediciones del Radar de
            Vida. También guardamos eventos de uso del producto (por ejemplo: que te registraste o
            que completaste un módulo) asociados a tu cuenta, para entender cómo se usa la app y
            mejorarla.
          </p>
        </section>

        <section>
          <h2 className="font-bold mb-2">Para qué lo usamos</h2>
          <p className="muted">
            Para que la app funcione y mejore: mostrarte tu progreso, calcular tu racha, mandarte el
            correo de recuperación de contraseña si lo pides, avisarte por email si tienes un hábito
            pendiente (puedes desactivar esto con un click desde el mismo correo), y medir de forma
            interna cómo se usa el producto. La base para tratar tus datos es prestarte el servicio
            que pediste y nuestro interés legítimo en mantenerlo seguro y mejorarlo.
          </p>
        </section>

        <section>
          <h2 className="font-bold mb-2">Con quién lo compartimos</h2>
          <p className="muted">
            Con nadie para fines comerciales. No vendemos ni alquilamos tus datos. Usamos algunos
            proveedores que procesan datos solo para que el servicio funcione:
          </p>
          <ul className="muted mt-3 flex flex-col gap-2 list-disc pl-5">
            <li>
              <span className="text-neutral-300">Vercel / Neon</span> — alojamiento de la app y de la
              base de datos.
            </li>
            <li>
              <span className="text-neutral-300">Resend</span> — envío de los correos (recuperación de
              contraseña y recordatorios).
            </li>
            <li>
              <span className="text-neutral-300">Sentry</span> — reporte de errores técnicos para
              detectar y arreglar fallos.
            </li>
          </ul>
          <p className="muted mt-3">
            Cuando activemos los pagos, un proveedor externo de pagos procesará el cobro; nunca
            veremos ni guardaremos los datos completos de tu tarjeta. También podríamos compartir
            datos si la ley nos obliga.
          </p>
        </section>

        <section>
          <h2 className="font-bold mb-2">Cookies</h2>
          <p className="muted">
            Usamos una sola cookie de sesión para saber que estás logeado. No hay cookies de
            publicidad ni de rastreo de terceros.
          </p>
        </section>

        <section>
          <h2 className="font-bold mb-2">Cuánto tiempo lo guardamos</h2>
          <p className="muted">
            Conservamos tus datos mientras tengas la cuenta activa. Cuando la eliminas, se borran de
            inmediato. Los correos de recuperación de contraseña caducan solos al poco tiempo de
            pedirlos.
          </p>
        </section>

        <section>
          <h2 className="font-bold mb-2">Cómo lo protegemos</h2>
          <p className="muted">
            Las contraseñas se guardan encriptadas (hash bcrypt), la conexión va siempre por HTTPS y
            limitamos los intentos de inicio de sesión para frenar ataques. Ningún sistema es
            perfecto, pero tratamos tus datos con el cuidado que nos gustaría para los nuestros.
          </p>
        </section>

        <section>
          <h2 className="font-bold mb-2">Tus derechos</h2>
          <p className="muted">
            Conforme a la Ley Orgánica de Protección de Datos Personales del Ecuador, puedes pedir
            acceso a tus datos, corregirlos, eliminarlos, llevarte una copia (portabilidad) u
            oponerte a ciertos tratamientos. Para ejercerlos, escríbenos a{" "}
            <a href="mailto:jaywrkr@gmail.com" className="link-accent">jaywrkr@gmail.com</a>. Muchas de
            estas acciones las puedes hacer tú mismo desde{" "}
            <Link href="/cuenta" className="link-accent">Mi cuenta</Link>.
          </p>
        </section>

        <section>
          <h2 className="font-bold mb-2">Menores de edad</h2>
          <p className="muted">
            Ankla es para mayores de 16 años. No recopilamos datos de menores de esa edad a
            sabiendas. Si crees que un menor nos dio sus datos, escríbenos y los eliminamos.
          </p>
        </section>

        <section>
          <h2 className="font-bold mb-2">Borrar tus datos</h2>
          <p className="muted">
            Puedes eliminar tu cuenta en cualquier momento desde{" "}
            <Link href="/cuenta" className="link-accent">Mi cuenta</Link>. Al hacerlo, se borra tu
            usuario, tus hábitos, tu historial y tus mediciones — de forma permanente e inmediata. No
            guardamos una copia después.
          </p>
        </section>

        <section>
          <h2 className="font-bold mb-2">Cambios</h2>
          <p className="muted">
            Si cambiamos esta política de forma importante, lo vas a notar. La fecha de arriba te dice
            cuándo se actualizó por última vez.
          </p>
        </section>

        <section>
          <h2 className="font-bold mb-2">Contacto</h2>
          <p className="muted">
            Preguntas sobre tus datos: escribe a{" "}
            <a href="mailto:jaywrkr@gmail.com" className="link-accent">jaywrkr@gmail.com</a>.
          </p>
        </section>
      </div>

      <p className="muted">
        Ver también: <Link href="/terminos" className="link-accent">Términos de uso</Link>
      </p>
    </main>
  );
}
