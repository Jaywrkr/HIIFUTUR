export type Testimonial = {
  name: string;
  /** What changed for them, in their own words — not a marketing line. */
  quote: string;
  /** Optional: something concrete, e.g. "3 → 8 en su Radar de Vida, 2 meses". */
  result?: string;
};

// Empty until the closed beta produces real ones — never fabricate a quote
// here. The landing only renders the testimonials section when this array
// is non-empty (see src/components/Testimonials.tsx), so adding the first
// real testimonial is the only step needed to turn the section on.
export const TESTIMONIALS: Testimonial[] = [];
