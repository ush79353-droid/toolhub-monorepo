import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { PEAK_FLOW_FAQS, SOURCE_LABEL } from './content';

export function PeakFlowGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Peak Flow Calculator — Estimated Peak Expiratory Flow
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Estimate predicted peak expiratory flow (PEF) from sex, age, height, and
        legacy ethnicity categories, then compare a measured PEF with the
        estimate and with a personal best. Educational only.
      </p>

      <h2
        id="prediction"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Predicted PEF equations
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Caucasian, African-American, and Mexican-American predictions use
        Hankinson NHANES III 1999 PEF equations in L/s (ages 8–80). The “Other”
        category uses Nunn &amp; Gregg 1989 adult equations (PEF in L/min, ages
        15–85), converted to L/s for consistent display.
      </p>

      <h2
        id="ratios"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Ratios and variability
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        % of estimated PEF = measured ÷ predicted × 100. % of personal best =
        measured ÷ personal best × 100. Diurnal variability uses amplitude
        percent mean: (max − min) ÷ ((max + min) / 2) × 100.
      </p>

      <h2
        id="limits"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limits
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Ethnicity categories are historical NHANES III labels retained for
        equation selection only. This worksheet does not replace spirometry,
        asthma action plans, or clinician interpretation of personal-best zones.
      </p>
      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
        Source: {SOURCE_LABEL}
      </p>

      <h2
        id="peak-flow-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion faqs={[...PEAK_FLOW_FAQS]} />
      </div>
    </article>
  );
}
