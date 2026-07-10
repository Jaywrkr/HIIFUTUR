export const CHANGELOG: { version: string; date: string; changes: string[] }[] = [
  {
    version: "2.22.0",
    date: "2026-07-10",
    changes: [
      "Ciclo de formación de 30 días: los módulos se ganan con ejecución real (uno cada 3 días de hábito cumplido).",
      "Un fallo se perdona; al segundo se reinicia el ciclo: módulos y puntos del ciclo se pierden (tus ejercicios escritos se conservan).",
      "Completar un módulo ahora también suma puntos.",
      "Menu hamburguesa en móvil.",
    ],
  },
  {
    version: "2.21.0",
    date: "2026-07-10",
    changes: ["Tests automatizados y CI: cada cambio se valida antes de llegar a producción."],
  },
  {
    version: "2.20.0",
    date: "2026-07-09",
    changes: [
      "Puntos y niveles: cada hábito marcado suma puntos; subir de nivel cuesta cada vez más.",
      "Leaderboard con los 10 primeros.",
      "Rediseño de Hoy y del perfil.",
    ],
  },
  {
    version: "2.17.0",
    date: "2026-07-09",
    changes: ["Nueva sección \"Las reglas viejas\" en el home."],
  },
  {
    version: "2.16.0",
    date: "2026-07-09",
    changes: ["Sección de planes (gratis, mensual, anual) en el home."],
  },
  {
    version: "2.15.0",
    date: "2026-07-09",
    changes: ["Nueva sección \"Aprende. Actúa. Mide. Repite.\" en el home."],
  },
  {
    version: "2.14.0",
    date: "2026-07-08",
    changes: ["Analítica de producto propia, sin terceros ni cookies de rastreo."],
  },
  {
    version: "2.13.0",
    date: "2026-07-08",
    changes: ["Boton de feedback visible en toda la app."],
  },
  {
    version: "2.12.0",
    date: "2026-07-08",
    changes: ["Monitoreo de errores en producción."],
  },
  {
    version: "2.11.0",
    date: "2026-07-08",
    changes: ["Compartir tu racha o tu Wheel of Life como imagen."],
  },
  {
    version: "2.10.0",
    date: "2026-07-08",
    changes: ["Términos, privacidad, y la opción de borrar tu cuenta por completo."],
  },
  {
    version: "2.9.0",
    date: "2026-07-08",
    changes: ["Tu primer Wheel of Life ahora sugiere con que hábito empezar."],
  },
  {
    version: "2.8.0",
    date: "2026-07-08",
    changes: ["Protección de racha: congela un día perdido, una vez al mes."],
  },
  {
    version: "2.7.0",
    date: "2026-07-08",
    changes: ["La app ahora se puede instalar desde el navegador."],
  },
  {
    version: "2.6.0",
    date: "2026-07-08",
    changes: ["Recordatorios diarios por email cuando se te pasa un hábito."],
  },
  {
    version: "2.0.0 – 2.5.0",
    date: "2026-07-07 – 2026-07-08",
    changes: [
      "Rebrand completo: tipografia, colores y formas.",
      "Landing publica con hero, ticker y sección de la app web.",
      "Edición de hábitos con período de espera; arreglo del gesto de mantener presionado en móvil.",
      "Las migraciones de base de datos corren solas en cada deploy.",
    ],
  },
  {
    version: "1.0.0",
    date: "2026-07-07",
    changes: [
      "Lanzamiento inicial: cuenta, onboarding, 11 módulos, habit tracker y Wheel of Life.",
      "Recuperación de contraseña.",
    ],
  },
];
