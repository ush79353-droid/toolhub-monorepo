import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { GUPTA_RISK_FAQS } from './content';
import { SOURCE_LABEL, CREATININE_HIGH_THRESHOLD_MG_DL } from './calculation';

export function GuptaRiskGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Gupta Risk Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Enter preoperative factors to see the Gupta MICA estimate—the
        percentage risk of myocardial infarction or cardiac arrest within 30
        days after surgery. The tool is educational only and does not replace
        institutional risk assessment or shared decision-making with a clinician.
      </p>

      <h2
        id="what-is"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is the Gupta MICA Model?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Gupta and colleagues derived a logistic model from the American College
        of Surgeons National Surgical Quality Improvement Program (NSQIP) to
        predict serious cardiac complications after noncardiac surgery. The MICA
        endpoint combines myocardial infarction and cardiac arrest. This
        calculator reproduces the Table 2 coefficients for the published web
        risk calculator.
      </p>

      <h2
        id="inputs"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Model Inputs
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <strong>Age</strong> — years (model validated for adults; minimum 16).
        </li>
        <li>
          <strong>Functional status</strong> — totally independent, partially
          dependent, or totally dependent.
        </li>
        <li>
          <strong>ASA class</strong> — physical status I through V.
        </li>
        <li>
          <strong>Creatinine</strong> — measured value (mg/dL or µmol/L), or
          explicit “not measured.”
        </li>
        <li>
          <strong>Procedure</strong> — NSQIP procedure category (hernia is the
          reference category).
        </li>
      </ul>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Risk Is Calculated
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Log-odds L = −5.25 + 0.02×age + F + A + K + P, where F, A, K, and P are
        the functional, ASA, creatinine, and procedure coefficients from Table 2.
        The displayed MICA risk is 100/(1+e<sup>−L</sup>). Creatinine
        categories use mg/dL: at or below {CREATININE_HIGH_THRESHOLD_MG_DL}{' '}
        (0), above (+0.61), or not measured (−0.10).
      </p>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
        Primary source: {SOURCE_LABEL}
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use the Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter age in years.</li>
        <li>Select functional status and ASA class.</li>
        <li>
          Enter creatinine or check “not measured” if serum creatinine was not
          available preoperatively.
        </li>
        <li>Choose the closest procedure category.</li>
        <li>Read the MICA score (%) when all required fields are valid.</li>
      </ol>

      <h2
        id="example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Worked Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Age 50, totally independent, ASA I, creatinine 1.0 mg/dL, anorectal
        procedure yields a low MICA percentage because protective ASA and
        procedure coefficients outweigh the small age contribution. Raising ASA
        class or creatinine above 1.5 mg/dL increases the estimate.
      </p>

      <h2
        id="limits"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limits and Safety
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Population models can misestimate risk for an individual patient.
        Emergency surgery, recent PCI, active cardiac symptoms, and local
        protocol may require different tools. Do not use this page to withhold
        or delay urgent care. Inputs are not stored server-side; share only the
        public page URL.
      </p>

      <h2
        id="related"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related Calculators
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <Link href="/tools/duke-treadmill-score-calculator">
            Duke Treadmill Score Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/cha2ds2-vasc-calculator">
            CHA₂DS₂-VASc Calculator
          </Link>
        </li>
      </ul>

      <h2
        id="gupta-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion items={[...GUPTA_RISK_FAQS]} />
      </div>
    </article>
  );
}