import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { ANION_GAP_FAQS } from './content';
import { SOURCE_NOTE } from './calculation';

export function AnionGapGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Anion Gap Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Estimate the serum anion gap from sodium, chloride, and bicarbonate,
        with an optional potassium-aware albumin correction. Educational only —
        not a laboratory report.
      </p>

      <h2
        id="what"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What is anion gap?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The anion gap summarizes unmeasured anions relative to measured cations
        and anions. It is a scanning tool for metabolic acidosis patterns, not a
        standalone diagnosis.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How is the anion gap calculated?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        {SOURCE_NOTE} Example: Na 140, Cl 104, HCO₃ 24 → AG = 12 mEq/L.
      </p>

      <h2
        id="albumin"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Why correct for albumin?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Hypoalbuminemia lowers the observed gap and can mask a high-gap
        acidosis. The Figge correction adds about 2.5 mEq/L for each 1 g/dL that
        albumin is below 4.0 g/dL.
      </p>

      <div id="ag-faq" className="not-prose mt-8">
        <FAQAccordion items={ANION_GAP_FAQS} />
      </div>
    </article>
  );
}
