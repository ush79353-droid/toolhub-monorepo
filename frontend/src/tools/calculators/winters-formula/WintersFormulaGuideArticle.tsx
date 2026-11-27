import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { WINTERS_FORMULA_FAQS } from './content';
import { SOURCE_NOTE } from './calculation';

export function WintersFormulaGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Winters&apos; Formula Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Estimate the expected compensatory pCO₂ range in metabolic acidosis from
        bicarbonate. Educational only — not a measured ABG value.
      </p>

      <h2
        id="what-is"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What is Winters&apos; equation?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Winters&apos; formula relates serum bicarbonate to the expected
        respiratory compensation (pCO₂) during metabolic acidosis.
      </p>

      <h2
        id="how"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to calculate
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        {SOURCE_NOTE} Example: HCO₃ 12 mmol/L → expected 26 mmHg (range 24–28).
      </p>

      <h2
        id="range"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Compensation range
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The ±2 mmHg teaching band is shown under Range limits. Compare expected
        values with measured arterial pCO₂ separately.
      </p>

      <div id="wf-faq" className="not-prose mt-8">
        <FAQAccordion items={WINTERS_FORMULA_FAQS} />
      </div>
    </article>
  );
}
