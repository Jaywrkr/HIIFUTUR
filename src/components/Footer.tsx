import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line mt-4">
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-14">
        <div className="grid md:grid-cols-[1.5fr_1fr_1fr] gap-10 mb-10">
          <div>
            <p className="text-sm font-bold tracking-[0.3em] text-white mb-3">EJECUTA</p>
            <p className="text-sm text-neutral-400 max-w-sm leading-relaxed">
              Sistema de ejecución sostenible: aprendizaje, hábitos y Wheel of Life en un mismo
              lugar. Un producto de HIIFUTUR, operado desde Ecuador.
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-neutral-500 mb-3">Producto</p>
            <div className="flex flex-col gap-2 text-sm">
              <Link href="/register" className="text-neutral-400 hover:text-accent transition-colors">
                Crear cuenta
              </Link>
              <Link href="/login" className="text-neutral-400 hover:text-accent transition-colors">
                Iniciar sesión
              </Link>
              <Link href="/changelog" className="text-neutral-400 hover:text-accent transition-colors">
                Changelog
              </Link>
            </div>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-neutral-500 mb-3">Legal</p>
            <div className="flex flex-col gap-2 text-sm">
              <Link href="/terminos" className="text-neutral-400 hover:text-accent transition-colors">
                Términos de uso
              </Link>
              <Link href="/privacidad" className="text-neutral-400 hover:text-accent transition-colors">
                Privacidad
              </Link>
              <a
                href="mailto:jaywrkr@gmail.com"
                className="text-neutral-400 hover:text-accent transition-colors"
              >
                Contacto
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-line pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-400 text-center sm:text-left">
          <p>© {year} HIIFUTUR. Todos los derechos reservados.</p>
          <p>EJECUTA no es consejo médico, financiero ni psicológico.</p>
        </div>
      </div>
    </footer>
  );
}
