import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { CARDIAC_INDEX_FAQS } from './content';
import { SOURCE_NOTE } from './calculation';

export function CardiacIndexGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Cardiac Index Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Use this educational tool to compute cardiac index from a known cardiac
        output or from Fick-principle oxygen contents. It is for learning and
        arithmetic checks only — not bedside decision-making.
      </p>

      <h2
        id="what-is"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is Cardiac Index?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Cardiac index normalizes cardiac output to body size by dividing output
        (L/min) by body surface area (m²). Reporting L/min/m² lets clinicians
        compare flow across different body sizes; this calculator only performs
        that arithmetic.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Formulas Used
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <strong>Mosteller BSA</strong> — √(height<sub>cm</sub> × weight
          <sub>kg</sub> / 3600).
        </li>
        <li>
          <strong>Cardiac index</strong> — CI = CO / BSA (BSA kept at full
          precision in the division).
        </li>
        <li>
          <strong>Fick CO</strong> — CO = VO₂ / (CaO₂ − CvO₂) with contents in
          mL/L.
        </li>
        <li>
          <strong>O₂ content</strong> — (1.34 × Hb × Sat/100) + (0.0031 × PO₂)
          in mL/dL, then ×10 for mL/L.
        </li>
      </ul>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        {SOURCE_NOTE}
      </p>

      <h2
        id="modes"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Known Output vs Fick
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Choose <strong>Yes</strong> when you already know cardiac output — enter
        L/min plus height and weight. Choose <strong>No</strong> to estimate
        output with hemoglobin and arterial/venous saturation and tension.
        Switching modes clears fields that belong only to the other branch.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use the Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Select whether cardiac output is known.</li>
        <li>Enter height and weight (cm/in and kg/lb supported).</li>
        <li>
          For known output, enter CO in L/min. For Fick, complete hemoglobin and
          blood-gas panels; leave VO₂ blank to use the 125 × BSA estimate.
        </li>
        <li>Read cardiac index in L/min/m² in Results.</li>
      </ol>

      <h2
        id="example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Worked Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Cardiac output 5 L/min with BSA exactly 2 m² yields CI = 2.5 L/min/m².
        The engine does not round BSA before dividing.
      </p>

      <h2
        id="limits"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limits and Safety
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Estimated VO₂ and teaching constants are not a substitute for measured
        oxygen consumption or laboratory-calibrated content equations. Do not use
        this page to diagnose shock, titrate vasoactive drugs, or replace
        invasive/noninvasive monitoring.
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
            href="/tools/cardiac-output-calculator"
            className="font-medium text-primary hover:underline"
          >
            Cardiac Output Calculator
          </Link>{' '}
          — Fick-focused sibling when available.
        </li>
      </ul>

      <h2
        id="ci-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion faqs={[...CARDIAC_INDEX_FAQS]} />
      </div>
    </article>
  );
}
