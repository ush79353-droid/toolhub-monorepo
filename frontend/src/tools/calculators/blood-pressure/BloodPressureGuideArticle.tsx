import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { BLOOD_PRESSURE_FAQS } from './content';
import { ACC_AHA_SOURCE, ESC_ESH_2018_SOURCE } from './calculation';

export function BloodPressureGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Blood Pressure Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Enter a systolic and diastolic reading in mmHg, choose an American or
        European office-BP table, and see which educational category that single
        pair maps to. The tool is for learning published cut-offs — it is not a
        diagnosis and it does not replace clinical measurement protocols.
      </p>

      <h2
        id="what-it-does"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What This Calculator Does
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Blood pressure is written as systolic over diastolic (for example
        120/80 mmHg). Society guidelines group those numbers into named bands
        used in teaching and office workflows. This calculator applies the
        selected table to the values you type and reports the category plus a
        short measurement-context note.
      </p>

      <h2
        id="guidelines"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        ACC/AHA vs ESC/ESH Tables
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <strong>American (ACC and AHA)</strong> — Normal (&lt;120 and &lt;80),
          Elevated (120–129 and &lt;80), Stage 1 (130–139 or 80–89), Stage 2
          (≥140 or ≥90), plus Severe when SBP &gt;180 and/or DBP &gt;120.
        </li>
        <li>
          <strong>European (ESC and ESH)</strong> — 2018 joint Table 3:
          Optimal, Normal, High normal, Grades 1–3, and isolated systolic
          hypertension graded by SBP when DBP stays below 90. Later separate
          ESC or ESH editions are not applied here.
        </li>
      </ul>

      <h2
        id="how-classified"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How a Reading Is Classified
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Each number is placed in its table band, then the higher band is kept.
        Boundary inclusion follows the published wording (for example ACC/AHA
        Normal uses exclusive &lt;120 / &lt;80; ESC/ESH Grade 3 uses inclusive
        ≥180 / ≥110). If systolic is not higher than diastolic, a warning is
        shown while the category is still computed.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Select American (ACC and AHA) or European (ESC and ESH).</li>
        <li>Enter systolic and diastolic values in mmHg.</li>
        <li>Read the category, explanation, and context note below the form.</li>
        <li>Use Reload for defaults or Clear to wipe edits.</li>
      </ol>

      <h2
        id="example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Worked Examples
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <strong>118/76</strong> (ACC/AHA) → Normal.
        </li>
        <li>
          <strong>125/78</strong> (ACC/AHA) → Elevated; same numbers on ESC/ESH
          2018 → Normal.
        </li>
        <li>
          <strong>150/85</strong> (ESC/ESH 2018) → Isolated systolic
          hypertension (Grade 1).
        </li>
        <li>
          <strong>135/95</strong> (either table) → Stage 1 / Grade 1 because
          diastolic pulls the higher band.
        </li>
      </ul>

      <h2
        id="limits"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limits and Safety
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Guidelines define hypertension from averaged office readings, not one
        casual pair. Pregnancy, children, home/ambulatory monitoring, and
        treatment decisions are out of scope. Severe readings with emergency
        symptoms need urgent clinical care — this page cannot triage you.
      </p>
      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
        Sources: {ACC_AHA_SOURCE} {ESC_ESH_2018_SOURCE}
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
            href="/tools/bmi-calculator-body-mass-index"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            BMI Calculator – Body Mass Index
          </Link>
        </li>
        <li>
          <Link
            href="/tools/body-fat-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Body Fat Calculator
          </Link>
        </li>
      </ul>

      <h2
        id="bp-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-3">
        <FAQAccordion faqs={[...BLOOD_PRESSURE_FAQS]} />
      </div>
    </article>
  );
}
