import { annotateGlossary } from "@/lib/glossary";
import { GlossaryTerm } from "@/components/GlossaryTerm";

export function TheoryText({
  text,
  usedTerms,
  className = "text-sm leading-relaxed text-neutral-300",
}: {
  text: string;
  usedTerms: Set<string>;
  className?: string;
}) {
  const segments = annotateGlossary(text, usedTerms);
  return (
    <p className={className}>
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
