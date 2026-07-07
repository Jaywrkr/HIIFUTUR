export type ExerciseField = {
  id: string;
  label: string;
  type: "textarea" | "text" | "scale" | "choice";
  placeholder?: string;
  options?: { value: string; label: string }[];
};

export type CoursePhase = {
  id: string;
  title: string;
  description: string;
};

export type CourseModule = {
  id: string;
  phaseId: string;
  order: number;
  title: string;
  /** Fragmento de la historia real de Jay (3 -> 9 en el Wheel of Life, 8 meses). */
  narrative: string;
  /** Una de las MANTRAS, la que mas resuena con este modulo. */
  mantra: string;
  theory: string[];
  exerciseTitle: string;
  exerciseDescription: string;
  fields: ExerciseField[];
};

export const PHASES: CoursePhase[] = [
  {
    id: "fundamentos",
    title: "Fase 1 — Fundamentos",
    description: "Por que fallabas antes, y la logica detras del sistema que vas a construir.",
  },
  {
    id: "habito-ancla",
    title: "Fase 2 — El habito ancla",
    description: "El unico hábito que, si lo sostienes, jala a todos los demas sin esfuerzo extra.",
  },
  {
    id: "sostenibilidad",
    title: "Fase 3 — Sostenibilidad",
    description: "Identidad, entorno y como manejar la recaida que vas a tener sí o sí.",
  },
  {
    id: "expansion",
    title: "Fase 4 — Expansión",
    description: "Apilar habitos, leer tu propio progreso, y quedarte con algo tuyo al final.",
  },
];

