import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { BODE_FAQS, DISCLAIMER, SOURCE_NOTE } from './content';

export function BodeIndexGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        BODE Index Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The BODE Index is a multidimensional COPD worksheet that combines body-mass
        index, airflow obstruction, dyspnea, and exercise capacity. This page
        reproduces the original point table for education only.
      </p>

      <h2
        id="what-is-bode"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What is the BODE Index?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        {SOURCE_NOTE}
      </p>

      <h2
        id="how-to-score"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to calculate BODE score
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Answer BMI over 21 (or confirm BMI ≤ 21), then choose FEV1 % predicted,
        6-minute walk distance, and mMRC dyspnea band. Points sum to 0–10. Walk
        cutoffs use publication equality: 350 m is the zero-point band; 349 m is
        one point.
      </p>

      <h2
        id="interpretation"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        BODE Index interpretation
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Higher scores were associated with higher mortality in the original
        cohort analyses. Do not treat a single score as an individual survival
        prediction. {DISCLAIMER}
      </p>

      <div id="bode-faq" className="not-prose mt-8">
        <FAQAccordion items={BODE_FAQS} />
      </div>
    </article>
  );
}
