export const CHANGELOG_DESCRIPTION =
  "Todo lo que cambia en EJECUTA, versión por versión — features nuevas, arreglos y mejoras.";

export const CHANGELOG: { version: string; date: string; changes: string[] }[] = [
  {
    version: "2.95.0",
    date: "2026-07-21",
    changes: [
      "El paso 2 del onboarding (medir tu Wheel of Life inicial) ya no desperdicia media pantalla en desktop — pasa a 3 columnas y usa el ancho disponible en vez de quedarse en una columna angosta centrada. De paso se corrige la causa real: la tarjeta de autenticación (login, registro, onboarding) tenía su ancho fuera de la capa de componentes de Tailwind, así que ningún override de ancho que se le pusiera encima funcionaba de verdad — quedaba silenciosamente ignorado.",
      "La entrada a cada módulo suma un orbe grande (el mismo círculo con degradado que ya usan los thumbnails de la lista de Módulos) antes del título — la sensación de 'sesión que estás por empezar' de la referencia de diseño, sin inventar audio o instructor que la app no tiene.",
    ],
  },
  {
    version: "2.94.0",
    date: "2026-07-20",
    changes: [
      "Se formaliza la paleta de marca (Oliva, Mostaza, Coral, Cielo, Salvia, Terracota): cada categoría de hábito tiene ahora un color fijo tomado de esa paleta, y el Wheel of Life se pinta con el mismo color que su categoría asociada — el punto activo, el radar y los sliders de la medición mensual. El cuestionario de cada módulo también usa esos tonos en los puntos junto a cada opción de respuesta, en vez de un color genérico.",
    ],
  },
  {
    version: "2.93.0",
    date: "2026-07-20",
    changes: [
      "El interior de cada módulo (IMAGEN 2) suma el mismo lenguaje visual que ya tiene la lista de Módulos: la tarjeta de Ejercicio y la de \"Lo que sigue\" ahora llevan un thumbnail junto al título, en vez de ser solo texto — la misma sensación de \"sesión que estás por empezar\" de la referencia. De paso, \"Lo que sigue\" pierde el relleno de color que le quedaba (solo borde, como el resto de la app).",
    ],
  },
  {
    version: "2.92.0",
    date: "2026-07-20",
    changes: [
      "La lista de Módulos se rediseña al estilo editorial de la referencia (IMAGEN 3): cada módulo pasa de una fila dividida en una lista a su propia tarjeta, con un thumbnail visual a la izquierda (reusa el PhotoSlot del perfil, con un tono distinto por módulo) y \"Empezar →\" / \"Revisar →\" como link, en vez del botón pill anterior. Los módulos bloqueados se ven apagados; el completado lleva una insignia de check sobre su thumbnail.",
    ],
  },
  {
    version: "2.91.0",
    date: "2026-07-20",
    changes: [
      "El perfil (Cuenta) se rediseña al estilo editorial de la referencia: un panel oliva con el nombre a la izquierda y una foto de perfil circular grande a la derecha, con nivel/puntos/racha y el hábito ancla divididos por líneas finas. La foto es por ahora un espacio con un degradado suave — un \"hueco\" listo para cambiar por una foto real cuando exista esa función, sin rehacer nada.",
    ],
  },
  {
    version: "2.90.0",
    date: "2026-07-19",
    changes: [
      "El jardín zen suma otra vuelta de realismo: las líneas peinadas de arena ahora ondulan levemente en vez de ser rectas perfectas (como un rastrillo real tirado a mano), las piedras tienen textura mineral visible, algunas llevan un poco de musgo en la base, y aparecen guijarros sueltos dispersos por la arena.",
    ],
  },
  {
    version: "2.89.0",
    date: "2026-07-19",
    changes: [
      "El jardín zen ahora se ve como un jardín zen real: arena color tierra en vez de líneas blancas sobre negro, piedras con forma irregular y sombra propia, ondas concéntricas alrededor de cada piedra (como grava rastrillada de verdad), líneas peinadas que se abren paso alrededor de las piedras en vez de atravesarlas, y una bandeja de madera enmarcando todo. Al trazar, el rastrillo deja 4 surcos paralelos (como los dientes de un rastrillo real) en vez de una sola línea.",
    ],
  },
  {
    version: "2.88.0",
    date: "2026-07-19",
    changes: [
      "Menos texto, más orden — más cerca del estilo compacto de las referencias de diseño: el subtítulo de Hábitos baja de 3 oraciones a una, el banner de prueba en Hoy deja de partirse en 3 líneas, y la tarjeta de \"Tu camino\" deja de repetir el nombre de la fase (ya se ve en Módulos).",
    ],
  },
  {
    version: "2.87.0",
    date: "2026-07-19",
    changes: [
      "Cada categoría de hábito (Salud, Trabajo, Finanzas, Relaciones, Mentalidad, Disciplina) ahora lleva un punto de color propio, apagado y terroso — la misma regla de color de las referencias de diseño (un tono por contexto, nunca saturado) aplicada a algo que ya existía en la app en vez de decoración nueva.",
    ],
  },
  {
    version: "2.86.0",
    date: "2026-07-19",
    changes: [
      "Un peldaño más de jerarquía: títulos de tarjeta, hábito, módulo y fila de leaderboard suben de semibold a bold en toda la app, y la frase promesa del hero de landing (\"Es un sistema que no pueda fallar\") pasa a black — el mismo contraste delgado/negro de un solo golpe que se ve en las referencias de diseño, aplicado a una sola línea, no a todo el texto.",
      "Rediseño de Cuenta: el encabezado pasa de estar centrado a un layout con el nombre a la izquierda y un avatar circular arriba a la derecha (color oliva — marca dónde iría una foto de perfil real, todavía no existe la función de subir foto), con nivel/puntos/racha en una fila de tres divididas por línea en vez de bloques sueltos.",
    ],
  },
  {
    version: "2.85.0",
    date: "2026-07-19",
    changes: [
      "Las celdas \"vacías\" del mapa de hábitos casi no se veían contra el fondo de la tarjeta (contraste real de 1.3:1, por debajo de cualquier mínimo de accesibilidad) — parte de por qué el mapa se sentía disparejo. Suben a un gris con contraste 3:1, visible pero claramente por debajo de una celda marcada.",
    ],
  },
  {
    version: "2.84.0",
    date: "2026-07-19",
    changes: [
      "Pasada de armonía en toda la app: el título principal de Módulos, Hábitos, Wheel, Upgrade, Leaderboard, Changelog, Términos, Privacidad y el detalle de cada módulo tenía un peso distinto (muy negrita) al de Hoy, Cuenta y la landing (delgado) — ahora todos usan el mismo peso, así que navegar entre pantallas no se siente como cambiar de app.",
      "Hábitos y Wheel of Life ya usan íconos (racha y estado vacío), en vez de ser las únicas pantallas centrales sin ninguno.",
      "Se corrige la tilde de \"Qué ha cambiado\" en Changelog y se recorta texto repetido en Upgrade (la nota de \"no guardamos tu tarjeta\" y \"precio fijo para siempre\" se decían hasta 3 veces en la misma pantalla).",
      "La historia real de Jay (3 a 9 en el Wheel of Life, en 8 meses) ahora se escribe una sola vez y se reusa en landing y en Módulos, en vez de mantener dos redacciones distintas del mismo dato.",
    ],
  },
  {
    version: "2.83.0",
    date: "2026-07-19",
    changes: [
      "Arreglo real del mapa de hábitos: la columna más reciente se veía despareja (más corta que las demás) casi todos los días de la semana — un error de cálculo hacía que el total de días no siempre fuera múltiplo de 7, así que esa última columna a veces tenía menos de 7 celdas en vez de una semana completa. Ahora el mapa siempre arma 12 semanas completas, sin importar qué día sea hoy.",
    ],
  },
  {
    version: "2.82.0",
    date: "2026-07-19",
    changes: [
      "Nuevo: Jardín zen en Cuenta. Un espacio de arena interactiva donde trazas con el dedo o el mouse y las líneas se van borrando solas — sin puntos, sin racha, solo para respirar un momento. Las piedras que aparecen reflejan tus hábitos activos.",
    ],
  },
  {
    version: "2.81.0",
    date: "2026-07-19",
    changes: [
      "Landing con más vida: las tres tarjetas del hero ahora flotan con un movimiento lento e independiente entre sí, los paneles destacados y las tarjetas de precio se levantan un poco al pasar el mouse, y las listas de filosofía y preguntas frecuentes aparecen en cascada en vez de todas a la vez.",
      "Textos más simples en \"Cómo vemos las cosas\" y \"El truco\": menos palabras, mismo mensaje. También se recupera peso real (semibold/bold) en títulos de tarjeta y números de la landing, siguiendo el mismo criterio del resto de la app.",
      "Se recupera la jerarquía tipográfica en el resto de la app: el peso delgado (thin) ahora se usa solo para el título principal de cada pantalla, y todo lo demás (títulos de tarjeta, nombres de hábito, números de racha/puntos/nivel, precios) vuelve a tener peso real (semibold o bold) para que se distinga qué es lo importante de un vistazo.",
      "Refuerzo defensivo en el mapa de hábitos: las celdas ahora anulan el estilo nativo de botón del navegador (appearance-none), para que siempre midan exactamente 10px sin importar el navegador.",
    ],
  },
  {
    version: "2.80.0",
    date: "2026-07-19",
    changes: [
      "Más calma en Hoy y Módulos: más espacio entre secciones (el margen entre bloques casi se duplica), tiles más grandes en \"Tu progreso\" y el resumen de nivel/puntos/racha, y cada fila de módulo respira más entre una y otra.",
    ],
  },
  {
    version: "2.79.0",
    date: "2026-07-19",
    changes: [
      "Más zen en el resto de la app: Módulos, Hábitos y Cuenta pierden los rellenos de color que quedaban (banners de ciclo, tarjetas de \"un paso antes\", círculos de íconos en Cuenta) y bajan de negrita a peso delgado/normal en títulos y números, siguiendo el mismo criterio que ya tenían Hoy y la landing. El candado de módulos bloqueados cambia de 🔒 a un guión simple.",
    ],
  },
  {
    version: "2.78.0",
    date: "2026-07-19",
    changes: [
      "Landing más ligera: se quita la sección \"Ahora en la web\" completa, el mockup del teléfono deja de repetirse 3 veces (queda solo junto a la historia de Jay), y las listas de \"reglas viejas\" / \"esto es para ti si\" bajan de longitud. Menos secciones, menos texto por pantalla — una idea a la vez.",
    ],
  },
  {
    version: "2.77.0",
    date: "2026-07-19",
    changes: [
      "Terminar el Módulo 1 ahora crea tu hábito ancla de verdad, no solo lo guarda como texto. Antes tenías que volver a escribirlo desde cero en Hábitos, con una sugerencia distinta a la que viste en el módulo — ahora el hábito que eliges ahí (sugerido o escrito por ti) queda activo de inmediato, con su categoría y su racha, sin repetir el paso.",
      "Se unifica el verbo para hablar del hábito ancla en toda la app (\"se crea\", antes mezclaba \"se elige\"/\"se crea\" en pantallas distintas) y se corrigen 4 erratas reales en el copy de onboarding y hábitos.",
    ],
  },
  {
    version: "2.76.0",
    date: "2026-07-19",
    changes: [
      "Bordes cuadrados en toda la app: las tarjetas, banners y paneles pasaban de esquinas muy redondeadas (rounded-2xl/3xl) a esquinas mínimas, en toda la landing, el dashboard y las pantallas interiores. Los botones y badges tipo píldora se mantienen redondos — el resto queda cuadrado, como la referencia.",
    ],
  },
  {
    version: "2.75.0",
    date: "2026-07-19",
    changes: [
      "\"Hoy\" más zen y cuadrado: el resumen de nivel/puntos/racha y la sección \"Tu progreso\" pasan de una caja dividida a tiles cuadrados individuales con espacio entre ellos (como la cuadrícula de tarjetas de Open), y el módulo destacado pierde su relleno de color para quedar solo en borde.",
    ],
  },
  {
    version: "2.74.0",
    date: "2026-07-18",
    changes: [
      "Landing más zen (parte 2): las sombras pesadas de las tarjetas flotantes y los mockups bajan de intensidad, se quita la textura de puntitos detrás del hero (solo queda un resplandor suave), y \"Esto es para ti si...\" deja de ser una caja con borde para integrarse al flujo de la página como el resto de las secciones.",
    ],
  },
  {
    version: "2.73.0",
    date: "2026-07-18",
    changes: [
      "Más zen: el punto junto al logo ahora respira (pulso lento, como una inhalación/exhalación), el tachado de \"las reglas viejas\" pierde el rojo y queda en gris (monocromo total), las palabras de \"por qué lo hicimos\" se revelan más suave al hacer scroll, y los títulos grandes de la landing tienen más aire entre líneas.",
    ],
  },
  {
    version: "2.72.0",
    date: "2026-07-18",
    changes: [
      "Fuente mucho más liviana: títulos y logo pasan de negrita a peso delgado (thin) en la landing, el nav y las pantallas de acceso; textos de cuerpo y botones bajan de negrita a peso normal. Solo se mantiene algo de peso en etiquetas chicas donde hacía falta legibilidad (badge de precio destacado, contador de pasos).",
    ],
  },
  {
    version: "2.71.0",
    date: "2026-07-18",
    changes: [
      "Landing más zen: más aire entre secciones, el hero pierde el recuadro de color sobre el título y las pastillas iOS/Android que competían con el botón principal, y las animaciones de aparición y el ticker de hábitos van más lentas y suaves.",
    ],
  },
  {
    version: "2.70.0",
    date: "2026-07-18",
    changes: [
      "Arreglo de fuente: la tipografía Geist Mono no se estaba aplicando realmente en producción — un nombre de variable CSS mal escrito hacía que el navegador cayera de vuelta a su fuente por defecto. Ahora usa los archivos reales de Geist Mono (Thin a Black) en vez del paquete npm variable.",
    ],
  },
  {
    version: "2.69.0",
    date: "2026-07-18",
    changes: [
      "Rediseño de marca: los paneles con relleno de color en la landing (\"El truco\", \"Tu ritmo\", plan destacado en precios) pasan a solo borde, y la sección de filosofía se convierte en una lista numerada dividida por líneas — cero rellenos de color, todo línea y tipografía, como la referencia.",
    ],
  },
  {
    version: "2.68.0",
    date: "2026-07-18",
    changes: [
      "Rediseño de marca: la landing y la app ahora llevan el punto de estado junto al logo, el pie de página se reorganiza en filas con flecha (estilo 'Open') y las preguntas frecuentes pasan de tarjetas a una lista dividida por líneas finas — todo más minimalista.",
    ],
  },
  {
    version: "2.67.0",
    date: "2026-07-18",
    changes: [
      "Fase 3 de rediseño de marca: pantallas interiores (Hoy, Módulos, Hábitos, Wheel of Life) sin emojis decorativos — barra de navegación inferior, tarjetas de racha/ancla y el tour de bienvenida ahora en línea con el look monocromo de las fases anteriores.",
    ],
  },
  {
    version: "2.66.0",
    date: "2026-07-18",
    changes: [
      "Fase 2 de rediseño de marca: la landing page se limpia de emojis decorativos en títulos de sección, tarjetas flotantes del hero y el mockup de la app — look más sobrio, en línea con la Fase 1 (monocromo + Geist Mono).",
    ],
  },
  {
    version: "2.65.0",
    date: "2026-07-18",
    changes: [
      "Fase 1 de rediseño de marca: tipografía Geist Mono en toda la app y paleta monocromática (negro/blanco) en lugar del dorado — pantallas, tarjetas para compartir, emails y la imagen de vista previa (OG image). La landing y el resto de pantallas siguen en las próximas fases.",
    ],
  },
  {
    version: "2.64.0",
    date: "2026-07-15",
    changes: [
      "Módulo 1: elegir el hábito ancla ahora muestra 5 opciones sugeridas — no genéricas, elegidas según las áreas que marcaste al empezar y dónde saliste más bajo en tu Wheel of Life. Sigue siendo 100% editable: son punto de partida, no obligación.",
    ],
  },
  {
    version: "2.63.0",
    date: "2026-07-15",
    changes: [
      "Cambio interno — preparación de marketing/lanzamiento: las tarjetas de compartir (racha, Wheel of Life) ahora llevan el dominio de la app abajo, para que alguien que las vea en una historia tenga cómo llegar. Sección de testimonios lista en la landing (apagada hasta que existan reales). Variables de entorno para PayPal, Google Search Console y Meta Pixel documentadas y con el código ya preparado para recibirlas sin más trabajo.",
    ],
  },
  {
    version: "2.62.0",
    date: "2026-07-14",
    changes: [
      "Módulo 11 (cierre del curso): la lista estática de mantras ahora es interactiva — arrastras a tu bolsillo la que más te marcó, justo antes de escribir la tuya.",
      "Con esto los 11 módulos ya tienen su ilustración interactiva.",
    ],
  },
  {
    version: "2.61.0",
    date: "2026-07-14",
    changes: [
      "Módulo 10: la brújula estática ahora es interactiva — arrastras la brújula a cada área de tu vida y ves cómo se movió desde el mes pasado (sube, baja o se queda igual). No es un examen, es hacia dónde te estás moviendo.",
    ],
  },
  {
    version: "2.60.0",
    date: "2026-07-14",
    changes: [
      "Módulo 9: la cadena de hábitos ahora es interactiva — arrastras un solo empujón al primer hábito y ves cómo el resto de la cadena cae solo, sin que tengas que arrastrar cada uno por separado.",
    ],
  },
  {
    version: "2.59.0",
    date: "2026-07-14",
    changes: [
      "Módulo 8: la bifurcación estática de \"dos historias\" ahora es interactiva — arrastras el pensamiento que tuviste después de fallar y ves si esa historia te saca del sistema por semanas o te devuelve hoy mismo.",
    ],
  },
  {
    version: "2.58.0",
    date: "2026-07-14",
    changes: [
      "Módulo 7: las dos barras estáticas de fricción (\"sin diseñar tu entorno\" vs. \"con el entorno a tu favor\") ahora son un medidor interactivo — arrastras distintos cambios de entorno y ves cuánta fricción quita cada uno de verdad. Comprar cosas nuevas casi no ayuda; un cambio gratis y específico sí.",
    ],
  },
  {
    version: "2.57.0",
    date: "2026-07-14",
    changes: [
      "Módulo 6: el gráfico de barras estático de \"cada check es un voto\" ahora es interactivo — arrastras votos uno por uno a una fila y el mensaje va cambiando de \"todavía es solo una intención\" a \"esto ya es quién eres\" según se acumulan.",
    ],
  },
  {
    version: "2.56.0",
    date: "2026-07-14",
    changes: [
      "Módulo 5: la cascada estática de \"hábito ancla\" ahora es interactiva — arrastras distintos candidatos al centro y ves cuántas áreas mueven en cascada. El que arrastra las 4 áreas es tu ancla real; los demás mueven poco o nada, aunque se sientan productivos.",
    ],
  },
  {
    version: "2.55.0",
    date: "2026-07-14",
    changes: [
      "Módulo 4: la ilustración estática de \"un fallo suelto vs. dos seguidos\" ahora es interactiva — arrastras un fallo a cualquier día de la semana (o tocas uno marcado para quitarlo) y ves en vivo si la racha sigue viva o se rompe, aplicando la única regla real del módulo.",
    ],
  },
  {
    version: "2.54.0",
    date: "2026-07-14",
    changes: [
      "Módulo 3: las dos cajas estáticas de \"meta vs sistema\" ahora son una carrera que arrastras día a día — la meta solo avanza cuando hay motivación (y la motivación se seca), el sistema avanza igual todos los días. A los 30 días el sistema gana, no por ser más grande, sino por nunca detenerse.",
    ],
  },
  {
    version: "2.53.0",
    date: "2026-07-14",
    changes: [
      "Módulo 2: la barra estática del 80/20 ahora es un control deslizante — arrastras para elegir cuántas de 10 acciones proteges y ves en vivo qué porcentaje del resultado capturas. Con 2 de 10 ya casi llegas al 80%; seguir agregando después casi no suma.",
    ],
  },
  {
    version: "2.52.0",
    date: "2026-07-14",
    changes: [
      "Módulo 1: la ilustración estática de la batería ahora es un mini-juego — toca la hora del día y arrastra un hábito grande o uno chiquito hasta la batería. El grande solo sobrevive con la batería alta; el chiquito siempre sobrevive. La misma idea del módulo, pero sentida en vez de solo leída.",
    ],
  },
  {
    version: "2.51.0",
    date: "2026-07-14",
    changes: [
      "La pantalla de Hoy se ve más liviana: las tarjetas de Nivel/Puntos/Racha y las de Hábitos/Módulos/Wheel/Leaderboard ahora comparten una sola tarjeta con líneas divisoras en vez de una caja separada cada una — misma información, menos bordes.",
    ],
  },
  {
    version: "2.50.0",
    date: "2026-07-14",
    changes: [
      "Arreglado: la tarjeta \"Tu camino\" en Hoy invitaba a seguir con el siguiente módulo aunque todavía estuviera bloqueado por ejecución (el mismo candado que ya aplica en Módulos). Ahora solo es un enlace directo cuando el módulo de verdad está disponible; si no, explica cuántos días de hábito cumplido faltan para abrirlo.",
    ],
  },
  {
    version: "2.49.0",
    date: "2026-07-14",
    changes: [
      "Cualquier lugar que hable de 'crear tu hábito' ahora deja claro que el primero se elige al terminar el Módulo 1 — no aparece la opción de crearlo antes de eso.",
      "En los módulos, si le das a \"Marcar como completado\" con algo sin llenar, el botón lo avisa: vibra, se pone rojo un segundo y te dice exactamente qué falta.",
      "La explicación extra de cada opción de respuesta ahora está oculta por defecto — la despliegas tocando \"¿Qué significa esto?\".",
      "Los mensajes de \"vuelve en X días\" (Wheel of Life, hábitos, congelar racha) ya no muestran una fecha técnica: dicen \"hoy\", \"mañana\" o \"en X días\".",
      "Quitamos la etiqueta \"HOY\" arriba de la pantalla principal — ya era redundante.",
      "Cuando ayer se te pasó marcar un hábito, ahora lo dice directamente en la tarjeta: \"Ayer te quedaste sin marcar\".",
      "Arreglado: cuentas creadas antes de que existiera la prueba de 7 días se habían quedado sin fecha de prueba, así que nunca veían el precio de $4.99/$42 al activar. Ahora todas tienen su ventana de prueba.",
      "La pantalla de Gestionar hábitos ahora usa el mismo estilo de tarjetas que la pantalla de Hoy.",
    ],
  },
  {
    version: "2.48.0",
    date: "2026-07-13",
    changes: [
      "Cada opción de respuesta de tipo elección en los módulos ahora explica qué significa elegirla, no solo el texto corto de la opción.",
      "La descripción de cada ejercicio también resalta términos del glosario, igual que el bloque de teoría.",
    ],
  },
  {
    version: "2.47.0",
    date: "2026-07-13",
    changes: [
      "Los módulos del curso ahora subrayan términos como \"hábito ancla\", \"Wheel of Life\" o \"Principio de Pareto\" la primera vez que aparecen — tócalos para ver una explicación corta sin salir de la lección.",
    ],
  },
  {
    version: "2.46.0",
    date: "2026-07-13",
    changes: [
      "Confirmaciones nuevas (cancelar suscripción, cambiar tu nombre, descargar una imagen) ahora avisan con un mensaje breve en pantalla en vez de quedarse silenciosas.",
      "El botón de pago con PayPal muestra un estado de carga en vez de un espacio vacío mientras conecta.",
      "El momento de activar tu plan tiene un pequeño gesto visual nuevo, y la página de planes suma insignias de confianza (pago seguro, precio fijo, cancela cuando quieras).",
      "Cambio interno: mejoras de accesibilidad — la racha de un hábito y el aviso de racha larga ahora se anuncian a lectores de pantalla.",
    ],
  },
  {
    version: "2.45.0",
    date: "2026-07-11",
    changes: [
      "Los correos de recuperación de contraseña y recordatorio diario tienen diseño nuevo: tarjeta con el mismo look de la app en vez de texto suelto sobre fondo plano.",
    ],
  },
  {
    version: "2.44.0",
    date: "2026-07-11",
    changes: [
      "Cuando terminas tus 30 días completos sin que el ciclo se reinicie, ahora hay un momento real para reconocerlo — antes solo existía el aviso para cuando el ciclo se reinicia.",
      "Cambio interno: se limpió una advertencia de conexión a la base de datos que salía en cada arranque en producción.",
    ],
  },
  {
    version: "2.43.0",
    date: "2026-07-11",
    changes: [
      "Cambio interno: índices nuevos en la base de datos para que el tablero, el leaderboard y el historial de hábitos respondan más rápido a medida que crece la cantidad de usuarios.",
      "Más límites de intentos (cambiar tu nombre, borrar tu cuenta, marcar un hábito desde una notificación) para frenar abuso.",
      "Cambio interno: páginas internas (tablero, hábitos, Wheel of Life, módulos, cuenta, leaderboard) marcadas para que buscadores no las indexen — son privadas.",
      "Login y registro ahora tienen su propio título al compartir el link o verlo en una pestaña.",
    ],
  },
  {
    version: "2.42.0",
    date: "2026-07-11",
    changes: [
      "Notificaciones push: activalas desde Mi cuenta y recibe el recordatorio diario en tu dispositivo, no solo por email.",
      "El recordatorio push de tu hábito ancla trae un botón \"Marcar hecho\" — lo marcas sin abrir la app.",
    ],
  },
  {
    version: "2.41.0",
    date: "2026-07-11",
    changes: [
      "Cambio interno: se agregó una suite de tests automáticos que recorre los flujos reales de la app (registro, onboarding, el bloqueo del primer hábito) en cada cambio, para agarrar roturas antes de que lleguen a producción.",
    ],
  },
  {
    version: "2.40.0",
    date: "2026-07-11",
    changes: [
      "La ilustración del hábito ancla (Módulo 5) ahora se ve como lo que es: una cascada real, paso a paso, en vez de tres cajas sueltas alrededor de un ancla.",
    ],
  },
  {
    version: "2.39.0",
    date: "2026-07-11",
    changes: [
      "Al crear tu cuenta ya no te pedimos escribir tu email y contraseña otra vez en la pantalla de inicio de sesión — quedas adentro directo.",
      "Arreglado un error real de producción: una sesión de una cuenta borrada podía tronar la app en vez de mandarte a iniciar sesión de nuevo.",
      "Los ejercicios del curso llevan bien el signo de apertura en sus preguntas (¿Cuál sería?, en vez de Cual sería?) en los casos donde faltaba.",
      "El email de recordatorio diario ya no dice la regla vieja de \"no fallar dos días seguidos\" — ahora coincide con la regla real de 2 fallos por ciclo.",
    ],
  },
  {
    version: "2.38.0",
    date: "2026-07-10",
    changes: [
      "Cuando el ciclo se reinicia, en vez de un aviso rojo de alarma ahora hay un momento real de reencuentro: qué pasó, qué conservas, y un botón para retomar hoy.",
      "Arreglado: el tablero mostraba los puntos totalmente reiniciados justo después de un reset, en vez de la mitad que sí se conserva.",
    ],
  },
  {
    version: "2.37.0",
    date: "2026-07-10",
    changes: [
      "Nav móvil rediseñado: barra inferior fija con Hoy, Módulos, Hábitos y Wheel of Life a un toque, en vez del menú hamburguesa de antes.",
      "\"Hábitos\" ahora tiene su propio link en el menú — antes solo se llegaba ahí desde el tablero.",
    ],
  },
  {
    version: "2.36.0",
    date: "2026-07-10",
    changes: [
      "Accesibilidad: navegar con teclado ahora muestra un anillo de foco visible en toda la app, y la sección activa del menú se marca correctamente para lectores de pantalla.",
    ],
  },
  {
    version: "2.35.0",
    date: "2026-07-10",
    changes: [
      "La página de Wheel of Life carga mucho más rápido: reemplazamos la librería de gráficos por una versión propia y liviana, sin cambiar cómo se ve ni cómo funciona.",
    ],
  },
  {
    version: "2.34.0",
    date: "2026-07-10",
    changes: [
      "Wheel of Life: cada área ahora explica qué mide, con un ejemplo (ej. Salud Física, Finanzas), tanto en la medición inicial como en las siguientes.",
      "Antes de guardar cualquier medición del Wheel of Life, ahora se te avisa que no se podrá editar después y se te pide confirmar.",
      "Footer nuevo en la landing: marca, contacto, Términos, Privacidad y aviso legal — antes solo había dos links sueltos.",
    ],
  },
  {
    version: "2.33.0",
    date: "2026-07-10",
    changes: [
      "Módulos, Hábitos y Wheel of Life ahora se nombran como lo que son — Aprendizaje, Acción y Control (1, 2 y 3 de 3) — directo en el encabezado de cada página, para que el sistema se entienda sin depender solo del tour inicial.",
    ],
  },
  {
    version: "2.32.0",
    date: "2026-07-10",
    changes: [
      "\"Lo que sigue\" al final de cada módulo ahora es una tarjeta que te dice el módulo siguiente por nombre, no solo una línea de texto.",
      "El testimonio de Jay en la landing explica qué es el Wheel of Life la primera vez que lo menciona, para que no tengas que adivinar.",
    ],
  },
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
