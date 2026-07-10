export const CHANGELOG: { version: string; date: string; changes: string[] }[] = [
  {
    version: "2.31.0",
    date: "2026-07-10",
    changes: [
      "Ciclo de 30 días: ahora se permiten hasta 2 fallos (antes era 1). Al tercero el ciclo se reinicia, pero ya no pierdes todos tus puntos — conservas la mitad de lo ganado en el ciclo. Explicado en la bienvenida al curso, en el tablero y en las preguntas frecuentes de la landing.",
      "El Módulo 1 ahora es donde eliges tu hábito ancla — pequeño, tipo 'estudiar 5 minutos' — y crear tu primer hábito en /habits queda bloqueado hasta terminarlo. Los módulos 2 a 5 se ajustaron para que la historia siga teniendo sentido con este cambio.",
    ],
  },
  {
    version: "2.30.0",
    date: "2026-07-10",
    changes: [
      "Landing: la segunda mitad de la página se condensó en menos secciones (por qué lo hicimos, historia de Jay, para quién es y FAQ) con el mismo lenguaje visual — tarjetas y encabezados — que el resto de la página.",
      "Bienvenida al curso: se agregó un paso que explica la metodología general (Curso + Hábitos + Wheel of Life = Aprendizaje + Acción + Control) antes de decirte por dónde empezar.",
    ],
  },
  {
    version: "2.29.0",
    date: "2026-07-10",
    changes: [
      "Repaso de ortografía en toda la app: tildes y signos de interrogación corregidos en la landing, los formularios, los mensajes y el historial de cambios.",
    ],
  },
  {
    version: "2.28.0",
    date: "2026-07-10",
    changes: [
      "Términos de uso y Política de privacidad reescritos y completos: quién opera el servicio, edad mínima, planes y reembolsos, tus derechos sobre tus datos y la ley aplicable (Ecuador).",
      "Se aclara qué proveedores procesan tus datos (Vercel/Neon, Resend, Sentry) y cómo los protegemos.",
    ],
  },
  {
    version: "2.27.0",
    date: "2026-07-10",
    changes: [
      "Límite de intentos en inicio de sesión, registro, recuperación de contraseña y feedback: frena la fuerza bruta y el spam.",
      "Si haces demasiados intentos seguidos, ahora te avisamos cuánto esperar en vez de dejarte insistir.",
    ],
  },
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
      "Ciclo de formación de 30 días: los módulos se ganan con ejecución real (uno cada 3 días de hábito cumplido).",
      "Un fallo se perdona; al segundo se reinicia el ciclo: módulos y puntos del ciclo se pierden (tus ejercicios escritos se conservan).",
      "Completar un módulo ahora también suma puntos.",
      "Menú hamburguesa en móvil.",
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
    version: "2.19.0",
    date: "2026-07-09",
    changes: [
      "Heatmap de tu historial de hábitos (mantén presionado un día para ver su detalle).",
      "Estadísticas: mejor racha histórica, total de checks y insignia de hábito ancla.",
      "Celebración al alcanzar hitos de racha y aviso de color cuando tu racha está en riesgo.",
      "Gráfica de la rueda animada, vibración al marcar y desliza hacia abajo para refrescar.",
    ],
  },
  {
    version: "2.18.0",
    date: "2026-07-09",
    changes: [
      "Página 404 propia, imagen para compartir en redes, sitemap y estados de carga.",
      "Este changelog público.",
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
    changes: ["Botón de feedback visible en toda la app."],
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
    changes: ["Tu primer Wheel of Life ahora sugiere con qué hábito empezar."],
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
      "Rebrand completo: tipografía, colores y formas.",
      "Landing pública con hero, ticker y sección de la app web.",
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
