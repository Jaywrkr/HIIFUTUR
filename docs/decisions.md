# Decisiones técnicas (ADR)

Formato: Problema → Opciones → Decisión → Motivo → Consecuencias. Se
agrega una entrada nueva cada vez que se toma una decisión técnica que
otra persona (o Claude en otra sesión) necesitaría entender para no
deshacerla sin querer. Orden cronológico, más reciente arriba.

---

## ADR-007: Migraciones de schema siempre idempotentes

**Problema**: un `ALTER TABLE ... ADD COLUMN` normal falla si se corre
dos veces (la columna ya existe) — y como las migraciones corren solas en
cada deploy (`vercel-build`), un deploy repetido o un rollback+redeploy
podía romper el build.

**Opciones**: (a) confiar en que Drizzle nunca regenere una migración ya
aplicada, (b) mantener una tabla de control manual, (c) editar el SQL
generado para que cada `ADD COLUMN` lleve `IF NOT EXISTS`.

**Decisión**: (c). Regla dura del proyecto: después de
`npx drizzle-kit generate`, editar el archivo generado a mano.

**Motivo**: ya causó un incidente real en producción antes de esta regla.

**Consecuencias**: cada migración nueva requiere un paso manual extra
(fácil de olvidar) — mitigado documentándolo en `CLAUDE.md` y `AGENTS.md`
como regla dura explícita, no solo una convención tácita.

---

## ADR-006: `mix-blend-mode: overlay` no funciona sobre fondo negro puro

**Problema**: el toggle de "grano de película" (textura de ruido sobre
toda la app) no se veía — el atributo y los estilos computados existían,
pero visualmente no había ningún cambio.

**Opciones**: (a) subir la opacidad hasta que se note "a la fuerza", (b)
cambiar el modo de blend.

**Decisión**: (b) — cambiar `mix-blend-mode: overlay` por `screen`.

**Motivo**: matemáticamente, `overlay` sobre un canal base en 0 (negro
puro, `#000000`, que es el fondo real de `html, body`) siempre da 0 sin
importar el contenido de la capa superior — la fórmula colapsa. `screen`
sí ilumina sobre negro. No era un problema de opacidad ni de z-index.

**Consecuencias**: cualquier efecto futuro con `mix-blend-mode` sobre esta
app debe considerar que el fondo es negro puro — `overlay` y `multiply`
son sospechosos por diseño en ese contexto.

---

## ADR-005: CSS sin `@layer` le gana a las utilidades de Tailwind, sin importar el orden

**Problema**: overrides de padding/ancho vía una clase de Tailwind
co-localizada en el JSX (ej. `className="auth-card max-w-sm"`) se
ignoraban silenciosamente en varios componentes (`.auth-card`, luego
`.card` en `HabitCard`).

**Opciones**: (a) `!important` en cada override, (b) envolver todo en
`@layer components`, (c) selectores con mayor especificidad para cada
caso puntual.

**Decisión**: (c) como patrón general — selectores como
`[data-density="compact"] .card` (atributo + clase) para overrides
condicionales, y `@layer components` solo donde de verdad hace falta que
una utilidad de Tailwind pueda pisar la clase después (`.auth-card`).

**Motivo**: por la spec de CSS Cascade Layers, CSS sin capa (unlayered)
siempre gana sobre CSS en capa (como las utilidades de Tailwind) sin
importar el orden de aparición en el archivo — `!important` es un parche
que esconde el problema real, no lo explica.

**Consecuencias**: cualquier "mi clase de Tailwind no hace nada" en este
proyecto debe revisarse contra esta regla antes de buscar en otro lado.
Ver `docs/ui-rules.md`, sección "Qué nunca hacer".

---

## ADR-004: Preferencias de pantalla (modo compacto, grano) en `localStorage`, no en la base de datos

**Problema**: dónde guardar toggles puramente visuales/de dispositivo
(modo compacto, grano de película) que no son datos de la cuenta.

**Opciones**: (a) columna nueva en `users`, (b) `localStorage` + atributo
`data-*` en `<html>`.

**Decisión**: (b).

**Motivo**: son preferencias de *este navegador/dispositivo*, no de la
persona — guardarlas en la cuenta las sincronizaría entre dispositivos de
forma no deseada, y agregaría columnas a `users` para algo que no
necesita persistir en el servidor ni aparecer en ningún reporte.

**Consecuencias**: un script bloqueante en `layout.tsx` lee la
preferencia antes del primer paint (evita flash de vuelta al estado
normal). Cualquier preferencia de pantalla nueva debería seguir este
mismo patrón — ver `DensityToggle.tsx`/`GrainToggle.tsx`.

---

## ADR-003: Modo compacto quita elementos, no solo espacio

**Problema**: la primera versión del modo compacto solo achicaba
padding/márgenes — el dueño del producto lo consideró insuficiente
("no veo diferencia").

**Opciones**: (a) seguir apretando el espaciado más agresivamente, (b)
ocultar contenido secundario por completo.

**Decisión**: (b) — clase `.compact-hide` (`display: none` bajo
`[data-density="compact"]`) aplicada a texto y elementos no esenciales
(subtítulos, categoría de hábito, badges decorativos, flechas
redundantes), más un cambio estructural en `HabitCard` (pierde el marco
entero y pasa a fila plana).

**Motivo**: "más simple" para un usuario real significa menos cosas en
pantalla, no las mismas cosas más apretadas.

**Consecuencias**: cualquier feature nueva con texto secundario/decorativo
debería considerar si necesita `.compact-hide` desde el inicio, no como
un parche después.

---

## ADR-002: Server Actions en vez de una API REST propia

**Problema**: cómo estructurar la escritura de datos (marcar hábito,
guardar ejercicio, etc.).

**Opciones**: (a) API REST completa con rutas propias, (b) Server
Actions de Next.js.

**Decisión**: (b), con solo 6 excepciones donde una ruta HTTP real es
necesaria porque el caller no es el navegador de la app en un flujo
normal de React (ver `docs/api.md`).

**Motivo**: menos código (sin serialización manual de requests/responses,
sin capa de validación duplicada), y el modelo de Server Components ya
asume que el servidor y el cliente están en el mismo "programa" lógico.

**Consecuencias**: no hay una API pública que un tercero pueda consumir —
si algún día hace falta (una app móvil nativa, por ejemplo), habría que
construir rutas API reales para eso, las Server Actions no sirven fuera
de Next.js.

---

## ADR-001: Drizzle ORM + NextAuth Credentials, no Prisma ni un proveedor de auth externo

**Problema**: elegir ORM y estrategia de autenticación para el MVP.

**Opciones**: Prisma vs. Drizzle; Clerk/Auth0/Supabase Auth vs. NextAuth
con Credentials Provider propio.

**Decisión**: Drizzle ORM + NextAuth v4 con Credentials Provider (email +
contraseña, hash con bcrypt, sesión JWT).

**Motivo**: Drizzle es más liviano y con tipos más directos sobre SQL sin
un runtime pesado como el de Prisma. Un proveedor de auth externo agrega
una dependencia de servicio (y costo) para un caso simple de
email+contraseña que NextAuth cubre bien sin terceros.

**Consecuencias**: sin login social out-of-the-box (se podría agregar un
provider de NextAuth después sin reescribir nada). La sesión JWT no
revalida contra la base en cada request — `getCurrentUser()` compensa
verificando explícitamente que la cuenta siga existiendo.
