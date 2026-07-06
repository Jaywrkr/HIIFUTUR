export type ExerciseField = {
  id: string;
  label: string;
  type: "textarea" | "text";
  placeholder?: string;
};

export type CourseModule = {
  id: string;
  order: number;
  title: string;
  theory: string[];
  exerciseTitle: string;
  exerciseDescription: string;
  fields: ExerciseField[];
};

export const MODULES: CourseModule[] = [
  {
    id: "por-que-fallas",
    order: 1,
    title: "Por que fallas (y no es tu culpa)",
    theory: [
      "La fuerza de voluntad no es un rasgo de caracter. Es un recurso limitado que se agota durante el dia, como una bateria.",
      "Cada vez que intentas sostener un cambio a base de motivacion, estas apostando a que la bateria aguante. Casi nunca aguanta.",
      "No fallaste por debilidad. Fallaste porque disenaste un plan que dependia de sentirte con ganas todos los dias.",
      "El objetivo de este curso no es subir tu motivacion. Es construir un sistema tan pequeno que funcione incluso en tus peores dias.",
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
    ],
  },
  {
    id: "pareto-en-tu-vida",
    order: 2,
    title: "El Principio de Pareto aplicado a tu vida",
    theory: [
      "El Principio de Pareto dice que el 80% de tus resultados viene del 20% de tus acciones.",
      "No todas las acciones pesan igual. La mayoria de lo que haces es ruido; un puñado de acciones concentran el cambio real.",
      "Tu trabajo no es hacer mas. Es encontrar cual es tu 20% y protegerlo con tu vida.",
      "Piensa en el area que elegiste al empezar. Que 2 o 3 acciones, si las hicieras de forma constante, moverian todo lo demas?",
    ],
    exerciseTitle: "Encuentra tu 20% critico",
    exerciseDescription: "Lista posibles acciones y despues seniala cual es la que mas impacto tendria.",
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
    ],
  },
  {
    id: "disena-tu-sistema",
    order: 3,
    title: "Disena tu sistema (no tu meta)",
    theory: [
      "Una meta es un punto en el futuro: 'bajar 10kg', 'ahorrar 50 mil'. Es vaga sobre el como.",
      "Un sistema es lo que haces todos los dias, sin importar la meta: 'caminar 15 minutos despues de comer'.",
      "Las metas son buenas para apuntar. Los sistemas son los que realmente cambian tu vida.",
      "Tu sistema debe ser tan pequeno que sea ridiculo fallar. Si dudas si es 'suficiente', hazlo mas pequeno.",
    ],
    exerciseTitle: "Disena tus primeros habitos",
    exerciseDescription:
      "Vas a poder activar hasta 5 habitos, pero solo uno a la vez al inicio. Disena el primero: minusculo, concreto, con disparador claro.",
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
    ],
  },
  {
    id: "primeras-72-horas",
    order: 4,
    title: "Las primeras 72 horas",
    theory: [
      "El 80% de la gente abandona un habito nuevo en las primeras 72 horas.",
      "No es porque el habito sea dificil. Es porque no tenian un plan para cuando fallaran una vez.",
      "Fallar un dia no rompe el sistema. Fallar dos dias seguidos si empieza a romperlo.",
      "Tu unica regla: nunca fallar dos veces seguidas. Si fallaste hoy, manana es innegociable.",
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
    ],
  },
];

export function getModuleById(id: string) {
  return MODULES.find((m) => m.id === id) ?? null;
}
