export const CHANGELOG: { version: string; date: string; changes: string[] }[] = [
  {
    version: "2.26.0",
    date: "2026-07-10",
    changes: [
      "Refuerzo de seguridad: cabeceras de protección del navegador (anti-clickjacking, HTTPS forzado y más) en todas las páginas.",
      "El endpoint de instalación de la base de datos queda desactivado por defecto — deja de ser una puerta abierta en producción.",
      "Cifrado de contraseñas más fuerte para las cuentas nuevas y los cambios de contraseña.",
    ],
  },
  {
    version: "2.25.0",
    date: "2026-07-10",
    changes: [
      "Cada módulo ahora tiene una ilustración de su idea clave (batería de voluntad, 80/20, cadena de hábitos, brújula...).",
      "El curso hila mejor: cada módulo dice de dónde vienes y a dónde vas.",
      "Los módulos retoman tus propias respuestas anteriores — ya no empiezas de cero en cada uno.",
    ],
  },
  {
    version: "2.24.0",
    date: "2026-07-10",
    changes: [
      "Menú de navegación en negrita.",
      "El curso se reorganizó por fases: cada fase es ahora una sección clara con su avance y el estado de cada módulo.",
    ],
  },
  {
    version: "2.23.0",
    date: "2026-07-10",
    changes: [
      "Nuevo diseño de tarjetas para “Tu progreso” en Hoy y para la página de cuenta.",
      "Arreglado el enlace a los Términos de uso, que daba 404.",
    ],
  },
  {
    version: "2.22.0",
    date: "2026-07-10",
    changes: [
      "Ciclo de formaciÃ³n de 30 dÃ­as: los mÃ³dulos se ganan con ejecuciÃ³n real (uno cada 3 dÃ­as de hÃ¡bito cumplido).",
      "Un fallo se perdona; al segundo se reinicia el ciclo: mÃ³dulos y puntos del ciclo se pierden (tus ejercicios escritos se conservan).",
      "Completar un mÃ³dulo ahora tambiÃ©n suma puntos.",
      "Menu hamburguesa en mÃ³vil.",
    ],
  },
  {
    version: "2.21.0",
    date: "2026-07-10",
    changes: ["Tests automatizados y CI: cada cambio se valida antes de llegar a producciÃ³n."],
  },
  {
    version: "2.20.0",
    date: "2026-07-09",
    changes: [
      "Puntos y niveles: cada hÃ¡bito marcado suma puntos; subir de nivel cuesta cada vez mÃ¡s.",
      "Leaderboard con los 10 primeros.",
      "RediseÃ±o de Hoy y del perfil.",
    ],
  },
  {
    version: "2.19.0",
    date: "2026-07-09",
    changes: [
      "Heatmap de tu historial de habitos (manten presionado un dia para ver su detalle).",
      "Estadisticas: mejor racha historica, total de checks y insignia de habito ancla.",
      "Celebracion al alcanzar hitos de racha y aviso de color cuando tu racha esta en riesgo.",
      "Grafica de la rueda animada, vibracion al marcar y desliza hacia abajo para refrescar.",
    ],
  },
  {
    version: "2.18.0",
    date: "2026-07-09",
    changes: [
      "Pagina 404 propia, imagen para compartir en redes, sitemap y estados de carga.",
      "Este changelog publico.",
    ],
  },
  {
    version: "2.17.0",
    date: "2026-07-09",
    changes: ["Nueva secciÃ³n \"Las reglas viejas\" en el home."],
  },
  {
    version: "2.16.0",
    date: "2026-07-09",
    changes: ["SecciÃ³n de planes (gratis, mensual, anual) en el home."],
  },
  {
    version: "2.15.0",
    date: "2026-07-09",
    changes: ["Nueva secciÃ³n \"Aprende. ActÃºa. Mide. Repite.\" en el home."],
  },
  {
    version: "2.14.0",
    date: "2026-07-08",
    changes: ["AnalÃ­tica de producto propia, sin terceros ni cookies de rastreo."],
  },
  {
    version: "2.13.0",
    date: "2026-07-08",
    changes: ["Boton de feedback visible en toda la app."],
  },
  {
    version: "2.12.0",
    date: "2026-07-08",
    changes: ["Monitoreo de errores en producciÃ³n."],
  },
  {
    version: "2.11.0",
    date: "2026-07-08",
    changes: ["Compartir tu racha o tu Wheel of Life como imagen."],
  },
  {
    version: "2.10.0",
    date: "2026-07-08",
    changes: ["TÃ©rminos, privacidad, y la opciÃ³n de borrar tu cuenta por completo."],
  },
  {
    version: "2.9.0",
    date: "2026-07-08",
    changes: ["Tu primer Wheel of Life ahora sugiere con que hÃ¡bito empezar."],
  },
  {
    version: "2.8.0",
    date: "2026-07-08",
    changes: ["ProtecciÃ³n de racha: congela un dÃ­a perdido, una vez al mes."],
  },
  {
    version: "2.7.0",
    date: "2026-07-08",
    changes: ["La app ahora se puede instalar desde el navegador."],
  },
  {
    version: "2.6.0",
    date: "2026-07-08",
    changes: ["Recordatorios diarios por email cuando se te pasa un hÃ¡bito."],
  },
  {
    version: "2.0.0 â 2.5.0",
    date: "2026-07-07 â 2026-07-08",
    changes: [
      "Rebrand completo: tipografia, colores y formas.",
      "Landing publica con hero, ticker y secciÃ³n de la app web.",
      "EdiciÃ³n de hÃ¡bitos con perÃ­odo de espera; arreglo del gesto de mantener presionado en mÃ³vil.",
      "Las migraciones de base de datos corren solas en cada deploy.",
    ],
  },
  {
    version: "1.0.0",
    date: "2026-07-07",
    changes: [
      "Lanzamiento inicial: cuenta, onboarding, 11 mÃ³dulos, habit tracker y Wheel of Life.",
      "RecuperaciÃ³n de contraseÃ±a.",
    ],
  },
];
