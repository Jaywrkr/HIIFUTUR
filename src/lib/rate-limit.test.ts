import { beforeEach, describe, expect, it } from "vitest";
import {
  rateLimit,
  clientIpFromHeaders,
  retryAfterText,
  __resetRateLimitStore,
} from "./rate-limit";

describe("rateLimit", () => {
  beforeEach(() => __resetRateLimitStore());

  it("permite hasta el limite y luego bloquea", () => {
    const opts = { limit: 3, windowMs: 1000, now: 0 };
    expect(rateLimit("k", opts).ok).toBe(true);
    expect(rateLimit("k", opts).ok).toBe(true);
    expect(rateLimit("k", opts).ok).toBe(true);
    const blocked = rateLimit("k", opts);
    expect(blocked.ok).toBe(false);
    expect(blocked.retryAfterSeconds).toBe(1);
  });

  it("reinicia la ventana cuando pasa el tiempo", () => {
    const opts = { limit: 1, windowMs: 1000 };
    expect(rateLimit("k", { ...opts, now: 0 }).ok).toBe(true);
    expect(rateLimit("k", { ...opts, now: 500 }).ok).toBe(false);
    expect(rateLimit("k", { ...opts, now: 1000 }).ok).toBe(true);
  });

  it("cuenta cada clave por separado", () => {
    const opts = { limit: 1, windowMs: 1000, now: 0 };
    expect(rateLimit("a", opts).ok).toBe(true);
    expect(rateLimit("b", opts).ok).toBe(true);
    expect(rateLimit("a", opts).ok).toBe(false);
  });
});

describe("clientIpFromHeaders", () => {
  it("toma la primera IP de x-forwarded-for", () => {
    expect(clientIpFromHeaders("1.1.1.1, 2.2.2.2")).toBe("1.1.1.1");
  });

  it("cae a x-real-ip si no hay forwarded-for", () => {
    expect(clientIpFromHeaders(null, "3.3.3.3")).toBe("3.3.3.3");
  });

  it("devuelve 'unknown' sin ninguna cabecera", () => {
    expect(clientIpFromHeaders(null, null)).toBe("unknown");
  });
});

describe("retryAfterText", () => {
  it("redondea a minutos", () => {
    expect(retryAfterText(120)).toBe("2 minutos");
    expect(retryAfterText(61)).toBe("2 minutos");
    expect(retryAfterText(60)).toBe("un minuto");
  });

  it("usa segundos por debajo del minuto", () => {
    expect(retryAfterText(30)).toBe("unos segundos");
  });
});
