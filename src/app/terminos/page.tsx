import Link from "next/link";

export const metadata = { title: "Términos — Ankla", alternates: { canonical: "/terminos" } };

export default function TerminosPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <Link href="/" className="text-xs uppercase tracking-widest text-neutral-500 hover:text-accent transition-colors">
        ← Ankla
      </Link>
      <p className="kicker mt-8">Legal</p>
      <h1 className="text-3xl font-thin tracking-tight mb-2">Términos de uso</h1>
      <p className="muted mb-10">Última actualización: julio de 2026.</p>

      <div className="flex flex-col gap-8 mb-16">
        <section>
          <h2 className="font-bold mb-2">Qué es Ankla y quién lo opera</h2>
          <p className="muted">
            Ankla es un sistema de ejecución sostenible: módulos interactivos, un habit tracker
            progresivo y mediciones periódicas (Radar de Vida). Es una herramienta de hábitos y
            productividad personal — no es consejo médico, financiero ni psicológico, y no
            sustituye la atención de un profesional. El servicio lo opera la marca{" "}
            <span className="text-neutral-300">HIIFUTUR</span>. Al crear una cuenta o usar el
            servicio aceptas estos términos.
          </p>
        </section>

        <section>
          <h2 className="font-bold mb-2">Edad mínima</h2>
          <p className="muted">
            Debes tener al menos 16 años para usar Ankla. Si eres menor de esa edad, no crees una
            cuenta. Si detectamos una cuenta de un menor de 16, la eliminaremos.
          </p>
        </section>

        <section>
          <h2 className="font-bold mb-2">Tu cuenta</h2>
          <p className="muted">
            Eres responsable de mantener segura tu contraseña y de la actividad de tu cuenta. No
            compartas tu cuenta ni uses la de otra persona. Los datos que registras (nombre, email,
            hábitos) deben ser reales y tuyos. Puedes eliminar tu cuenta cuando quieras desde{" "}
            <Link href="/cuenta" className="link-accent">Mi cuenta</Link>.
          </p>
        </section>

        <section>
          <h2 className="font-bold mb-2">Uso aceptable</h2>
          <p className="muted">
            No uses Ankla para nada ilegal, para intentar acceder a cuentas de otras personas,
            para saltarte límites técnicos, extraer datos de forma automatizada, o para interferir
            con el funcionamiento del servicio. Podemos suspender o cerrar cuentas que incumplan
            estas reglas.
          </p>
        </section>

        <section>
          <h2 className="font-bold mb-2">Planes, precios y pagos</h2>
          <p className="muted">
            Ankla tiene un plan gratuito y planes de pago (mensual y anual). Los cobros de los
            planes de pago ya están activos. Toda cuenta empieza con 7 días de prueba gratis, sin
            tarjeta, con el sistema completo. Si decides seguir dentro de esos 7 días, activas un
            plan pago. El precio regular es $6.99/mes o $59/año. Si activas dentro de tus primeros
            7 días desbloqueas el precio fundador — $4.99/mes o $42/año — fijo mientras mantengas
            tu suscripción activa sin interrupción. Aplica lo siguiente:
          </p>
          <ul className="muted mt-3 flex flex-col gap-2 list-disc pl-5">
            <li>
              Las suscripciones se renuevan automáticamente al final de cada periodo (mensual o
              anual) al precio vigente para tu cuenta, hasta que las canceles.
            </li>
            <li>
              Puedes cancelar en cualquier momento desde{" "}
              <Link href="/cuenta" className="link-accent">Mi cuenta</Link>. La cancelación detiene
              la siguiente renovación; conservas el acceso hasta que termina el periodo ya pagado.
              Si vuelves a activar después de cancelar, el precio fundador ya no aplica.
            </li>
            <li>
              Reembolsos: si algo sale mal o no quedaste conforme, escríbenos dentro de los primeros
              14 días de un cobro y buscamos una solución justa, incluido el reembolso cuando
              corresponda. Los impuestos aplicables no son reembolsables.
            </li>
            <li>
              Los pagos se procesan por PayPal. Puedes pagar con tu cuenta PayPal o con tarjeta sin
              tener una. Nunca vemos ni guardamos los datos completos de tu tarjeta.
            </li>
            <li>Podemos cambiar los precios avisándote con antelación razonable antes de tu próxima renovación.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-bold mb-2">Contenido y propiedad</h2>
          <p className="muted">
            El contenido del curso, los textos, el diseño y la marca son de HIIFUTUR y no puedes
            copiarlos ni revenderlos. Lo que tú escribes (tus respuestas, tus hábitos, tus
            mediciones) es tuyo: solo lo usamos para hacer funcionar el servicio, como se explica en
            la <Link href="/privacidad" className="link-accent">Política de privacidad</Link>.
          </p>
        </section>

        <section>
          <h2 className="font-bold mb-2">Sin garantías</h2>
          <p className="muted">
            Ankla se ofrece &ldquo;tal cual&rdquo; y &ldquo;según disponibilidad&rdquo;. Hacemos
            lo posible por mantenerlo funcionando de forma estable, pero no garantizamos que esté
            libre de errores o interrupciones, ni que produzca un resultado específico en tu vida o
            en tus hábitos.
          </p>
        </section>

        <section>
          <h2 className="font-bold mb-2">Límite de responsabilidad</h2>
          <p className="muted">
            En la medida que permita la ley, HIIFUTUR no es responsable por daños indirectos,
            incidentales o consecuentes derivados del uso o la imposibilidad de usar el servicio. Si
            alguna vez fuéramos responsables por algo, esa responsabilidad se limita a lo que hayas
            pagado por el servicio en los 12 meses previos.
          </p>
        </section>

        <section>
          <h2 className="font-bold mb-2">Suspensión y cierre</h2>
          <p className="muted">
            Puedes dejar de usar Ankla y borrar tu cuenta cuando quieras. Nosotros podemos
            suspender o cerrar el servicio, o una cuenta, si hay un uso indebido, un riesgo de
            seguridad, o una obligación legal. Si cerramos el servicio por completo, te avisaremos
            con antelación razonable.
          </p>
        </section>

        <section>
          <h2 className="font-bold mb-2">Cambios</h2>
          <p className="muted">
            Podemos actualizar estos términos conforme el producto evoluciona. Si el cambio es
            importante, lo vas a notar — no escondemos cambios relevantes en letra chica. La fecha de
            &ldquo;última actualización&rdquo; arriba te dice cuándo cambiaron por última vez.
          </p>
        </section>

        <section>
          <h2 className="font-bold mb-2">Ley aplicable</h2>
          <p className="muted">
            Estos términos se rigen por las leyes de la República del Ecuador. Cualquier disputa se
            resolverá ante los tribunales competentes del Ecuador, sin perjuicio de los derechos que
            te reconozca la ley de tu país de residencia como consumidor.
          </p>
        </section>

        <section>
          <h2 className="font-bold mb-2">Contacto</h2>
          <p className="muted">
            Preguntas sobre estos términos: escribe a{" "}
            <a href="mailto:jaywrkr@gmail.com" className="link-accent">jaywrkr@gmail.com</a>.
          </p>
        </section>
      </div>

      <p className="muted">
        Ver también: <Link href="/privacidad" className="link-accent">Política de privacidad</Link>
      </p>
    </main>
  );
}
