import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { TIMI_STEMI_FAQS } from './content';

const SOURCE_LABEL =
  'Morrow DA et al. TIMI risk score for ST-elevation myocardial infarction: a convenient, bedside, clinical score for risk assessment at presentation. Circulation. 2000;102(17):2031–2037.';

export function TimiStemiGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        TIMI Score for STEMI Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Total the TIMI risk score for ST-elevation myocardial infarction from
        age and published bedside factors. The tool is educational and does not
        order reperfusion or other therapy.
      </p>

      <h2
        id="what-is"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is the TIMI STEMI Score?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Morrow and colleagues derived a simple integer score from the InTIME II
        fibrinolytic-eligible STEMI cohort to estimate 30-day mortality at
        presentation. Ten weighted predictors sum to a score from 0 to 14 with a
        graded mortality risk.
      </p>

      <h2
        id="points"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Point Weights
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Age &lt;65: 0; 65–74: 2; ≥75: 3</li>
        <li>
          +1: diabetes, hypertension, or angina (combined); time to treatment
          &gt;4 hours; weight &lt;67 kg; anterior ST elevation or LBBB
        </li>
        <li>+2: heart rate &gt;100 bpm; Killip class II–IV</li>
        <li>+3: SBP &lt;100 mmHg</li>
      </ul>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
        Primary source: {SOURCE_LABEL}
      </p>

      <h2
        id="mortality"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        30-Day Mortality Bands
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Observed InTIME II 30-day mortality by score: 0 → 0.8%; 1 → 1.6%; 2 →
        2.2%; 3 → 4.4%; 4 → 7.3%; 5 → 12.4%; 6 → 16.1%; 7 → 23.4%; 8 → 26.8%;
        &gt;8 → 35.9%. These bands apply to the derivation cohort framing only.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use the Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Choose an age band (required before a score appears).</li>
        <li>Tick any of the five history/exam factors that apply.</li>
        <li>Set Killip II–IV and anterior ST elevation/LBBB (default No).</li>
        <li>Read the live total and educational 30-day mortality band.</li>
        <li>Share copies the page URL only—never clinical answers.</li>
      </ol>

      <h2
        id="example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Worked Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Age &lt;65 with no other factors → <strong>0</strong> · educational
        30-day mortality <strong>0.8%</strong>. Age ≥75 alone →{' '}
        <strong>3</strong> · <strong>4.4%</strong>.
      </p>

      <h2
        id="limits"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limits and Safety
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Derived in fibrinolytic-eligible STEMI (InTIME II); not a PCI-era triage order.</li>
        <li>Does not recommend reperfusion strategy or medications.</li>
        <li>
          Screenshot age “&gt; 75” maps to published ≥75 (+3); weight label shows
          150 lbs with the published &lt;67 kg cutoff.
        </li>
        <li>Answers are not stored or embedded in share URLs.</li>
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
            href="/tools/heart-score-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            HEART Score Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/dapt-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            DAPT Calculator
          </Link>
        </li>
      </ul>

      <div id="timi-stemi-faq" className="mt-10">
        <h2 className="text-lg font-bold tracking-tight text-accent sm:text-xl">
          Frequently Asked Questions
        </h2>
        <div className="mt-4">
          <FAQAccordion items={[...TIMI_STEMI_FAQS]} />
        </div>
      </div>
    </article>
  );
}
