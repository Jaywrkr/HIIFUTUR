// Limitador de peticiones en memoria (ventana fija). Sin dependencias ni
// servicios externos. Corta la fuerza bruta y el spam en login, registro,
// recuperacion de contrasena y feedback.
//
// Ojo: la memoria es por instancia. En un entorno serverless (Vercel) cada
// instancia tiene su propio contador, asi que el limite efectivo se multiplica
// por el numero de instancias activas. Aun asi reduce mucho el abuso y no
// necesita infraestructura. Cuando haya cuenta de Upstash, se cambia la
// implementacion de `rateLimit` por Redis manteniendo la misma firma.

type Bucket = { count: number; resetAt: number };

const store = new Map<string, Bucket>();

// Evita que el mapa crezca sin limite: cuando pasa este tamano, barremos las
// entradas ya expiradas antes de seguir.
const SWEEP_THRESHOLD = 10_000;

function sweepExpired(now: number) {
  for (const [key, bucket] of store) {
    if (bucket.resetAt <= now) store.delete(key);
  }
}

export type RateLimitResult = {
  /** true si la peticion esta permitida; false si excede el limite. */
  ok: boolean;
  /** segundos que faltan para que la ventana se reinicie (0 si ok). */
  retryAfterSeconds: number;
};

export type RateLimitOptions = {
  /** peticiones permitidas por ventana. */
  limit: number;
  /** duracion de la ventana en milisegundos. */
  windowMs: number;
  /** inyectable para tests; por defecto Date.now(). */
  now?: number;
};

/**
 * Registra un intento para `key` y dice si esta dentro del limite. Cada llamada
 * que devuelve `ok: true` consume una unidad de la ventana actual.
 */
export function rateLimit(key: string, { limit, windowMs, now }: RateLimitOptions): RateLimitResult {
  const ts = now ?? Date.now();

  if (store.size > SWEEP_THRESHOLD) sweepExpired(ts);

  const bucket = store.get(key);

  if (!bucket || bucket.resetAt <= ts) {
    store.set(key, { count: 1, resetAt: ts + windowMs });
    return { ok: true, retryAfterSeconds: 0 };
  }

  if (bucket.count >= limit) {
    return { ok: false, retryAfterSeconds: Math.ceil((bucket.resetAt - ts) / 1000) };
  }

  bucket.count += 1;
  return { ok: true, retryAfterSeconds: 0 };
}

/** Extrae la IP del cliente de una cabecera x-forwarded-for (o x-real-ip). */
export function clientIpFromHeaders(
  forwardedFor: string | null | undefined,
  realIp?: string | null
): string {
  if (forwardedFor) {
    const first = forwardedFor.split(",")[0]?.trim();
    if (first) return first;
  }
  return realIp?.trim() || "unknown";
}

/** Convierte los segundos restantes en un texto amable en espanol. */
export function retryAfterText(seconds: number): string {
  if (seconds >= 60) {
    const mins = Math.ceil(seconds / 60);
    return mins === 1 ? "un minuto" : `${mins} minutos`;
  }
  return "unos segundos";
}

/** Solo para tests: vacia el estado del limitador. */
export function __resetRateLimitStore() {
  store.clear();
}
