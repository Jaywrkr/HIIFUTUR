export type ExerciseField = {
  id: string;
  label: string;
  type: "textarea" | "text" | "scale" | "choice";
  placeholder?: string;
  options?: { value: string; label: string; hint: string }[];
};

export type CoursePhase = {
  id: string;
  title: string;
  description: string;
};

/** Key of the creative illustration that teaches this module's core idea. */
export type ConceptKey =
  | "willpower-battery"
  | "pareto-8020"
  | "goal-vs-system"
  | "never-twice"
  | "anchor-cascade"
  | "identity-votes"
  | "friction-meter"
  | "two-stories"
  | "habit-chain"
  | "compass"
  | "mantra-collection";

/** Surfaces one of the user's OWN prior exercise answers inside a later
 * module, so the course visibly builds on what they already wrote. */
export type ModuleCallback = {
  moduleId: string;
  fieldId: string;
  label: string;
};

export type CourseModule = {
  id: string;
  phaseId: string;
  order: number;
  title: string;
  /** Fragmento de la historia real de Jay (3 -> 9 en el Radar de Vida, 8 meses). */
  narrative: string;
  /** Una de las MANTRAS, la que más resuena con este módulo. */
  mantra: string;
  theory: string[];
  /** Ilustración creativa que explica visualmente la idea clave del módulo. */
  concept: ConceptKey;
  /** Puente desde lo anterior: "vienes de aquí". Ausente en el módulo 1. */
  recap?: string;
  /** Puente hacia adelante: "esto es lo que sigue". */
  leadsTo: string;
  /** Respuestas propias de módulos anteriores que este módulo retoma. */
  callbacks?: ModuleCallback[];
  exerciseTitle: string;
  exerciseDescription: string;
  fields: ExerciseField[];
};

export const PHASES: CoursePhase[] = [
  {
    id: "fundamentos",
    title: "Fase 1 — Fundamentos",
    description: "Por qué fallabas antes, y la lógica detrás del sistema que vas a construir.",
  },
  {
    id: "habito-ancla",
    title: "Fase 2 — El hábito ancla",
    description: "El único hábito que, si lo sostienes, jala a todos los demás sin esfuerzo extra.",
  },
  {
    id: "sostenibilidad",
    title: "Fase 3 — Sostenibilidad",
    description: "Identidad, entorno y como manejar la recaída que vas a tener sí o sí.",
  },
  {
    id: "expansion",
    title: "Fase 4 — Expansión",
    description: "Apilar hábitos, leer tu propio progreso, y quedarte con algo tuyo al final.",
  },
];

