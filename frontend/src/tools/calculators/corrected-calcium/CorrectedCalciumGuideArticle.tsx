import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { CORRECTED_CALCIUM_FAQS } from './content';
import { SOURCE_NOTE } from './calculation';

export function CorrectedCalciumGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Corrected Calcium Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Enter total serum calcium and albumin to estimate an albumin-adjusted
        (“corrected”) total calcium. This is an educational worksheet — not a
        laboratory report, diagnosis, or treatment plan.
      </p>

      <h2
        id="what-is-corrected"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What is corrected calcium?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Much of circulating calcium is bound to albumin. When albumin is low,
        total calcium can look low even if the unbound fraction is closer to
        normal. Albumin-adjusted formulas estimate what the total calcium might
        be at a reference albumin (commonly 4.0 g/dL).
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Corrected calcium equation
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        {SOURCE_NOTE} Worked example: calcium 10 mg/dL with albumin 3 g/dL →
        10 + 0.8 × (4 − 3) = 10.8 mg/dL. With albumin 4 g/dL the correction is
        zero and corrected calcium equals the measured total.
      </p>

      <h2
        id="limits"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limits and ionized calcium
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Payne-style adjustments are population approximations. They can be
        unreliable in critical illness, acid–base disorders, paraproteinemia,
        and other states where ionized calcium measurement is preferred.
        Corrected total calcium is not a substitute for ionized calcium.
      </p>

      <div id="cca-faq" className="not-prose mt-8">
        <FAQAccordion items={CORRECTED_CALCIUM_FAQS} />
      </div>
    </article>
  );
}
