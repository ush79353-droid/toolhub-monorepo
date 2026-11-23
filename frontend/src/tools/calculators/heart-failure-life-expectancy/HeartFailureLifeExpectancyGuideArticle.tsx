import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { SOURCE_LABEL } from './calculation';
import { HEART_FAILURE_LIFE_EXPECTANCY_FAQS } from './content';

export function HeartFailureLifeExpectancyGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Heart Failure Life Expectancy Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This tool applies the MAGGIC 13-variable integer risk score for
        patients with heart failure and maps the total to published 1-year and
        3-year survival probabilities. Survival is reported as 100% minus the
        table probability of death — not as years of life remaining.
      </p>

      <h2
        id="maggic"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        MAGGIC Risk Score
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Pocock and colleagues converted a multivariable Poisson model into an
        integer chart (Figure 2): ejection fraction bands, age and systolic
        pressure rows that depend on EF, BMI, creatinine, NYHA class, sex,
        smoking, diabetes, COPD, heart-failure duration, and prescriptions for
        beta-blockers and ACE inhibitors or ARBs.
      </p>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
        {SOURCE_LABEL}
      </p>

      <h2
        id="survival"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Survival Probabilities
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Table 4 links each integer score from 0 to 50 to a 1-year and 3-year
        probability of all-cause death. This calculator displays survival as the
        complement of those published mortality values. Scores above 50 are
        outside the tabulated range.
      </p>

      <h2
        id="inputs"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Inputs and EF Interactions
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        BMI is derived from height and weight. Creatinine can be entered in mg/dL
        or µmol/L (Figure 2 bins use µmol/L). Age and systolic blood pressure
        integer extras follow three EF columns: below 30%, 30–39%, and 40% or
        higher, reflecting the published age×EF and SBP×EF interactions.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use the Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter demographics, BMI drivers, labs, vitals, and NYHA class.</li>
        <li>
          Tick history items only when they apply — especially prescriptions and
          heart failure longer than 18 months.
        </li>
        <li>
          Read the integer risk score and survival percentages when every
          required field is valid.
        </li>
      </ol>

      <h2
        id="limits"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limits and Safety
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Educational prognostic mapping — not individualized medical advice.</li>
        <li>Model cohorts date from 1980–2006; modern therapy may differ.</li>
        <li>Does not output years of life remaining or life expectancy in years.</li>
      </ul>

      <h2
        id="related"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related Calculators
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <Link href="/tools/ejection-fraction-calculator">
            Ejection Fraction Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/cardiac-output-calculator">
            Cardiac Output Calculator
          </Link>
        </li>
      </ul>

      <h2
        id="heart-failure-life-expectancy-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion items={[...HEART_FAILURE_LIFE_EXPECTANCY_FAQS]} />
      </div>
    </article>
  );
}