export const MODULES: CourseModule[] = [
  // ---------- FASE 1: FUNDAMENTOS ----------
  {
    id: "por-que-fallas",
    phaseId: "fundamentos",
    order: 1,
    concept: "willpower-battery",
    leadsTo:
      "Con tu causa raíz nombrada y tu hábito ancla ya elegido, el módulo 2 te muestra dónde vas a concentrar tu energía de aquí en adelante: tu 20% crítico.",
    title: "Por qué fallas (y no es tu culpa)",
    narrative:
      "Antes de todo esto, mi vida promediaba un 3. No porque me pasaran cosas horribles, sino porque llevaba años en piloto automático, prometiéndome empezar 'el lunes que viene'. El primer cambio real no fue una rutina nueva — fue aceptar que el problema nunca fue mi disciplina.",
    mantra: "El crecimiento real es cuando te cansas de tus mierdas.",
    theory: [
      "La fuerza de voluntad no es un rasgo de carácter. Es un recurso limitado que se agota durante el día, como una batería que se descarga con cada decisión, cada distracción, cada 'aguanta un poco más'.",
      "Cada vez que intentas sostener un cambio a base de motivación, estás apostando a que la batería aguante todos los días, para siempre. Casi nunca aguanta. Y cuando falla, la conclusión automática es 'no tengo disciplina', cuando en realidad nadie la tiene, todo el tiempo.",
      "No fallaste por débil. Fallaste porque diseñaste un plan que dependia de sentirte con ganas. Un plan bueno funciona incluso el día que te sientes pesimo — porque no depende de eso.",
      "Hay una versión cómoda de esta historia que dice 'la vida no es justa' y se queda ahí, usando la injusticia como excusa. Y es cierto: la vida no es justa. Pero quedarte ahí es victimizarte, y victimizarte te roba el poder que sí tienes sobre lo que haces hoy.",
      "El objetivo de este curso no es subir tu motivación. Es construir un sistema tan pequeño que funcione incluso en tus peores días — para que dejes de necesitar sentirte bien para actuar bien.",
      "Por eso este módulo no termina solo en teoría: vas a nombrar tu patrón, y vas a arrancar HOY con un hábito — tu hábito ancla. No busques el más importante ni el perfecto. Busca el más pequeño que puedas sostener incluso en tu peor día: estudiar 5 minutos, tomar un vaso de agua, escribir una línea. El resto del curso te ayuda a afinarlo, pero primero necesitas uno corriendo.",
    ],
    exerciseTitle: "Nombra tu patrón y elige tu hábito ancla",
    exerciseDescription:
      "Sin juzgarte: identifica la causa raíz de tus fracasos anteriores, y elige — sin darle mil vueltas — el hábito más pequeño posible para empezar hoy.",
    fields: [
      {
        id: "causa_raiz",
        label: "De tus intentos pasados, si tuvieras que elegir UNA causa raíz, ¿cuál sería?",
        type: "choice",
        options: [
          {
            value: "empezaba_grande",
            label: "Empezaba demasiado grande",
            hint: "Arrancabas con una versión ambiciosa (1 hora en el gym, dieta estricta) en vez de la más pequeña posible.",
          },
          {
            value: "sin_plan_fallo",
            label: "No tenia plan para cuando fallara",
            hint: "El primer día que se te pasó, no sabías qué hacer — y esa duda fue lo que rompió la racha.",
          },
          {
            value: "dependia_motivacion",
            label: "Dependia de sentirme motivado",
            hint: "Funcionaba solo los días que tenías ganas — y esos días no alcanzan para sostener nada a largo plazo.",
          },
          {
            value: "sin_tiempo_real",
            label: "Nunca tuve tiempo real asignado",
            hint: "El hábito vivía en 'cuando pueda' en vez de tener un momento fijo del día — así es fácil que nunca llegue.",
          },
          {
            value: "comparación",
            label: "Me comparaba con el ritmo de otros",
            hint: "Medías tu progreso contra el de alguien más, en vez de contra tu propio punto de partida.",
          },
        ],
      },
      {
        id: "habito_1",
        label: "Tu hábito ancla: nombre + disparador",
        type: "text",
        placeholder: "Ej: Después de despertar, estudio 5 minutos",
      },
      {
        id: "tamano_habito",
        label: "Tu hábito ancla, tan pequeño que...",
        type: "choice",
        options: [
          {
            value: "vergonzoso",
            label: "Me da un poco de vergüenza lo pequeño que es (perfecto)",
            hint: "Esa vergüenza es la señal correcta: significa que es tan pequeño que es casi imposible fallarlo.",
          },
          {
            value: "reto_real",
            label: "Se siente como un reto real (hazlo más chico)",
            hint: "Si todavía se siente como un esfuerzo, redúcelo más — el objetivo es que no requiera fuerza de voluntad.",
          },
          {
            value: "ya_lo_hago",
            label: "Ya lo hago casi siempre (bien, pero sube el nivel)",
            hint: "Si ya es automático, puedes subirle un poco de dificultad sin romper la constancia.",
          },
        ],
      },
    ],
  },
  {
    id: "pareto-en-tu-vida",
    phaseId: "fundamentos",
    order: 2,
    concept: "pareto-8020",
    recap:
      "En el módulo 1 nombraste tu causa raíz y arrancaste tu hábito ancla. Ahora, en vez de pelear en diez frentes a la vez, vas a encontrar el único que realmente mueve la aguja de aquí en adelante.",
    leadsTo:
      "Con tu 20% nombrado, el módulo 3 lo convierte en un sistema diario tan pequeño que sea imposible fallar.",
    callbacks: [
      { moduleId: "por-que-fallas", fieldId: "causa_raiz", label: "Tu causa raíz del módulo 1" },
    ],
    title: "El Principio de Pareto aplicado a tu vida",
    narrative:
      "Cuando encontre el Principio de Pareto, deje de intentar arreglar los diez frentes de mi vida al mismo tiempo. Elegi uno. En el momento no se sintió como un gran cambio. Visto desde ahora, fue el punto de quiebre real.",
    mantra:
      "Estoy haciendo genuinamente lo mejor que puedo y aún me pregunto: como puedo hacer más? Esa es la diferencia.",
    theory: [
      "El Principio de Pareto dice que el 80% de tus resultados viene del 20% de tus acciones. No es una ley física exacta, es una observación: no todas las acciones pesan igual.",
      "La mayoría de lo que haces en un día normal es ruido — reacciones, pendientes menores, cosas que se sienten productivas pero no mueven nada. Un puñado de acciones concentran el cambio real.",
      "Esto tiene una versión incómoda: la mayoría de la gente usa el 'aprender' y el 'planear' como forma de sentirse bien por progresar, sin progresar realmente. Leer sobre hábitos no es lo mismo que tener uno. Si no aplicas lo que aprendes a algo concreto, estás perdido en el mismo lugar, con más información.",
      "Tu trabajo aquí no es hacer más cosas. Es encontrar cual es tu 20% — la acción que, sostenida, jala a las demás — y protegerla con tu vida, incluso cuando todo lo demás se sienta urgente.",
      "Piensa en el área que elegiste al empezar el curso. De todo lo que podrías hacer ahí, que 2 o 3 acciones, si las sostuvieras, moverían todo lo demás casi solas?",
      "No necesitas la lista perfecta. Necesitas UNA acción que te atrevas a nombrar como la más importante, aunque no estes 100% seguro.",
    ],
    exerciseTitle: "Encuentra tu 20% crítico",
    exerciseDescription: "Lista posibles acciones y después senala cual es la que más impacto tendría.",
    fields: [
      {
        id: "acciones_posibles",
        label: "Lista 4-5 acciones que podrías tomar en tu área elegida",
        type: "textarea",
        placeholder: "Ej: dormir 7h, caminar 20 min, leer 10 páginas, ahorrar 5%, escribir 1 página...",
      },
      {
        id: "accion_critica",
        label: "De esa lista, ¿cuál es LA acción que más 80% generaría?",
        type: "text",
        placeholder: "Se específico. Una sola acción.",
      },
      {
        id: "confianza_accion",
        label: "¿Qué tan seguro estás de que esta es tu acción del 20%?",
        type: "scale",
      },
    ],
  },
  {
    id: "disena-tu-sistema",
    phaseId: "fundamentos",
    order: 3,
    concept: "goal-vs-system",
    recap:
      "Ya tienes tu hábito ancla corriendo (módulo 1) y tu 20% crítico nombrado (módulo 2). Aquí afinas el sistema: el disparador, el tamaño, y qué sigue después de este.",
    leadsTo:
      "Con tu sistema afinado, el módulo 4 te blinda para el momento donde casi todos abandonan: las primeras 72 horas.",
    callbacks: [
      { moduleId: "por-que-fallas", fieldId: "habito_1", label: "Tu hábito ancla" },
      { moduleId: "pareto-en-tu-vida", fieldId: "accion_critica", label: "Tu 20% crítico" },
    ],
    title: "Diseña tu sistema (no tu meta)",
    narrative:
      "Mi primer 'hábito' fue tan pequeño que me daba un poco de vergüenza contarlo. Funciono precisamente por eso: era imposible fallarlo, incluso en los días donde todo lo demás se caia.",
    mantra: "Tienes una meta? Debes tener solo un plan. Nada de plan B.",
    theory: [
      "Una meta es un punto en el futuro: 'bajar 10kg', 'ahorrar 50 mil'. Es vaga sobre el como, y no te dice que hacer un martes cualquiera a las 7am.",
      "Un sistema es lo que haces todos los días, sin importar la meta: 'caminar 15 minutos después de comer'. Las metas son buenas para apuntar. Los sistemas son los que realmente cambian tu vida.",
      "Productividad no es disciplina. Es hacer más de lo que te hace sentir bien, con menos estrés y más energía — no más cosas en una lista. Un sistema bien diseñado deberia sentirse así, no como una carga extra.",
      "Tu sistema debe ser tan pequeño que sea ridículo fallar. Si dudas si es 'suficiente', hazlo más pequeño. Puedes crecerlo después; no puedes crecer algo que abandonaste.",
      "Una trampa común: tener un plan A y un plan B 'por si acaso'. El plan B es, casi siempre, el permiso que te das de antemano para no cumplir el plan A. Un solo plan, sin salida de emergencia, te obliga a resolver en el momento en vez de escapar.",
      "No se trata de encontrar lo que amas hacer. Se trata de encontrar aquello que hace que el sacrificio de sostenerlo valga la pena — y disenar el sistema alrededor de eso.",
    ],
    exerciseTitle: "Afina tu hábito ancla",
    exerciseDescription:
      "Ya llevas unos días ejecutando. Revisa el disparador, confirma el tamaño, y deja anotados los próximos hábitos para más adelante — vas a poder activar hasta 5, uno a la vez.",
    fields: [
      {
        id: "disparador_confirmado",
        label: "¿Cuál es el disparador exacto de tu hábito ancla hoy?",
        type: "text",
        placeholder: "Ej: Después de despertar, antes de revisar el celular",
      },
      {
        id: "tamano_actual",
        label: "Unos días después, tu hábito ancla se siente...",
        type: "choice",
        options: [
          {
            value: "perfecto_chico",
            label: "Vergonzosamente pequeño (perfecto, no lo cambies)",
            hint: "Está en el tamaño correcto. No lo agrandes solo porque se siente 'demasiado fácil' — esa facilidad es la que lo sostiene.",
          },
          {
            value: "aun_reto",
            label: "Todavía un reto real (achícalo más)",
            hint: "Si algunos días te cuesta empezarlo, sigue siendo grande. Redúcelo hasta que ya no lo dudes.",
          },
          {
            value: "ya_automatico",
            label: "Casi automático (puedes subir el nivel)",
            hint: "Ya no gasta fuerza de voluntad — es el momento de hacerlo un poco más grande, sin perder la constancia.",
          },
        ],
      },
      {
        id: "habitos_futuros",
        label: "¿Qué 1-2 hábitos podrías activar más adelante, cuando este se sienta automático?",
        type: "textarea",
        placeholder: "Ej: después, escribir 1 línea en mi diario; más adelante, ahorrar 20 pesos...",
      },
    ],
  },
  {
    id: "primeras-72-horas",
    phaseId: "fundamentos",
    order: 4,
    concept: "never-twice",
    recap:
      "Con tu hábito ancla en marcha y tu sistema afinado, ahora proteges el arranque — porque el 80% de la gente abandona en los primeros 3 días.",
    leadsTo:
      "Superadas las 72 horas, la Fase 2 vuelve sobre el hábito que jala a todos los demás sin esfuerzo extra: tu ancla.",
    callbacks: [
      { moduleId: "por-que-fallas", fieldId: "habito_1", label: "Tu hábito ancla" },
    ],
    title: "Las primeras 72 horas",
    narrative:
      "Falle al tercer día. Estuve a punto de tirar todo por la borda. La única diferencia esta vez fue que ya tenia decidido, de antemano, exactamente que iba a hacer cuando fallara.",
    mantra: "Te sientes mal porque sabes lo que se supone que debes hacer y no lo estás haciendo.",
    theory: [
      "El 80% de la gente abandona un hábito nuevo en las primeras 72 horas. No es porque el hábito sea difícil — la mayoría son minusculos a propósito. Es porque no tenian un plan para cuando fallaran una vez.",
      "Fallar un día no rompe el sistema. Fallar dos días seguidos si empieza a romperlo, porque ahí es donde 'una excepción' se convierte en 'así es como soy ahora'.",
      "Mucha gente pide consejo, lee más, planea más — como forma de posponer el momento incomodo de simplemente intentarlo y fallar. El miedo a la prueba y error disfrazado de 'preparación'.",
      "Tu única regla real: nunca fallar dos veces seguidas. Si fallaste hoy, mañana es innegociable — la versión más pequeña posible del hábito, sin excusas, sin esperar sentirte listo.",
      "Esto no es sobre ser perfecto. Es sobre no dejar que un mal día se convierta en una mala semana, y una mala semana en 'lo volvi a dejar'.",
      "Decide ahora, con la cabeza fría, que vas a hacer el día que falles. Vas a fallar. La pregunta no es si, sino que vas a hacer después.",
    ],
    exerciseTitle: "Tu plan para cuando falles",
    exerciseDescription: "Porque vas a fallar en algún momento. Decide ahora, con calma, que vas a hacer.",
    fields: [
      {
        id: "plan_de_fallo",
        label: "Si fallas un día, ¿qué harás exactamente al día siguiente?",
        type: "textarea",
        placeholder: "Ej: Hago la versión más pequeña del hábito, sin excusas, sin esperar sentirme listo.",
      },
      {
        id: "compromiso",
        label: "Escribe tu compromiso en una frase",
        type: "text",
        placeholder: "Ej: No busco perfección, busco continuidad.",
      },
      {
        id: "regla_de_fallo",
        label: "Cuando falles, ¿qué vas a hacer?",
        type: "choice",
        options: [
          {
            value: "version_minima",
            label: "La versión más pequeña, sin excusas",
            hint: "Aunque sea un minuto o una repetición — lo importante es no dejarlo en cero dos días seguidos.",
          },
          {
            value: "saltar_sin_culpa",
            label: "Saltarlo y retomar mañana sin culpa",
            hint: "Aceptas que hoy no se dio, sin castigarte, y vuelves mañana como si nada — sin convertirlo en una racha de fallos.",
          },
          {
            value: "avisar",
            label: "Avisarle a alguien que me haga responsable",
            hint: "Le cuentas a otra persona que fallaste, para que la vergüenza social te empuje a no repetirlo al día siguiente.",
          },
        ],
      },
    ],
  },

  // ---------- FASE 2: HÁBITO ANCLA ----------
  {
    id: "habito-ancla",
    phaseId: "habito-ancla",
    order: 5,
    concept: "anchor-cascade",
    recap:
      "Sostienes tu hábito ancla desde el módulo 1 y tienes un plan para cuando falles. Ahora, con días de ejecución real encima, confirmas si de verdad es tu ancla — o si hay una mejor candidata.",
    leadsTo:
      "Con tu ancla clara, la Fase 3 la vuelve sostenible de verdad: identidad, entorno y las recaídas que vas a tener sí o sí.",
    callbacks: [
      { moduleId: "por-que-fallas", fieldId: "habito_1", label: "Tu hábito ancla original (módulo 1)" },
      { moduleId: "pareto-en-tu-vida", fieldId: "accion_critica", label: "Tu 20% crítico" },
    ],
    title: "Encuentra tu hábito ancla",
    narrative:
      "En el mes 3 me di cuenta de que un solo hábito — dormir a una hora fija — estaba arrastrando a todos los demás sin que yo hiciera nada extra. Ese fue mi hábito ancla, y no lo elegi a propósito: lo descubri mirando hacia atrás.",
    mantra: "Nadie piensa en el ahora como el futuro pasado.",
    theory: [
      "En el módulo 1 elegiste tu hábito ancla rápido, solo para arrancar — por velocidad, no por evidencia. Este módulo es distinto: ahora ya tienes días reales ejecutando, y eso te deja ver, con datos, si ese hábito de verdad es tu ancla.",
      "James Clear, en Hábitos Atómicos, habla de los 'keystone habits': hábitos que no solo mejoran un área, sino que jalan a varias otras sin que tengas que trabajar en ellas directamente.",
      "No todos los hábitos pesan igual. Dormir bien mejora tu energía, tu energía mejora tu entrenamiento, tu entrenamiento mejora tu animo, tu animo mejora tus relaciones. Un solo cambio, efectos en cascada.",
      "Tu hábito ancla no siempre es el más obvio ni el que más te emociona. A veces es el más aburrido: dormir, tomar agua, ordenar tu espacio. Lo reconoces no por lo que es, sino por lo que arrastra.",
      "Piensa en 'aguas arriba' y 'aguas abajo'. Casi todos atacamos los sintomas aguas abajo: 'quiero más energía' (sintoma), en vez de resolver 'duermo mal' (causa aguas arriba). Nadie piensa en el ahora como el futuro pasado — lo que decides hoy, aguas arriba, es lo que tu yo futuro va a mirar hacia atrás como el punto de quiebre.",
      "Este módulo no te pide un hábito nuevo. Te pide mirar los que ya escribiste (o los que ya intentaste) y encontrar cual de ellos, si lo sostienes, jalaría a los demás sin que tengas que esforzarte en cada uno por separado.",
      "Si tu hábito activo hoy no es tu ancla, no pasa nada — puedes seguir sosteniendolo y usar este ejercicio para elegir con más intención el segundo o tercero.",
    ],
    exerciseTitle: "Identifica tu hábito ancla",
    exerciseDescription:
      "No es el hábito más vistoso. Es el que, al mejorar, jala a los demás sin que hagas nada extra.",
    fields: [
      {
        id: "areas_relacionadas",
        label: "¿Qué áreas de tu vida sientes que están conectadas entre sí (si una falla, las demás también)?",
        type: "textarea",
        placeholder: "Ej: cuando duermo mal, también como peor y soy más cortante con mi pareja...",
      },
      {
        id: "habito_ancla",
        label: "¿Qué UNA acción, si mejora, jalaría a todas las demás?",
        type: "text",
        placeholder: "Ej: dormir a la misma hora todos los días",
      },
      {
        id: "tipo_ancla",
        label: "Tu hábito ancla toca principalmente...",
        type: "choice",
        options: [
          {
            value: "sueño",
            label: "Sueño / descanso",
            hint: "Ej: dormir a una hora fija — cuando duermes bien, casi todo lo demás cuesta menos.",
          },
          {
            value: "movimiento",
            label: "Movimiento / ejercicio",
            hint: "Ej: caminar o entrenar poco pero seguido — el movimiento diario suele mejorar ánimo y energía por sí solo.",
          },
          {
            value: "alimentación",
            label: "Alimentación",
            hint: "Ej: tomar agua al despertar, o una comida fija — cambios pequeños de comida que arrastran energía y ánimo.",
          },
          {
            value: "entorno",
            label: "Entorno / organización",
            hint: "Ej: ordenar tu espacio o tu celular — reduce la fricción de todos tus demás hábitos sin tocarlos directamente.",
          },
          {
            value: "mentalidad",
            label: "Mentalidad / reflexión",
            hint: "Ej: escribir o meditar unos minutos — cambia cómo interpretas el resto de tu día.",
          },
        ],
      },
      {
        id: "control_actual",
        label: "¿Qué tanto control tienes hoy sobre ese hábito ancla?",
        type: "scale",
      },
    ],
  },

  // ---------- FASE 3: SOSTENIBILIDAD ----------
  {
    id: "identidad-vs-resultado",
    phaseId: "sostenibilidad",
    order: 6,
    concept: "identity-votes",
    recap:
      "Tienes tu hábito ancla. Ahora lo conviertes en identidad — porque un resultado se pierde, pero 'soy alguien que hace esto' sostiene el hábito cuando el resultado todavía no llega.",
    leadsTo:
      "Con la identidad clara, el módulo 7 diseña tu entorno para que actuar como esa persona cueste menos fuerza de voluntad.",
    callbacks: [
      { moduleId: "habito-ancla", fieldId: "habito_ancla", label: "Tu hábito ancla" },
    ],
    title: "Identidad vs. resultado",
    narrative:
      "Deje de decirme 'quiero ser alguien que hace ejercicio' y empece a decir 'soy alguien que entrena'. El lenguaje cambió antes que el resultado — y fue el lenguaje el que sostuvo el cambio en los días difíciles.",
    mantra: "Piensa que quieres que digan en tu funeral. No te importara el dinero, sino la persona.",
    theory: [
      "Hay dos formas de perseguir un cambio: por resultado ('quiero pesar X') o por identidad ('soy alguien que cuida su cuerpo'). Los resultados son temporales. La identidad sostiene el comportamiento incluso cuando el resultado tarda.",
      "Cada vez que completas tu hábito, no solo tachas una casilla — estás votando por el tipo de persona que quieres ser. Un check no es 'ya lo hice hoy', es 'soy alguien que hace esto'.",
      "Esto tiene un límite importante: identidad no es lo mismo que autoengano. No se trata de decirte cosas bonitas sin evidencia. Amate a ti mismo, pero también se autocritico — la identidad se construye con evidencia real, por pequeña que sea, no con frases motivacionales vacias.",
      "Un ejercicio que ayuda: imagina tu funeral. A nadie le va a importar cuanto dinero tenias. Va a importar quien fuiste con la gente, que sostuviste, en que te convertiste con el tiempo. Esa es la versión de ti que este sistema esta construyendo, un día a la vez.",
      "Cuando falles un día, la pregunta útil no es '¿rompi mi racha?'. Es '¿esto es evidencia de quien soy, o es una excepción de un mal día?'. Una excepción no cambia una identidad. Un patron si.",
    ],
    exerciseTitle: "Redefine quien eres, no solo que haces",
    exerciseDescription: "Vas a escribir tu identidad en construcción, con evidencia real, no solo con intención.",
    fields: [
      {
        id: "frase_identidad",
        label: "Termina la frase: 'Soy alguien que ____'",
        type: "text",
        placeholder: "Ej: soy alguien que entrena, aunque sea poco, casi todos los días",
      },
      {
        id: "evidencia_identidad",
        label: "¿Qué evidencia (por pequeña que sea) tienes de que ya eres esa persona?",
        type: "textarea",
        placeholder: "Ej: llevo 12 días haciendo mi hábito mínimo, sin fallar dos seguidos...",
      },
      {
        id: "actuaste_como",
        label: "Hoy, ¿actuaste más como la persona que quieres ser o como la de antes?",
        type: "choice",
        options: [
          {
            value: "nueva",
            label: "Como la nueva versión de mí",
            hint: "Hoy tus acciones fueron evidencia real de la identidad que estás construyendo.",
          },
          {
            value: "antes",
            label: "Como la versión de antes",
            hint: "No pasa nada — es un dato, no una sentencia. Mañana es otra oportunidad de votar distinto.",
          },
          {
            value: "mitad",
            label: "Mitad y mitad",
            hint: "Normal en días de transición — lo que importa es que la balanza se vaya moviendo con el tiempo.",
          },
        ],
      },
    ],
  },
  {
    id: "disena-tu-entorno",
    phaseId: "sostenibilidad",
    order: 7,
    concept: "friction-meter",
    recap:
      "Ya sabes quién quieres ser. Ahora quitas del camino la fricción que te obliga a gastar fuerza de voluntad para actuar como esa persona.",
    leadsTo:
      "Con el entorno a tu favor, el módulo 8 te prepara para lo inevitable: la recaída, y cómo salir de ella sin drama.",
    callbacks: [
      { moduleId: "habito-ancla", fieldId: "habito_ancla", label: "El hábito que vas a proteger" },
    ],
    title: "Diseña tu entorno",
    narrative:
      "Cambié mi cuarto, mi teléfono y mi cocina antes de cambiarme a mi mismo. Rediseñar el espacio fue más efectivo que cualquier cantidad de fuerza de voluntad que intente reunir antes.",
    mantra: "No esperes a ser más senior para fijarte más en los detalles.",
    theory: [
      "La fuerza de voluntad pierde casi siempre contra un entorno mal diseñado. Si el celular está junto a la cama, lo vas a revisar. Si la comida chatarra esta a la vista, la vas a comer. El ambiente gana más seguido de lo que creemos.",
      "Disenar tu entorno es reducir la fricción para lo que quieres hacer, y aumentarla para lo que no. Deja la ropa de entrenar lista la noche anterior. Guarda el control remoto lejos. Son cambios pequeños con efecto desproporcionado.",
      "Esto conecta directo con los detalles: no esperes a 'tener más disciplina' para cuidar el entorno. Los detalles se cuidan ahora, en la versión de ti que existe hoy, no en una versión futura más madura que quiza nunca llegue si no empiezas por lo pequeño.",
      "No necesitas rediseñar tu vida entera. Necesitas identificar UNA fricción real que está saboteando tu hábito actual, y UN cambio de entorno, específico y barato, que la reduzca.",
      "Piensa también en como hacerlo más divertido. Un sistema sostenible no tiene que sentirse como una obligación gris — el entorno también puede disenarse para que el hábito se sienta bien, no solo correcto.",
    ],
    exerciseTitle: "Reduce la fricción de tu entorno",
    exerciseDescription: "Un cambio de entorno, específico y realista, vale más que diez propositos de fuerza de voluntad.",
    fields: [
      {
        id: "friccion_actual",
        label: "¿Qué fricción en tu entorno hace más difícil tu hábito hoy?",
        type: "textarea",
        placeholder: "Ej: la ropa de entrenar esta guardada hasta arriba del clóset, tardo 10 min en encontrarla",
      },
      {
        id: "cambio_entorno",
        label: "¿Qué UN cambio de entorno reduciría esa fricción?",
        type: "textarea",
        placeholder: "Ej: dejar la ropa de entrenar sobre la silla, ya lista, la noche anterior",
      },
      {
        id: "costo_cambio",
        label: "Ese cambio que propones es...",
        type: "choice",
        options: [
          {
            value: "gratis",
            label: "Gratis, lo puedo hacer hoy mismo",
            hint: "Sin excusa para posponerlo — hazlo antes de terminar este módulo si puedes.",
          },
          {
            value: "barato",
            label: "Cuesta poco (menos de lo que gastas en un antojo)",
            hint: "Vale la pena comprarlo esta semana — el costo es mínimo comparado con lo que reduce la fricción.",
          },
          {
            value: "ahorrar",
            label: "Requiere ahorrar o planear un poco más",
            hint: "Mientras tanto, busca una versión gratis o temporal del mismo cambio para no quedarte esperando.",
          },
        ],
      },
    ],
  },
  {
    id: "maneja-recaidas",
    phaseId: "sostenibilidad",
    order: 8,
    concept: "two-stories",
    recap:
      "Identidad y entorno listos. Ahora llega el examen real del sistema: qué haces el día — o el mes — en que falles. No si vas a fallar, sino qué historia te cuentas después.",
    leadsTo:
      "Sabiendo recuperarte sin drama, la Fase 4 expande: apilar hábitos, leer tu propio progreso y quedarte con algo tuyo.",
    callbacks: [
      { moduleId: "primeras-72-horas", fieldId: "plan_de_fallo", label: "Tu plan para cuando falles (módulo 4)" },
    ],
    title: "Maneja las recaidas",
    narrative:
      "Hubo un mes completo, el quinto, donde no cumpli casi nada. Lo que me saco de ahí no fue la motivación — fue negarme a tratarme como una victima de mi propio mal mes.",
    mantra:
      "La vida no es justa. Pero llorar no te hace fuerte. Victimizarte te roba poder. Yo no quiero que me tengan lastima, quiero que se levanten al verme. Que digan: 'si el pudo, yo también'. Eso es más útil que cualquier excusa.",
    theory: [
      "Una recaída no es el fin del sistema. Es el momento donde el sistema realmente se pone a prueba — cualquiera sostiene un hábito cuando todo va bien.",
      "El patron peligroso no es fallar. Es la historia que te cuentas después de fallar: 'total, ya la regué', 'no tengo lo que se necesita', 'la vida no me ha dado las mismas oportunidades'. Esa historia, no el fallo en si, es lo que te saca del sistema por semanas.",
      "Es cierto que la vida no es justa. Algunas personas parten con más ventajas que otras. Pero quedarte en esa verdad como excusa es un lujo caro: te roba exactamente el poder que si tienes sobre lo que haces hoy.",
      "La diferencia entre alguien que se recupera rápido y alguien que abandona no es el tamaño de la caída. Es que el primero ya tenia, de antemano, una regla clara para la próxima vez que fallara — y la uso sin drama.",
      "No se trata de fingir que no duele. Se trata de que, en vez de pedir lastima, prefieras que la gente te vea levantarte y piense 'si el pudo, yo también'. Eso ayuda más a otros — y a ti — que cualquier excusa bien armada.",
    ],
    exerciseTitle: "Reescribe tu última recaída",
    exerciseDescription: "Vas a mirar una recaída real (o una que temes que pase) y cambiar la historia que te cuentas sobre ella.",
    fields: [
      {
        id: "recaida_real",
        label: "Describe tu última recaída real (o una que temes que pase)",
        type: "textarea",
        placeholder: "Ej: deje de hacer mi hábito por 2 semanas después de un viaje de trabajo...",
      },
      {
        id: "pensamiento_justificacion",
        label: "¿Cuál fue (o sería) el pensamiento que usaste para justificarla?",
        type: "text",
        placeholder: "Ej: total ya perdi la racha, para que sigo...",
      },
      {
        id: "reescritura",
        label: "Reescribe ese pensamiento como lo haría alguien que no se victimiza",
        type: "textarea",
        placeholder: "Ej: perdi 2 semanas, no perdi el sistema. Hoy retomo la versión mínima, sin drama.",
      },
      {
        id: "regla_recaida",
        label: "Tu regla para la próxima vez",
        type: "choice",
        options: [
          {
            value: "no_2_seguidos",
            label: "Nunca fallar 2 días seguidos",
            hint: "Tu única regla no negociable: un día se perdona solo, dos seguidos ya es un patrón que hay que cortar.",
          },
          {
            value: "avisar_24h",
            label: "Avisarle a alguien en menos de 24h",
            hint: "Usas la vergüenza social como empuje — contarle a alguien te hace más difícil dejarlo pasar en silencio.",
          },
          {
            value: "version_mini_obligatoria",
            label: "Version mínima obligatoria al día siguiente",
            hint: "Sin negociar el tamaño: al día siguiente haces la versión más chica posible, pase lo que pase.",
          },
        ],
      },
    ],
  },

  // ---------- FASE 4: EXPANSION ----------
  {
    id: "apila-tus-habitos",
    phaseId: "expansion",
    order: 9,
    concept: "habit-chain",
    recap:
      "Tu ancla ya es estable y sabes recuperarte de una recaída. Ahora usas ese hábito automático como disparador del siguiente, sin gastar más fuerza de voluntad.",
    leadsTo:
      "Con tu cadena creciendo, el módulo 10 te enseña a leer, con datos y no con sensaciones, si de verdad está funcionando: tu Radar de Vida.",
    callbacks: [
      { moduleId: "habito-ancla", fieldId: "habito_ancla", label: "Tu ancla (primer eslabón)" },
    ],
    title: "Apila tus hábitos",
    narrative:
      "Para el mes 6 ya no sostenia un solo hábito. Sostenia cuatro, apilados uno sobre el otro, sin que se sintiera como más esfuerzo — porque cada uno uso al anterior como disparador.",
    mantra:
      "La mayoría de las personas utilizan el aprendizaje como una forma de sentirse bien por haber progresado cuando, en realidad, no están aprendiendo ni progresando. Si no tienes un proyecto, negocio o propósito para aplicar lo que aprendes, estás perdido.",
    theory: [
      "El habit stacking (apilamiento de hábitos) usa un hábito que ya sostienes como disparador automático para uno nuevo, más pequeño. 'Después de [hábito que ya hago], voy a [hábito nuevo]'.",
      "Esto funciona porque no dependes de recordar o de tener ganas — el hábito anterior, que ya es automático, dispara al siguiente sin que tengas que pensarlo.",
      "El error común aquí es apilar demasiado rápido, o apilar algo grande sobre un hábito que apenas es estable. Solo apila cuando el primero se sienta aburrido de tan automático — no antes.",
      "Este módulo, como todos los anteriores, no sirve de nada si se queda en teoría. Aplica esto a tu propia lista de hábitos (los que escribiste en el módulo 3) y conviertelos en una cadena real, no solo en una lista de buenas intenciones.",
    ],
    exerciseTitle: "Construye tu cadena de hábitos",
    exerciseDescription: "Usa tu hábito ya sostenido como disparador para el siguiente, en vez de depender de la memoria o las ganas.",
    fields: [
      {
        id: "cadena_habito",
        label: "Completa: 'Después de ____, voy a ____'",
        type: "text",
        placeholder: "Ej: Después de mis 5 sentadillas, tomo un vaso de agua",
      },
      {
        id: "futuros_apilados",
        label: "¿Qué otros 2 hábitos podrías apilar más adelante, cuando el actual se sienta automático?",
        type: "textarea",
        placeholder: "Ej: después de tomar el agua, escribo 1 linea de gratitud; después de eso, reviso mis finanzas 2 min...",
      },
    ],
  },
  {
    id: "wheel-of-life-brujula",
    phaseId: "expansion",
    order: 10,
    concept: "compass",
    recap:
      "Llevas semanas ejecutando y encadenando hábitos. Ahora usas tu Radar de Vida no como calificación, sino como brújula para decidir dónde apuntar el próximo mes.",
    leadsTo:
      "Solo queda el cierre del curso: quedarte con algo escrito por ti, para ti — tu mantra personal.",
    callbacks: [
      { moduleId: "pareto-en-tu-vida", fieldId: "accion_critica", label: "El 20% con el que empezaste" },
    ],
    title: "Tu Radar de Vida como brujula",
    narrative:
      "El mes 8 medi mi Radar de Vida y marco un 9. No llore de felicidad — senti, simplemente, que por fin el número coincidia con lo que ya sabia por dentro desde hacia semanas.",
    mantra: "Exito es tener cada día menos arrepentimientos.",
    theory: [
      "El Radar de Vida no es un examen que apruebas o repruebas. Es una brujula: te dice hacia donde te estás moviendo, no que tan 'bien' o 'mal' eres como persona.",
      "Cada medición mensual es una fotografia. Comparar la foto de este mes con la anterior te dice, con datos y no con sensaciones, si el sistema está funcionando o si es momento de ajustar el hábito ancla.",
      "Es fácil obsesionarse con el área que menos sube. Pero éxito real no es tener un 10 en todo — es tener, cada día, menos cosas de las que te arrepientes al acostarte. Esa es una métrica más honesta que cualquier promedio.",
      "Usa esta revisión para preguntarte qué área está compitiendo por el mismo tiempo y energía que tu hábito ancla, y decide con calma — no con culpa — qué vas a hacer al respecto el próximo mes.",
    ],
    exerciseTitle: "Lee tu propio progreso",
    exerciseDescription: "Antes de tu próxima medición, reflexiona sobre lo que ya sabes que va a mostrar.",
    fields: [
      {
        id: "area_que_subio",
        label: "¿Qué área crees que subió más desde tu última medición, y por qué?",
        type: "textarea",
        placeholder: "Ej: salud física, porque sostuve mi hábito ancla casi todos los días...",
      },
      {
        id: "area_estancada",
        label: "¿Qué área se quedó igual o bajó, y qué está compitiendo por ese tiempo o energía?",
        type: "textarea",
        placeholder: "Ej: relaciones, porque el tiempo que antes usaba ahí ahora lo uso en el gym...",
      },
      {
        id: "alineacion_funeral",
        label: "¿Qué tan alineada está tu vida hoy con lo que dirías en tu funeral?",
        type: "scale",
      },
    ],
  },
  {
    id: "tu-mantra-personal",
    phaseId: "expansion",
    order: 11,
    concept: "mantra-collection",
    recap:
      "Recorriste las cuatro fases: entendiste por qué fallabas, encontraste tu 20%, lo volviste sistema, sostuviste tu ancla, la volviste identidad y aprendiste a recuperarte. Este es el cierre.",
    leadsTo:
      "Aquí termina la teoría, pero no el sistema: tu habit tracker y tu Radar de Vida siguen vivos, mes tras mes. El curso te dio el mapa; el camino lo sostienes tú.",
    title: "Tu mantra personal",
    narrative:
      "Con el tiempo, mis propias frases se volvieron parte del sistema. No las escribi para inspirar a nadie más — las escribi para recordarme a mi mismo, a las 6am, por que me estaba levantando.",
    mantra: "Amate a ti mismo. Pero también se autocritico.",
    theory: [
      "Has leido, en cada módulo, una frase mia — un mantra que use en mis propios peores días. No te las comparti para que las repitas sin pensar. Te las comparti como ejemplo de algo más útil: tener las tuyas.",
      "Un mantra no es una frase bonita para colgar en la pared. Es la versión comprimida de una lección que ya te costo cara, lista para recordarte en 3 segundos por que sigues, justo cuando más fácil sería parar.",
      "El único atajo real que existe es no buscar atajos. Y ese, de hecho, puede ser un mantra en si mismo. Los tuyos van a salir de tus propias recaidas, tus propios módulos, tus propios meses buenos y malos.",
      "Este es el último ejercicio del curso, pero no el final del sistema — el sistema sigue en tu habit tracker y en tu Radar de Vida, mes tras mes. Esto es solo el cierre de la parte teorica: quedarte con algo tuyo, escrito por ti, para ti.",
    ],
    exerciseTitle: "Escribe tu propio mantra",
    exerciseDescription: "No copies el mio. Escribe el tuyo, con tus palabras, sacado de lo que ya viviste en este curso.",
    fields: [
      {
        id: "borrador_mantras",
        label: "Escribe 3 frases que te dices (o deberías decirte) en tus peores días",
        type: "textarea",
        placeholder: "Ej: 1) esto también es data. 2) un mal día no es un mal mes. 3) ...",
      },
      {
        id: "mantra_final",
        label: "De esas 3, ¿cuál es TU mantra a partir de hoy?",
        type: "text",
        placeholder: "Escribelo tal cual te lo vas a repetir",
      },
      {
        id: "compartir_mantra",
        label: "¿Quieres que esta frase la vea alguien más algún día?",
        type: "choice",
        options: [
          {
            value: "si_se_quien",
            label: "Si, ya se quien",
            hint: "Esta respuesta no se comparte automáticamente — es solo para que reflexiones. Si quieres compartirla, es decisión tuya, fuera de la app.",
          },
          {
            value: "si_no_se_quien",
            label: "Si, no se quien todavía",
            hint: "Esta respuesta no se comparte automáticamente — queda guardada en tu cuenta hasta que decidas qué hacer con ella.",
          },
          {
            value: "no_solo_mia",
            label: "No, es solo mia",
            hint: "Esta respuesta no se comparte automáticamente con nadie — queda privada en tu cuenta, como el resto de tus ejercicios.",
          },
        ],
      },
    ],
  },
];

export function getModuleById(id: string) {
  return MODULES.find((m) => m.id === id) ?? null;
}

export function getPhaseById(id: string) {
  return PHASES.find((p) => p.id === id) ?? null;
}

/**
 * Turns a stored exercise answer into readable text for a callback. Choice
 * fields are stored as option values, so we map them back to their label;
 * text/textarea/scale answers are returned as-is. Empty answers return "".
 */
export function resolveFieldValue(
  moduleId: string,
  fieldId: string,
  storedValue: string | undefined
): string {
  const value = (storedValue ?? "").trim();
  if (!value) return "";
  const field = getModuleById(moduleId)?.fields.find((f) => f.id === fieldId);
  if (field?.type === "choice") {
    return field.options?.find((o) => o.value === value)?.label ?? value;
  }
  return value;
}
