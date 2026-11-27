import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { CORRECTED_MAGNESIUM_FAQS } from './content';
import { SOURCE_NOTE } from './calculation';

export function CorrectedMagnesiumGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Corrected Magnesium Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Enter serum magnesium and albumin to estimate an albumin-adjusted
        (“corrected”) magnesium. Educational worksheet — not a laboratory
        report or treatment plan.
      </p>

      <h2
        id="what-is"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What is corrected magnesium?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Low albumin can lower measured total magnesium even when free magnesium
        is closer to expected. Albumin-adjusted formulas estimate magnesium at a
        reference albumin (commonly 40 g/L).
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Magnesium correction for albumin
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        {SOURCE_NOTE} Worked example: 0.70 mmol/L with albumin 30 g/L → 0.75
        mmol/L (1.50 mEq/L).
      </p>

      <h2
        id="limits"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limits
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This is a population teaching adjustment, distinct from ionized
        magnesium measurement and from calcium Payne correction coefficients.
      </p>

      <div id="cmg-faq" className="not-prose mt-8">
        <FAQAccordion items={CORRECTED_MAGNESIUM_FAQS} />
      </div>
    </article>
  );
}
