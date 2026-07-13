import { annotateGlossary } from "@/lib/glossary";
import { GlossaryTerm } from "@/components/GlossaryTerm";

export function TheoryText({ text, usedTerms }: { text: string; usedTerms: Set<string> }) {
  const segments = annotateGlossary(text, usedTerms);
  return (
    <p className="text-sm leading-relaxed text-neutral-300">
      {segments.map((seg, i) =>
        "term" in seg ? (
          <GlossaryTerm key={i} term={seg.term} definition={seg.definition} />
        ) : (
          <span key={i}>{seg.text}</span>
        )
      )}
    </p>
  );
}
