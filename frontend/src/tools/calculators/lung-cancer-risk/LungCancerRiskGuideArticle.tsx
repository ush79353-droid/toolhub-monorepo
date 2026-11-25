import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { DISCLAIMER, LUNG_CANCER_RISK_FAQS, SOURCE_LABEL } from './content';

export function LungCancerRiskGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Lung Cancer Risk Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Estimate absolute lung cancer risk at 6 and 16 years using the HUNT
        ever-smoker model (Markaki et al.). Educational only — not screening
        advice or a diagnosis.
      </p>

      <h2
        id="how-it-works"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How the HUNT model works
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The worksheet combines sex, age, BMI, pack-years, cigarettes per day,
        years since quitting, indoor secondhand smoke hours, and daily cough.
        Pack-years = (cigarettes per day ÷ 20) × smoking years. Natural logs use
        ln(x+1) per the 2022 corrigendum.
      </p>

      <h2
        id="quitting"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Quitting and risk
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Years since quitting enter as ln(years+1); longer abstinence lowers
        predicted risk but never-smokers are outside the published validation
        cohort. Enter 0 if you still smoke.
      </p>

      <h2
        id="limits"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limits
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        {DISCLAIMER} Risks apply to adult ever-smokers within the HUNT
        derivation range (roughly ages 21–86). This tool does not recommend CT
        screening or replace clinician judgment.
      </p>
      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
        Source: {SOURCE_LABEL}
      </p>

      <h2
        id="lung-cancer-risk-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion faqs={[...LUNG_CANCER_RISK_FAQS]} />
      </div>
    </article>
  );
}