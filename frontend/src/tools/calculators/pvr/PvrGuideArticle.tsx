import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { PVR_FAQS, PVR_SOURCE_NOTE } from './content';

export function PvrGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        PVR Calculator - Pulmonary Vascular Resistance
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Enter mean pulmonary arterial pressure, left atrial pressure (or a
        documented wedge-pressure surrogate), and cardiac output to see
        pulmonary vascular resistance in dyn·s·cm⁻⁵ or Wood units. Values stay
        in your browser; share uses the page URL only.
      </p>

      <h2
        id="what-is"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is Pulmonary Vascular Resistance?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Pulmonary vascular resistance describes the pressure drop across the
        pulmonary circulation divided by blood flow. Teaching formulas frame it
        as driving pressure (mPAP − LAP) over cardiac output. This page only
        performs that arithmetic.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        PVR Formula and Units
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <strong>Wood units (WU)</strong> = (mPAP − LAP) / CO, with pressures in
          mmHg and CO in L/min.
        </li>
        <li>
          <strong>dyn·s·cm⁻⁵</strong> = Wood units × 80.
        </li>
        <li>
          Pressure fields accept <strong>mmHg</strong> or <strong>kPa</strong>;
          values convert before math so the physical pressure is preserved.
        </li>
      </ul>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
        Primary sources: {PVR_SOURCE_NOTE}
      </p>

      <h2
        id="lap-context"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        LAP and Wedge-Pressure Surrogates
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Direct left atrial pressure is not always available. Pulmonary capillary
        wedge pressure (PCWP / PAWP) is often used as a surrogate. Enter the
        number that matches your measurement context and keep that label with
        your clinical notes — the calculator does not invent or transform a
        wedge value.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use the Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter mean pulmonary arterial pressure and choose mmHg or kPa.</li>
        <li>
          Enter left atrial pressure (or a documented PCWP/PAWP surrogate) with
          its unit.
        </li>
        <li>Enter cardiac output in L/min.</li>
        <li>
          Read PVR in dyn·s·cm⁻⁵ (default) or switch the result to Wood units.
        </li>
      </ol>

      <h2
        id="example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Worked Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        mPAP 30 mmHg, LAP 10 mmHg, CO 5 L/min → Wood units = (30 − 10) / 5 = 4;
        dyn·s·cm⁻⁵ = 4 × 80 = 320.
      </p>

      <h2
        id="limits"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limits and Safety
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Zero cardiac output and a non-positive (mPAP − LAP) gradient leave the
        result blank. This tool is for information purposes only; PVR should be
        calculated separately and double-checked by a health care provider. It
        is not a diagnosis or treatment recommendation.
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
            href="/tools/cardiac-index-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Cardiac Index Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/cardiac-output-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Cardiac Output Calculator
          </Link>
        </li>
      </ul>

      <div id="pvr-faq" className="mt-10">
        <h2 className="text-lg font-bold tracking-tight text-accent sm:text-xl">
          Frequently Asked Questions
        </h2>
        <div className="mt-4">
          <FAQAccordion faqs={[...PVR_FAQS]} />
        </div>
      </div>
    </article>
  );
}
