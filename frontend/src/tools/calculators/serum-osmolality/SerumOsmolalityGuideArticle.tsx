import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { SERUM_OSMOLALITY_FAQS } from './content';
import { SOURCE_NOTE } from './calculation';

export function SerumOsmolalityGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Serum Osmolality Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Estimate calculated serum osmolality with an improved equation that can
        include ethanol, and optionally compare to a measured value for the
        osmotic gap. Educational only.
      </p>

      <h2
        id="what"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What is serum osmolality?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Serum osmolality reflects the concentration of osmoles in serum water.
        Calculated estimates use sodium, urea nitrogen, glucose, and sometimes
        alcohols.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Serum osmolality formula
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        {SOURCE_NOTE} Worked example: Na 140, BUN 14, glucose 90, ethanol 37
        mg/dL → 300 mOsm/kg H₂O.
      </p>

      <h2
        id="gap"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Osmotic gap
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Osmotic (osmolar) gap ≈ measured − calculated osmolality. Enter a real
        measured value to see the gap; a placeholder 0 does not create a gap.
      </p>

      <div id="sosm-faq" className="not-prose mt-8">
        <FAQAccordion items={SERUM_OSMOLALITY_FAQS} />
      </div>
    </article>
  );
}
