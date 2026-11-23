import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { HAS_BLED_FAQS } from './content';
import { SOURCE_LABEL } from './calculation';

export function HasBledGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        HAS-BLED Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Estimate an educational HAS-BLED score (0–9) for major bleeding risk
        context in atrial fibrillation. Select Yes when each factor is present.
        The tool reports the score, risk band, and published incidence rates —
        not an anticoagulation order.
      </p>

      <h2
        id="factors"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Nine Scoring Factors
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Hypertension (SBP &gt;160); abnormal renal function; abnormal liver
        function; prior stroke; bleeding history/predisposition; labile INR;
        age &gt;65; alcohol &gt;8 drinks/week; drugs predisposing to bleeding
        (antiplatelet/NSAID). Renal/liver and drugs/alcohol each contribute
        separately.
      </p>

      <h2
        id="rates"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Bleeding Rates
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Events per 100 patient-years follow Pisters 2010 among patients on oral
        anticoagulation (for example score 0 ≈ 1.13). Scores 6–9 had too few
        patients for stable rates. Incidence rate is not the same as an
        individual’s absolute risk.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Leave each factor at No unless the criterion is present.</li>
        <li>Read the live score, risk band, and rate displays.</li>
        <li>Use Reload or Clear to restore defaults.</li>
      </ol>

      <h2
        id="example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Worked Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Hypertension + age &gt;65 + drugs predisposing to bleeding → score{' '}
        <strong>3</strong> (high-risk band) with about <strong>3.7</strong>{' '}
        bleeds per 100 patient-years in the Pisters OAC table.
      </p>

      <h2
        id="limits"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limits and Safety
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Validated in AF cohorts on warfarin-era data. Do not use alone for
        procedural bleeding or non-AF populations. Clinical judgment balances
        stroke and bleeding risk.
      </p>
      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
        Source: {SOURCE_LABEL}
      </p>

      <h2
        id="related"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related Calculators
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <Link
            href="/tools/cha2ds2-vasc-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            CHA2DS2-Vasc Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/blood-pressure-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Blood Pressure Calculator
          </Link>
        </li>
      </ul>

      <h2
        id="hasbled-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-3">
        <FAQAccordion faqs={[...HAS_BLED_FAQS]} />
      </div>
    </article>
  );
}
