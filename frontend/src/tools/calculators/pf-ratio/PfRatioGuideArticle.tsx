import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { PF_RATIO_FAQS, SOURCE_LABEL } from './content';

export function PfRatioGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        PF Ratio Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Compute the PaO₂/FiO₂ (Horovitz) index from an arterial blood gas and
        inspired oxygen fraction. Educational only — not a diagnosis.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Formula
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        P/F = PaO₂ ÷ FiO₂, where FiO₂ is expressed as a fraction (40% → 0.40).
        Example: 80 mmHg on 40% oxygen → 80 ÷ 0.40 = 200 mmHg.
      </p>

      <h2
        id="interpretation"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Interpretation
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Berlin Definition educational bands use P/F ≤300 (mild), ≤200
        (moderate), and ≤100 mmHg (severe) together with timing, imaging,
        edema origin, and PEEP context. The ratio alone does not establish
        ARDS.
      </p>

      <h2
        id="limits"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limits
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Zero FiO₂ is rejected. Alternate pressure units (mmHg/kPa) convert the
        same physical PaO₂. This worksheet does not adjust for altitude, shunt
        fraction, or ventilator settings.
      </p>
      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
        Source: {SOURCE_LABEL}
      </p>

      <h2
        id="pf-ratio-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion faqs={[...PF_RATIO_FAQS]} />
      </div>
    </article>
  );
}