export const MODULES: CourseModule[] = [
  // ---------- FASE 1: FUNDAMENTOS ----------
  {
    id: "por-que-fallas",
    phaseId: "fundamentos",
    order: 1,
    title: "Por que fallas (y no es tu culpa)",
    narrative:
      "Antes de todo esto, mi vida promediaba un 3. No porque me pasaran cosas horribles, sino porque llevaba años en piloto automático, prometiéndome empezar 'el lunes que viene'. El primer cambio real no fue una rutina nueva — fue aceptar que el problema nunca fue mi disciplina.",
    mantra: "El crecimiento real es cuando te cansas de tus mierdas.",
    theory: [
      "La fuerza de voluntad no es un rasgo de caracter. Es un recurso limitado que se agota durante el dia, como una bateria que se descarga con cada decision, cada distraccion, cada 'aguanta un poco mas'.",
      "Cada vez que intentas sostener un cambio a base de motivacion, estas apostando a que la bateria aguante todos los dias, para siempre. Casi nunca aguanta. Y cuando falla, la conclusion automatica es 'no tengo disciplina', cuando en realidad nadie la tiene, todo el tiempo.",
      "No fallaste por debil. Fallaste porque disenaste un plan que dependia de sentirte con ganas. Un plan bueno funciona incluso el dia que te sientes pesimo — porque no depende de eso.",
      "Hay una version comoda de esta historia que dice 'la vida no es justa' y se queda ahi, usando la injusticia como excusa. Y es cierto: la vida no es justa. Pero quedarte ahi es victimizarte, y victimizarte te roba el poder que sí tienes sobre lo que haces hoy.",
      "El objetivo de este curso no es subir tu motivacion. Es construir un sistema tan pequeno que funcione incluso en tus peores dias — para que dejes de necesitar sentirte bien para actuar bien.",
      "Antes de seguir, necesitas ver tu propio patron. No para juzgarte — para dejar de repetirlo sin darte cuenta.",
    ],
    exerciseTitle: "Mapea tus fracasos pasados",
    exerciseDescription:
      "Sin juzgarte. Solo observa el patron. Escribe 2-3 intentos anteriores que abandonaste y que tenian en comun.",
    fields: [
      {
        id: "intentos_pasados",
        label: "Que intentaste antes y abandonaste?",
        type: "textarea",
        placeholder: "Ej: Ir al gym 5 veces por semana, dieta estricta desde el lunes, despertar a las 5am...",
      },
      {
        id: "patron_comun",
        label: "Que tenian en comun esos intentos?",
        type: "textarea",
        placeholder: "Ej: Todos empezaban demasiado grandes, dependian de motivacion, no tenian un disparador claro...",
      },
      {
        id: "causa_raiz",
        label: "Si tuvieras que elegir UNA causa raiz, cual seria?",
        type: "choice",
        options: [
          { value: "empezaba_grande", label: "Empezaba demasiado grande" },
          { value: "sin_plan_fallo", label: "No tenia plan para cuando fallara" },
          { value: "dependia_motivacion", label: "Dependia de sentirme motivado" },
          { value: "sin_tiempo_real", label: "Nunca tuve tiempo real asignado" },
          { value: "comparacion", label: "Me comparaba con el ritmo de otros" },
        ],
      },
    ],
  },
  {
    id: "pareto-en-tu-vida",
    phaseId: "fundamentos",
    order: 2,
    title: "El Principio de Pareto aplicado a tu vida",
    narrative:
      "Cuando encontre el Principio de Pareto, deje de intentar arreglar los diez frentes de mi vida al mismo tiempo. Elegi uno. En el momento no se sintio como un gran cambio. Visto desde ahora, fue el punto de quiebre real.",
    mantra:
      "Estoy haciendo genuinamente lo mejor que puedo y aun me pregunto: como puedo hacer mas? Esa es la diferencia.",
    theory: [
      "El Principio de Pareto dice que el 80% de tus resultados viene del 20% de tus acciones. No es una ley fisica exacta, es una observacion: no todas las acciones pesan igual.",
      "La mayoria de lo que haces en un dia normal es ruido — reacciones, pendientes menores, cosas que se sienten productivas pero no mueven nada. Un puñado de acciones concentran el cambio real.",
      "Esto tiene una version incomoda: la mayoria de la gente usa el 'aprender' y el 'planear' como forma de sentirse bien por progresar, sin progresar realmente. Leer sobre habitos no es lo mismo que tener uno. Si no aplicas lo que aprendes a algo concreto, estas perdido en el mismo lugar, con mas informacion.",
      "Tu trabajo aqui no es hacer mas cosas. Es encontrar cual es tu 20% — la accion que, sostenida, jala a las demas — y protegerla con tu vida, incluso cuando todo lo demas se sienta urgente.",
      "Piensa en el area que elegiste al empezar el curso. De todo lo que podrias hacer ahi, que 2 o 3 acciones, si las sostuvieras, moverian todo lo demas casi solas?",
      "No necesitas la lista perfecta. Necesitas UNA accion que te atrevas a nombrar como la mas importante, aunque no estes 100% seguro.",
    ],
    exerciseTitle: "Encuentra tu 20% critico",
    exerciseDescription: "Lista posibles acciones y despues senala cual es la que mas impacto tendria.",
    fields: [
      {
        id: "acciones_posibles",
        label: "Lista 4-5 acciones que podrias tomar en tu area elegida",
        type: "textarea",
        placeholder: "Ej: dormir 7h, caminar 20 min, leer 10 paginas, ahorrar 5%, escribir 1 pagina...",
      },
      {
        id: "accion_critica",
        label: "De esa lista, cual es LA accion que mas 80% generaria?",
        type: "text",
        placeholder: "Se especifico. Una sola accion.",
      },
      {
        id: "confianza_accion",
        label: "Que tan seguro estas de que esta es tu accion del 20%?",
        type: "scale",
      },
    ],
  },
  {
    id: "disena-tu-sistema",
    phaseId: "fundamentos",
    order: 3,
    title: "Diseña tu sistema (no tu meta)",
    narrative:
      "Mi primer 'habito' fue tan pequeño que me daba un poco de vergüenza contarlo. Funciono precisamente por eso: era imposible fallarlo, incluso en los dias donde todo lo demas se caia.",
    mantra: "Tienes una meta? Debes tener solo un plan. Nada de plan B.",
    theory: [
      "Una meta es un punto en el futuro: 'bajar 10kg', 'ahorrar 50 mil'. Es vaga sobre el como, y no te dice que hacer un martes cualquiera a las 7am.",
      "Un sistema es lo que haces todos los dias, sin importar la meta: 'caminar 15 minutos despues de comer'. Las metas son buenas para apuntar. Los sistemas son los que realmente cambian tu vida.",
      "Productividad no es disciplina. Es hacer mas de lo que te hace sentir bien, con menos estres y mas energia — no mas cosas en una lista. Un sistema bien disenado deberia sentirse asi, no como una carga extra.",
      "Tu sistema debe ser tan pequeno que sea ridiculo fallar. Si dudas si es 'suficiente', hazlo mas pequeno. Puedes crecerlo despues; no puedes crecer algo que abandonaste.",
      "Una trampa comun: tener un plan A y un plan B 'por si acaso'. El plan B es, casi siempre, el permiso que te das de antemano para no cumplir el plan A. Un solo plan, sin salida de emergencia, te obliga a resolver en el momento en vez de escapar.",
      "No se trata de encontrar lo que amas hacer. Se trata de encontrar aquello que hace que el sacrificio de sostenerlo valga la pena — y disenar el sistema alrededor de eso.",
    ],
    exerciseTitle: "Disena tus primeros habitos",
    exerciseDescription:
      "Vas a poder activar hasta 5 habitos, pero solo uno a la vez al inicio. Diseña el primero: minusculo, concreto, con disparador claro.",
    fields: [
      {
        id: "habito_1",
        label: "Habito 1: nombre + disparador",
        type: "text",
        placeholder: "Ej: Despues de cepillarme los dientes, hago 5 sentadillas",
      },
      {
        id: "habito_2",
        label: "Habito 2 (para mas adelante): nombre + disparador",
        type: "text",
        placeholder: "Ej: Antes de dormir, escribo 1 linea en mi diario",
      },
      {
        id: "habito_3",
        label: "Habito 3 (para mas adelante): nombre + disparador",
        type: "text",
        placeholder: "Ej: Al llegar del trabajo, guardo 20 pesos",
      },
      {
        id: "tamano_habito",
        label: "Tu habito 1, tan pequeno que...",
        type: "choice",
        options: [
          { value: "vergonzoso", label: "Me da un poco de vergüenza lo pequeño que es (perfecto)" },
          { value: "reto_real", label: "Se siente como un reto real (hazlo mas chico)" },
          { value: "ya_lo_hago", label: "Ya lo hago casi siempre (bien, pero sube el nivel)" },
        ],
      },
    ],
  },
  {
    id: "primeras-72-horas",
    phaseId: "fundamentos",
    order: 4,
    title: "Las primeras 72 horas",
    narrative:
      "Falle al tercer dia. Estuve a punto de tirar todo por la borda. La unica diferencia esta vez fue que ya tenia decidido, de antemano, exactamente que iba a hacer cuando fallara.",
    mantra: "Te sientes mal porque sabes lo que se supone que debes hacer y no lo estas haciendo.",
    theory: [
      "El 80% de la gente abandona un habito nuevo en las primeras 72 horas. No es porque el habito sea dificil — la mayoria son minusculos a proposito. Es porque no tenian un plan para cuando fallaran una vez.",
      "Fallar un dia no rompe el sistema. Fallar dos dias seguidos si empieza a romperlo, porque ahi es donde 'una excepcion' se convierte en 'asi es como soy ahora'.",
      "Mucha gente pide consejo, lee mas, planea mas — como forma de posponer el momento incomodo de simplemente intentarlo y fallar. El miedo a la prueba y error disfrazado de 'preparacion'.",
      "Tu unica regla real: nunca fallar dos veces seguidas. Si fallaste hoy, mañana es innegociable — la version mas pequeña posible del habito, sin excusas, sin esperar sentirte listo.",
      "Esto no es sobre ser perfecto. Es sobre no dejar que un mal dia se convierta en una mala semana, y una mala semana en 'lo volvi a dejar'.",
      "Decide ahora, con la cabeza fria, que vas a hacer el dia que falles. Vas a fallar. La pregunta no es si, sino que vas a hacer despues.",
    ],
    exerciseTitle: "Tu plan para cuando falles",
    exerciseDescription: "Porque vas a fallar en algun momento. Decide ahora, con calma, que vas a hacer.",
    fields: [
      {
        id: "plan_de_fallo",
        label: "Si fallas un dia, que haras exactamente al dia siguiente?",
        type: "textarea",
        placeholder: "Ej: Hago la version mas pequena del habito, sin excusas, sin esperar sentirme listo.",
      },
      {
        id: "compromiso",
        label: "Escribe tu compromiso en una frase",
        type: "text",
        placeholder: "Ej: No busco perfeccion, busco continuidad.",
      },
      {
        id: "regla_de_fallo",
        label: "Cuando falles, que vas a hacer?",
        type: "choice",
        options: [
          { value: "version_minima", label: "La version mas pequena, sin excusas" },
          { value: "saltar_sin_culpa", label: "Saltarlo y retomar manana sin culpa" },
          { value: "avisar", label: "Avisarle a alguien que me haga responsable" },
        ],
      },
    ],
  },

  // ---------- FASE 2: HABITO ANCLA ----------
  {
    id: "habito-ancla",
    phaseId: "habito-ancla",
    order: 5,
    title: "Encuentra tu habito ancla",
    narrative:
      "En el mes 3 me di cuenta de que un solo habito — dormir a una hora fija — estaba arrastrando a todos los demas sin que yo hiciera nada extra. Ese fue mi habito ancla, y no lo elegi a proposito: lo descubri mirando hacia atras.",
    mantra: "Nadie piensa en el ahora como el futuro pasado.",
    theory: [
      "James Clear, en Habitos Atomicos, habla de los 'keystone habits': habitos que no solo mejoran un area, sino que jalan a varias otras sin que tengas que trabajar en ellas directamente.",
      "No todos los habitos pesan igual. Dormir bien mejora tu energia, tu energia mejora tu entrenamiento, tu entrenamiento mejora tu animo, tu animo mejora tus relaciones. Un solo cambio, efectos en cascada.",
      "Tu habito ancla no siempre es el mas obvio ni el que mas te emociona. A veces es el mas aburrido: dormir, tomar agua, ordenar tu espacio. Lo reconoces no por lo que es, sino por lo que arrastra.",
      "Piensa en 'aguas arriba' y 'aguas abajo'. Casi todos atacamos los sintomas aguas abajo: 'quiero mas energia' (sintoma), en vez de resolver 'duermo mal' (causa aguas arriba). Nadie piensa en el ahora como el futuro pasado — lo que decides hoy, aguas arriba, es lo que tu yo futuro va a mirar hacia atras como el punto de quiebre.",
      "Este modulo no te pide un habito nuevo. Te pide mirar los que ya escribiste (o los que ya intentaste) y encontrar cual de ellos, si lo sostienes, jalaria a los demas sin que tengas que esforzarte en cada uno por separado.",
      "Si tu habito activo hoy no es tu ancla, no pasa nada — puedes seguir sosteniendolo y usar este ejercicio para elegir con mas intencion el segundo o tercero.",
    ],
    exerciseTitle: "Identifica tu habito ancla",
    exerciseDescription:
      "No es el habito mas vistoso. Es el que, al mejorar, jala a los demas sin que hagas nada extra.",
    fields: [
      {
        id: "areas_relacionadas",
        label: "Que areas de tu vida sientes que estan conectadas entre si (si una falla, las demas tambien)?",
        type: "textarea",
        placeholder: "Ej: cuando duermo mal, tambien como peor y soy mas cortante con mi pareja...",
      },
      {
        id: "habito_ancla",
        label: "Que UNA accion, si mejora, jalaria a todas las demas?",
        type: "text",
        placeholder: "Ej: dormir a la misma hora todos los dias",
      },
      {
        id: "tipo_ancla",
        label: "Tu habito ancla toca principalmente...",
        type: "choice",
        options: [
          { value: "sueno", label: "Sueño / descanso" },
          { value: "movimiento", label: "Movimiento / ejercicio" },
          { value: "alimentacion", label: "Alimentacion" },
          { value: "entorno", label: "Entorno / organizacion" },
          { value: "mentalidad", label: "Mentalidad / reflexion" },
        ],
      },
      {
        id: "control_actual",
        label: "Que tanto control tienes hoy sobre ese habito ancla?",
        type: "scale",
      },
    ],
  },

  // ---------- FASE 3: SOSTENIBILIDAD ----------
  {
    id: "identidad-vs-resultado",
    phaseId: "sostenibilidad",
    order: 6,
    title: "Identidad vs. resultado",
    narrative:
      "Deje de decirme 'quiero ser alguien que hace ejercicio' y empece a decir 'soy alguien que entrena'. El lenguaje cambio antes que el resultado — y fue el lenguaje el que sostuvo el cambio en los dias dificiles.",
    mantra: "Piensa que quieres que digan en tu funeral. No te importara el dinero, sino la persona.",
    theory: [
      "Hay dos formas de perseguir un cambio: por resultado ('quiero pesar X') o por identidad ('soy alguien que cuida su cuerpo'). Los resultados son temporales. La identidad sostiene el comportamiento incluso cuando el resultado tarda.",
      "Cada vez que completas tu habito, no solo tachas una casilla — estas votando por el tipo de persona que quieres ser. Un check no es 'ya lo hice hoy', es 'soy alguien que hace esto'.",
      "Esto tiene un limite importante: identidad no es lo mismo que autoengano. No se trata de decirte cosas bonitas sin evidencia. Amate a ti mismo, pero tambien se autocritico — la identidad se construye con evidencia real, por pequeña que sea, no con frases motivacionales vacias.",
      "Un ejercicio que ayuda: imagina tu funeral. A nadie le va a importar cuanto dinero tenias. Va a importar quien fuiste con la gente, que sostuviste, en que te convertiste con el tiempo. Esa es la version de ti que este sistema esta construyendo, un dia a la vez.",
      "Cuando falles un dia, la pregunta util no es '¿rompi mi racha?'. Es '¿esto es evidencia de quien soy, o es una excepcion de un mal dia?'. Una excepcion no cambia una identidad. Un patron si.",
    ],
    exerciseTitle: "Redefine quien eres, no solo que haces",
    exerciseDescription: "Vas a escribir tu identidad en construccion, con evidencia real, no solo con intencion.",
    fields: [
      {
        id: "frase_identidad",
        label: "Termina la frase: 'Soy alguien que ____'",
        type: "text",
        placeholder: "Ej: soy alguien que entrena, aunque sea poco, casi todos los dias",
      },
      {
        id: "evidencia_identidad",
        label: "Que evidencia (por pequena que sea) tienes de que ya eres esa persona?",
        type: "textarea",
        placeholder: "Ej: llevo 12 dias haciendo mi habito minimo, sin fallar dos seguidos...",
      },
      {
        id: "actuaste_como",
        label: "Hoy, actuaste mas como la persona que quieres ser o como la de antes?",
        type: "choice",
        options: [
          { value: "nueva", label: "Como la nueva version de mi" },
          { value: "antes", label: "Como la version de antes" },
          { value: "mitad", label: "Mitad y mitad" },
        ],
      },
    ],
  },
  {
    id: "disena-tu-entorno",
    phaseId: "sostenibilidad",
    order: 7,
    title: "Diseña tu entorno",
    narrative:
      "Cambie mi cuarto, mi telefono y mi cocina antes de cambiarme a mi mismo. Rediseñar el espacio fue mas efectivo que cualquier cantidad de fuerza de voluntad que intente reunir antes.",
    mantra: "No esperes a ser mas senior para fijarte mas en los detalles.",
    theory: [
      "La fuerza de voluntad pierde casi siempre contra un entorno mal diseñado. Si el celular esta junto a la cama, lo vas a revisar. Si la comida chatarra esta a la vista, la vas a comer. El ambiente gana mas seguido de lo que creemos.",
      "Disenar tu entorno es reducir la friccion para lo que quieres hacer, y aumentarla para lo que no. Deja la ropa de entrenar lista la noche anterior. Guarda el control remoto lejos. Son cambios pequeños con efecto desproporcionado.",
      "Esto conecta directo con los detalles: no esperes a 'tener mas disciplina' para cuidar el entorno. Los detalles se cuidan ahora, en la version de ti que existe hoy, no en una version futura mas madura que quiza nunca llegue si no empiezas por lo pequeño.",
      "No necesitas rediseñar tu vida entera. Necesitas identificar UNA friccion real que esta saboteando tu habito actual, y UN cambio de entorno, especifico y barato, que la reduzca.",
      "Piensa tambien en como hacerlo mas divertido. Un sistema sostenible no tiene que sentirse como una obligacion gris — el entorno tambien puede disenarse para que el habito se sienta bien, no solo correcto.",
    ],
    exerciseTitle: "Reduce la friccion de tu entorno",
    exerciseDescription: "Un cambio de entorno, especifico y realista, vale mas que diez propositos de fuerza de voluntad.",
    fields: [
      {
        id: "friccion_actual",
        label: "Que friccion en tu entorno hace mas dificil tu habito hoy?",
        type: "textarea",
        placeholder: "Ej: la ropa de entrenar esta guardada hasta arriba del clóset, tardo 10 min en encontrarla",
      },
      {
        id: "cambio_entorno",
        label: "Que UN cambio de entorno reduciria esa friccion?",
        type: "textarea",
        placeholder: "Ej: dejar la ropa de entrenar sobre la silla, ya lista, la noche anterior",
      },
      {
        id: "costo_cambio",
        label: "Ese cambio que propones es...",
        type: "choice",
        options: [
          { value: "gratis", label: "Gratis, lo puedo hacer hoy mismo" },
          { value: "barato", label: "Cuesta poco (menos de lo que gastas en un antojo)" },
          { value: "ahorrar", label: "Requiere ahorrar o planear un poco mas" },
        ],
      },
    ],
  },
  {
    id: "maneja-recaidas",
    phaseId: "sostenibilidad",
    order: 8,
    title: "Maneja las recaidas",
    narrative:
      "Hubo un mes completo, el quinto, donde no cumpli casi nada. Lo que me saco de ahi no fue la motivacion — fue negarme a tratarme como una victima de mi propio mal mes.",
    mantra:
      "La vida no es justa. Pero llorar no te hace fuerte. Victimizarte te roba poder. Yo no quiero que me tengan lastima, quiero que se levanten al verme. Que digan: 'si el pudo, yo tambien'. Eso es mas util que cualquier excusa.",
    theory: [
      "Una recaida no es el fin del sistema. Es el momento donde el sistema realmente se pone a prueba — cualquiera sostiene un habito cuando todo va bien.",
      "El patron peligroso no es fallar. Es la historia que te cuentas despues de fallar: 'total, ya la regué', 'no tengo lo que se necesita', 'la vida no me ha dado las mismas oportunidades'. Esa historia, no el fallo en si, es lo que te saca del sistema por semanas.",
      "Es cierto que la vida no es justa. Algunas personas parten con mas ventajas que otras. Pero quedarte en esa verdad como excusa es un lujo caro: te roba exactamente el poder que si tienes sobre lo que haces hoy.",
      "La diferencia entre alguien que se recupera rapido y alguien que abandona no es el tamano de la caida. Es que el primero ya tenia, de antemano, una regla clara para la proxima vez que fallara — y la uso sin drama.",
      "No se trata de fingir que no duele. Se trata de que, en vez de pedir lastima, prefieras que la gente te vea levantarte y piense 'si el pudo, yo tambien'. Eso ayuda mas a otros — y a ti — que cualquier excusa bien armada.",
    ],
    exerciseTitle: "Reescribe tu ultima recaida",
    exerciseDescription: "Vas a mirar una recaida real (o una que temes que pase) y cambiar la historia que te cuentas sobre ella.",
    fields: [
      {
        id: "recaida_real",
        label: "Describe tu ultima recaida real (o una que temes que pase)",
        type: "textarea",
        placeholder: "Ej: deje de hacer mi habito por 2 semanas despues de un viaje de trabajo...",
      },
      {
        id: "pensamiento_justificacion",
        label: "Cual fue (o seria) el pensamiento que usaste para justificarla?",
        type: "text",
        placeholder: "Ej: total ya perdi la racha, para que sigo...",
      },
      {
        id: "reescritura",
        label: "Reescribe ese pensamiento como lo haria alguien que no se victimiza",
        type: "textarea",
        placeholder: "Ej: perdi 2 semanas, no perdi el sistema. Hoy retomo la version minima, sin drama.",
      },
      {
        id: "regla_recaida",
        label: "Tu regla para la proxima vez",
        type: "choice",
        options: [
          { value: "no_2_seguidos", label: "Nunca fallar 2 dias seguidos" },
          { value: "avisar_24h", label: "Avisarle a alguien en menos de 24h" },
          { value: "version_mini_obligatoria", label: "Version minima obligatoria al dia siguiente" },
        ],
      },
    ],
  },

  // ---------- FASE 4: EXPANSION ----------
  {
    id: "apila-tus-habitos",
    phaseId: "expansion",
    order: 9,
    title: "Apila tus habitos",
    narrative:
      "Para el mes 6 ya no sostenia un solo habito. Sostenia cuatro, apilados uno sobre el otro, sin que se sintiera como mas esfuerzo — porque cada uno uso al anterior como disparador.",
    mantra:
      "La mayoria de las personas utilizan el aprendizaje como una forma de sentirse bien por haber progresado cuando, en realidad, no estan aprendiendo ni progresando. Si no tienes un proyecto, negocio o proposito para aplicar lo que aprendes, estas perdido.",
    theory: [
      "El habit stacking (apilamiento de habitos) usa un habito que ya sostienes como disparador automatico para uno nuevo, mas pequeno. 'Despues de [habito que ya hago], voy a [habito nuevo]'.",
      "Esto funciona porque no dependes de recordar o de tener ganas — el habito anterior, que ya es automatico, dispara al siguiente sin que tengas que pensarlo.",
      "El error comun aqui es apilar demasiado rapido, o apilar algo grande sobre un habito que apenas es estable. Solo apila cuando el primero se sienta aburrido de tan automatico — no antes.",
      "Este modulo, como todos los anteriores, no sirve de nada si se queda en teoria. Aplica esto a tu propia lista de habitos (los que escribiste en el modulo 3) y conviertelos en una cadena real, no solo en una lista de buenas intenciones.",
    ],
    exerciseTitle: "Construye tu cadena de habitos",
    exerciseDescription: "Usa tu habito ya sostenido como disparador para el siguiente, en vez de depender de la memoria o las ganas.",
    fields: [
      {
        id: "cadena_habito",
        label: "Completa: 'Despues de ____, voy a ____'",
        type: "text",
        placeholder: "Ej: Despues de mis 5 sentadillas, tomo un vaso de agua",
      },
      {
        id: "futuros_apilados",
        label: "Que otros 2 habitos podrias apilar mas adelante, cuando el actual se sienta automatico?",
        type: "textarea",
        placeholder: "Ej: despues de tomar el agua, escribo 1 linea de gratitud; despues de eso, reviso mis finanzas 2 min...",
      },
    ],
  },
  {
    id: "wheel-of-life-brujula",
    phaseId: "expansion",
    order: 10,
    title: "Tu Wheel of Life como brujula",
    narrative:
      "El mes 8 medi mi Wheel of Life y marco un 9. No llore de felicidad — senti, simplemente, que por fin el numero coincidia con lo que ya sabia por dentro desde hacia semanas.",
    mantra: "Exito es tener cada dia menos arrepentimientos.",
    theory: [
      "El Wheel of Life no es un examen que apruebas o repruebas. Es una brujula: te dice hacia donde te estas moviendo, no que tan 'bien' o 'mal' eres como persona.",
      "Cada medicion mensual es una fotografia. Comparar la foto de este mes con la anterior te dice, con datos y no con sensaciones, si el sistema esta funcionando o si es momento de ajustar el habito ancla.",
      "Es facil obsesionarse con el area que menos sube. Pero exito real no es tener un 10 en todo — es tener, cada dia, menos cosas de las que te arrepientes al acostarte. Esa es una metrica mas honesta que cualquier promedio.",
      "Usa esta revision para preguntarte que area esta compitiendo por el mismo tiempo y energia que tu habito ancla, y decide con calma — no con culpa — que vas a hacer al respecto el proximo mes.",
    ],
    exerciseTitle: "Lee tu propio progreso",
    exerciseDescription: "Antes de tu proxima medicion, reflexiona sobre lo que ya sabes que va a mostrar.",
    fields: [
      {
        id: "area_que_subio",
        label: "Que area crees que subio mas desde tu ultima medicion, y por que?",
        type: "textarea",
        placeholder: "Ej: salud fisica, porque sostuve mi habito ancla casi todos los dias...",
      },
      {
        id: "area_estancada",
        label: "Que area se quedo igual o bajo, y que esta compitiendo por ese tiempo o energia?",
        type: "textarea",
        placeholder: "Ej: relaciones, porque el tiempo que antes usaba ahi ahora lo uso en el gym...",
      },
      {
        id: "alineacion_funeral",
        label: "Que tan alineada esta tu vida hoy con lo que dirias en tu funeral?",
        type: "scale",
      },
    ],
  },
  {
    id: "tu-mantra-personal",
    phaseId: "expansion",
    order: 11,
    title: "Tu mantra personal",
    narrative:
      "Con el tiempo, mis propias frases se volvieron parte del sistema. No las escribi para inspirar a nadie mas — las escribi para recordarme a mi mismo, a las 6am, por que me estaba levantando.",
    mantra: "Amate a ti mismo. Pero tambien se autocritico.",
    theory: [
      "Has leido, en cada modulo, una frase mia — un mantra que use en mis propios peores dias. No te las comparti para que las repitas sin pensar. Te las comparti como ejemplo de algo mas util: tener las tuyas.",
      "Un mantra no es una frase bonita para colgar en la pared. Es la version comprimida de una leccion que ya te costo cara, lista para recordarte en 3 segundos por que sigues, justo cuando mas facil seria parar.",
      "El unico atajo real que existe es no buscar atajos. Y ese, de hecho, puede ser un mantra en si mismo. Los tuyos van a salir de tus propias recaidas, tus propios modulos, tus propios meses buenos y malos.",
      "Este es el ultimo ejercicio del curso, pero no el final del sistema — el sistema sigue en tu habit tracker y en tu Wheel of Life, mes tras mes. Esto es solo el cierre de la parte teorica: quedarte con algo tuyo, escrito por ti, para ti.",
    ],
    exerciseTitle: "Escribe tu propio mantra",
    exerciseDescription: "No copies el mio. Escribe el tuyo, con tus palabras, sacado de lo que ya viviste en este curso.",
    fields: [
      {
        id: "borrador_mantras",
        label: "Escribe 3 frases que te dices (o deberias decirte) en tus peores dias",
        type: "textarea",
        placeholder: "Ej: 1) esto tambien es data. 2) un mal dia no es un mal mes. 3) ...",
      },
      {
        id: "mantra_final",
        label: "De esas 3, cual es TU mantra a partir de hoy?",
        type: "text",
        placeholder: "Escribelo tal cual te lo vas a repetir",
      },
      {
        id: "compartir_mantra",
        label: "Quieres que esta frase la vea alguien mas algun dia?",
        type: "choice",
        options: [
          { value: "si_se_quien", label: "Si, ya se quien" },
          { value: "si_no_se_quien", label: "Si, no se quien todavia" },
          { value: "no_solo_mia", label: "No, es solo mia" },
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
