import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { CPP_FAQS, CPP_SOURCE_NOTE } from './content';

export function CerebralPerfusionPressureGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Cerebral Perfusion Pressure Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Subtract intracranial pressure from mean arterial pressure to see
        cerebral perfusion pressure in millimeters of mercury. Optional cuff
        pressures estimate MAP when a measured MAP is unavailable. Age group
        only changes the educational literature band shown with the result.
      </p>

      <h2
        id="what-is"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is CPP?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Cerebral perfusion pressure (CPP) is the net pressure gradient that
        drives blood flow to the brain. Clinicians often discuss it alongside
        monitored MAP and ICP in critical care and neurosurgery teaching — this
        page only performs the arithmetic.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        CPP and MAP Formulas
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <strong>CPP</strong> = MAP − ICP (both in mmHg).
        </li>
        <li>
          <strong>Approximate MAP</strong> from blood pressure: (SBP + 2 × DBP)
          ÷ 3.
        </li>
        <li>
          The UI labels whether MAP is <em>measured/entered</em> or{' '}
          <em>calculated</em> from SBP/DBP.
        </li>
      </ul>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
        Primary sources: {CPP_SOURCE_NOTE}
      </p>

      <h2
        id="age-bands"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Age-Group Reference Bands
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Educational teaching tables commonly summarize age-linked CPP reference
        bands (for example 30–40 mmHg for ages 0–5, 35–50 for 6–11, 50–60 for
        12–17, and 60–80 for adults 18+). Those numbers are literature
        orientation aids. This calculator never converts them into treatment
        targets, alarms, or dosing advice.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use the Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Choose an age group for the educational reference band.</li>
        <li>
          Enter MAP in mmHg, or check the box to estimate MAP from SBP and DBP.
        </li>
        <li>Enter ICP in mmHg.</li>
        <li>Read CPP when both MAP and ICP are valid.</li>
      </ol>

      <h2
        id="example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Worked Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Adult · MAP <strong>90</strong> mmHg · ICP <strong>15</strong> mmHg →
        CPP = 90 − 15 = <strong>75</strong> mmHg. The adult educational band
        shown is 60–80 mmHg — still not a prescription to treat to that range.
      </p>

      <h2
        id="limits"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limits and Safety
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Not a substitute for invasive monitoring or clinical judgement.</li>
        <li>Does not recommend CPP goals, fluids, vasopressors, or ICP therapy.</li>
        <li>Estimated MAP from cuff pressures is an approximation.</li>
        <li>Pressure values never leave your browser via share or analytics.</li>
      </ul>

      <h2
        id="related"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related Calculators
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <Link href="/tools/blood-pressure-calculator">Blood Pressure Calculator</Link>
        </li>
        <li>
          <Link href="/tools/cardiac-output-calculator">Cardiac Output Calculator</Link>
        </li>
      </ul>

      <h2
        id="cpp-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion faqs={[...CPP_FAQS]} />
      </div>
    </article>
  );
}
