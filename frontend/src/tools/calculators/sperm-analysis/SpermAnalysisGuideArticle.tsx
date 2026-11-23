import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { SPERM_ANALYSIS_FAQS } from './content';
import { DISCLAIMER, SOURCE_NOTE } from './calculation';

export function SpermAnalysisGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Sperm Analysis Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Enter ejaculate volume and sperm concentration to compute total sperm,
        then optionally add morphology, motility, and vitality percentages for a
        product-based functional estimate. Educational use only — not a
        fertility diagnosis.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Total and Functional Sperm
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        {SOURCE_NOTE} Example: 3 mL × 20 million/mL = 60 million total sperm.
      </p>

      <h2
        id="motility"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Motility Input
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The screenshot field is labeled “Normal motility %”. This calculator
        uses that percentage as the motility fraction in the product model
        (teaching tools often use progressive motility). It does not emit WHO
        graded motility classes (A/B/C/D) or patient diagnoses such as
        asthenozoospermia.
      </p>

      <h2
        id="limits"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limits and Safety
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        {DISCLAIMER} Semen parameters fluctuate between samples; clinical
        interpretation usually uses repeated testing and a qualified clinician.
      </p>

      <h2
        id="sa-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion faqs={[...SPERM_ANALYSIS_FAQS]} />
      </div>
    </article>
  );
}
