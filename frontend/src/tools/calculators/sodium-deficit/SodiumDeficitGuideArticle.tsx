import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { SODIUM_DEFICIT_FAQS } from './content';
import { SOURCE_NOTE } from './calculation';

export function SodiumDeficitGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Sodium Deficit Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Estimate the sodium amount associated with raising serum sodium toward a
        chosen target using a demographic total-body-water fraction. Educational
        only — not a laboratory report, diagnosis, or saline prescription.
      </p>

      <h2
        id="what-is"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What is sodium deficit?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        In hyponatremia teaching, sodium deficit is the estimated quantity of
        sodium (mmol) missing relative to a desired concentration, assuming a
        fixed TBW. Real patients have ongoing losses, volume disorders, and
        osmotic shifts this model ignores.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What&apos;s the sodium deficit formula?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        {SOURCE_NOTE} Worked example (Omni FAQ): adult female 55 kg, serum 125
        mEq/L, desired 140 → TBW 27.5 L → deficit = 27.5 × 15 = 412.5 mmol.
      </p>

      <h2
        id="limits"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limits of the estimate
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        When serum sodium is already above the desired target, the signed result
        is out of scope for this hyponatremia worksheet. Overcorrection risk
        (including osmotic demyelination) means rate limits belong to the
        treating clinician — this tool never invents an infusion schedule.
      </p>

      <div id="nad-faq" className="not-prose mt-8">
        <FAQAccordion items={SODIUM_DEFICIT_FAQS} />
      </div>
    </article>
  );
}
