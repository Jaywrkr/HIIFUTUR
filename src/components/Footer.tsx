import Link from "next/link";

const GROUPS = [
  {
    label: "Producto",
    links: [
      { href: "/register", text: "Crear cuenta" },
      { href: "/login", text: "Iniciar sesión" },
      { href: "/changelog", text: "Changelog" },
    ],
  },
  {
    label: "Legal",
    links: [
      { href: "/terminos", text: "Términos de uso" },
      { href: "/privacidad", text: "Privacidad" },
      { href: "mailto:jaywrkr@gmail.com", text: "Contacto" },
    ],
  },
  {
    label: "Redes",
    links: [
      { href: "https://instagram.com/jaywrkr", text: "Jay Jaramillo (@jaywrkr)", external: true },
      { href: "https://x.com/jaywrkr", text: "X", external: true },
      { href: "https://www.linkedin.com/in/jaywrkr/", text: "LinkedIn", external: true },
    ],
  },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line mt-4">
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-14">
        <p className="text-sm font-thin tracking-[0.3em] text-white mb-4">Ankla</p>
        <p className="text-sm text-neutral-400 max-w-md leading-relaxed mb-12">
          Sistema de ejecución sostenible: aprendizaje, hábitos y Radar de Vida en un mismo lugar.
          Un producto de Jay Jaramillo (jaywrkr), operado desde Ecuador.
        </p>

        <div className="border-t border-line">
          {GROUPS.map((group) => (
            <div
              key={group.label}
              className="border-b border-line py-6 flex flex-col sm:flex-row sm:items-start gap-3"
            >
              <p className="text-xs uppercase tracking-widest text-neutral-500 sm:w-40 shrink-0">
                {group.label}
              </p>
              <div className="flex flex-col gap-3">
                {group.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    {...("external" in link && link.external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className="text-sm text-neutral-300 hover:text-accent transition-colors inline-flex items-center gap-2 w-fit"
                  >
                    {link.text} <span aria-hidden="true">→</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-500 text-center sm:text-left">
          <p>© {year} Jay Jaramillo. Todos los derechos reservados.</p>
          <p>Ankla no es consejo médico, financiero ni psicológico.</p>
        </div>
      </div>
    </footer>
  );
}
