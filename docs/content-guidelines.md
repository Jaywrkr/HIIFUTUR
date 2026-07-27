# Guía de contenido

Guía práctica de escritura, día a día. Ver [`docs/brand.md`](brand.md)
(el porqué) y [`docs/mantras.md`](mantras.md) (el copy ya aprobado) antes
de escribir algo nuevo — esto es el "cómo" aplicado a cada superficie.

## Regla general (aplica a todo)

Segunda persona, frases cortas, un hecho o número concreto en vez de un
adjetivo cuando sea posible. Antes de publicar cualquier texto, la
prueba rápida: ¿podría este texto estar en cualquier otra app de hábitos
sin cambiar una palabra? Si sí, no está terminado.

## Landing

- El hero abre con una negación-contraste ("No es X. No es Y. Es Z.") o
  con un hecho concreto — nunca con una pregunta genérica ("¿te cuesta
  ser constante?").
- Cada sección de features describe **qué hace**, no una promesa vaga de
  resultado — "cada 3 días reales de hábito cumplido desbloquean el
  siguiente módulo", no "aprende a tu ritmo".
- Precios: siempre el número exacto (`$6.99/mes`), nunca "desde" sin el
  número real al lado.
- CTA principal siempre en imperativo corto: "Empezar gratis", nunca
  "¡Comienza tu transformación ahora!".

## Onboarding

- Cada paso explica **por qué** existe el límite o la regla, en una
  frase ("Elige hasta 3 áreas. No más. El sistema funciona porque es
  pequeño.") — no solo impone la restricción sin contexto.
- El Radar de Vida inicial se presenta como línea base, no como examen:
  "Del 1 al 10, sin filtro. Esta es tu línea base." — nunca sugerir que
  hay una respuesta "correcta".

## Notificaciones (push y en-app)

- Cortas — caben en una notificación real de teléfono, no se truncan.
- Nunca culpables: "Hoy todavía no has hecho: [hábito]" en vez de "¡Se
  te olvidó tu hábito!". El cuerpo de la notificación de recordatorio ya
  establece el tono: *"No pasa nada si es tarde. Tienes hasta 2 fallos
  por ciclo."*
- Sin emojis, sin signos de exclamación múltiples.

## Emails

- Asunto directo, sin urgencia falsa ("Recordatorio: [hábito] hoy", no
  "⚠️ ¡No pierdas tu racha!").
- Cada email transaccional (reset de contraseña, recordatorio) incluye
  el mantra del día cuando aplica — mantiene la voz consistente incluso
  en comunicación funcional.
- El link de "darse de baja" siempre visible y funcional en un solo
  click, sin fricción ni pregunta de confirmación — coherente con "sin
  culpa" como valor de marca.

## CTAs (llamados a la acción)

- Verbo en imperativo, 1-3 palabras: "Empezar gratis", "Ver todos los
  módulos", "Crear hábito".
- Nunca genéricos ("Click aquí", "Más información") — el CTA siempre
  dice específicamente qué pasa al presionarlo.
- Un solo CTA primario visible a la vez por pantalla (ver
  `docs/ux-principles.md`, "Foco").

## Mensajes de error

- Explican qué pasó y qué hacer, sin jerga técnica ni código de error
  crudo salvo que el usuario pueda usarlo (ej. no exponer stack traces).
- Tono neutral, nunca de regaño — un error de validación de formulario
  dice qué corregir, no "hiciste algo mal".
- Ejemplo real del proyecto: *"Enlace inválido."* (link de unsubscribe
  vencido/manipulado) — corto, sin explicación técnica de por qué es
  inválido.

## Contenido de la app (mantras, teoría de módulos, ejercicios)

Ver [`docs/mantras.md`](mantras.md) para el detalle completo. Resumen:
primera o segunda persona, una idea por frase, preferir lo específico e
incómodo sobre lo genérico y cómodo, sin exclamaciones ni emojis.

## Checklist rápido antes de publicar cualquier texto nuevo

1. ¿Está en segunda persona (o primera persona real, para mantras)?
2. ¿Reemplacé algún adjetivo vago por un número o hecho concreto donde
   fue posible?
3. ¿Evité toda palabra de la lista prohibida (`docs/brand.md`)?
4. ¿Sin emojis, sin exclamaciones múltiples, sin urgencia artificial?
5. ¿Podría este texto estar en cualquier otra app similar sin cambiar
   una palabra? Si sí, reescribir.
