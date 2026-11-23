import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { ARTERIAL_AGE_FAQS } from './content';
import { INTERCEPT, SLOPE, SOURCE_LABEL } from './calculation';

export function ArterialAgeGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Arterial Age Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Enter an Agatston coronary artery calcium (CAC) score to see the MESA
        arterial-age estimate used in cardiovascular teaching. Optional
        chronologic age is shown only for comparison. This tool is educational
        and does not diagnose disease or recommend treatment.
      </p>

      <h2
        id="what-is"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is Arterial Age?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        McClelland and colleagues estimated arterial age as the chronologic age
        that carries the same short-term coronary heart disease risk as the
        observed CAC in the Multi-Ethnic Study of Atherosclerosis (MESA). It
        translates Agatston units into an age-like scale patients and clinicians
        can discuss more easily.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        MESA Formula
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Arterial age Â = {INTERCEPT} + {SLOPE} × ln(CAC + 1), where ln is the
        natural logarithm (explicit in the paper). Coefficients are fixed; your
        entered chronologic age never modifies them.
      </p>

      <h2
        id="cac-zero"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        CAC of Zero
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A calcium score of 0 is supported. Because ln(1) = 0, arterial age equals
        the intercept {INTERCEPT} years (about 39 years when rounded). That is
        the risk-equivalent age for zero CAC in this model — not an average age
        of people with zero calcium.
      </p>

      <h2
        id="uncertainty"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Uncertainty (95% CI)
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The paper publishes approximate 95% confidence intervals for selected CAC
        values (Table 1). When your CAC matches a table row exactly, this
        calculator shows that published interval. Otherwise it reports the point
        estimate and refers you to the table for nearby scores rather than
        inventing interpolated bounds.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use the Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter your Agatston calcium score (non-negative).</li>
        <li>Optionally enter chronologic age in years for a comparison note.</li>
        <li>
          Read the arterial age (and Table 1 95% CI when CAC matches a published
          row).
        </li>
      </ol>

      <h2
        id="example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Worked Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        CAC 100 → ln(101) ≈ 4.61512 → arterial age ≈ {INTERCEPT} + {SLOPE} ×
        4.61512 ≈ 72.56 years (displayed 73). Table 1 lists 73 years with 95% CI
        71–74. CAC 0 → ≈ {INTERCEPT} years (displayed 39; Table 1 CI 32–46).
      </p>

      <h2
        id="limits"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limits and Safety
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          Derived in MESA adults 45–84 years free of clinical CVD at baseline;
          short-term CHD risk context.
        </li>
        <li>
          Does not generalize to stroke or heart-failure risk the same way.
        </li>
        <li>Not a Framingham or ASCVD risk calculator by itself.</li>
        <li>Not medical advice — discuss CAC with a qualified clinician.</li>
      </ul>

      <h2
        id="related"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related Calculators
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <Link
            href="/tools/bmi-calculator-body-mass-index"
            className="font-medium text-primary hover:underline"
          >
            BMI Calculator – Body Mass Index
          </Link>
        </li>
        <li>
          <Link
            href="/tools/body-fat-calculator"
            className="font-medium text-primary hover:underline"
          >
            Body Fat Calculator
          </Link>
        </li>
      </ul>

      <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
        Source: {SOURCE_LABEL}
      </p>

      <div id="arterial-age-faq" className="mt-10">
        <h2 className="text-lg font-bold tracking-tight text-accent sm:text-xl">
          Frequently Asked Questions
        </h2>
        <div className="mt-4">
          <FAQAccordion faqs={[...ARTERIAL_AGE_FAQS]} />
        </div>
      </div>
    </article>
  );
}
