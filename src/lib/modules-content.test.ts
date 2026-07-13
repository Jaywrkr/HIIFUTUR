import { describe, expect, it } from "vitest";
import { MODULES, PHASES } from "@/lib/modules-content";

describe("course content integrity", () => {
  it("has 11 modules across 4 phases", () => {
    expect(MODULES).toHaveLength(11);
    expect(PHASES).toHaveLength(4);
  });

  it("module ids are unique (they are used as URLs and progress keys)", () => {
    const ids = MODULES.map((m) => m.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("orders run 1..N without gaps — unlocking depends on it", () => {
    expect(MODULES.map((m) => m.order)).toEqual(MODULES.map((_, i) => i + 1));
  });

  it("every module points to an existing phase", () => {
    const phaseIds = new Set(PHASES.map((p) => p.id));
    for (const m of MODULES) {
      expect(phaseIds.has(m.phaseId)).toBe(true);
    }
  });

  it("every module has a complete exercise", () => {
    for (const m of MODULES) {
      expect(m.fields.length).toBeGreaterThan(0);
      const fieldIds = m.fields.map((f) => f.id);
      expect(new Set(fieldIds).size).toBe(fieldIds.length);
    }
  });

  it("every choice option has a non-empty hint explaining what picking it means", () => {
    for (const m of MODULES) {
      for (const f of m.fields) {
        if (f.type !== "choice") continue;
        for (const option of f.options ?? []) {
          expect(option.hint.trim().length).toBeGreaterThan(0);
        }
      }
    }
  });
});
