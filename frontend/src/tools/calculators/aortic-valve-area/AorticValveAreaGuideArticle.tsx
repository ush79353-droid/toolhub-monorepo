import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { AORTIC_VALVE_AREA_FAQS } from './content';
import { SOURCE_LABEL } from './calculation';

export function AorticValveAreaGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Aortic Valve Area Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Estimate aortic valve area from LVOT diameter and two velocity-time
        integrals using the continuity equation. The tool is educational: it
        does not diagnose stenosis or recommend valve intervention.
      </p>

      <h2
        id="what-is"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is AVA?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Aortic valve area (AVA) is an estimate of the effective orifice through
        which blood leaves the left ventricle. Doppler echocardiography commonly
        derives AVA when direct planimetry is unavailable or uncertain.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Continuity Equation
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Flow through the LVOT equals flow through the aortic valve. With a
        circular LVOT assumption:
      </p>
      <p className="mt-2 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        AVA = π × (d<sub>cm</sub> / 2)² × VTI<sub>LVOT</sub> / VTI<sub>AV</sub>
      </p>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
        Primary framing: {SOURCE_LABEL}
      </p>

      <h2
        id="vti-labels"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        VTI₁ and VTI₂
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <strong>VTI₁</strong> — LVOT stroke distance (proximal flow proxy).
        </li>
        <li>
          <strong>VTI₂</strong> — transaortic jet stroke distance (must be
          positive).
        </li>
      </ul>

      <h2
        id="severity"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Severity Table
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The calculator shows the reference educational bands (&lt;1 severe;
        1–1.5 moderate; 1.5–3 mild; &gt;3 normal). Boundaries are resolved so
        1.0–1.5 cm² map to moderate and values above 1.5 up to 3 cm² map to
        mild. ACC/AHA 2020 typically cites severe AS with AVA ≤1.0 cm² but
        stresses that peak velocity and mean gradient also define severity;
        discordant studies need more than area alone.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use the Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter LVOT diameter (mm or cm).</li>
        <li>Enter VTI₁ (LVOT) and VTI₂ (transaortic jet).</li>
        <li>Read AVA and the educational severity highlight.</li>
        <li>Use Reload or Clear to restore blanks; Share copies the page URL only.</li>
      </ol>

      <h2
        id="example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Worked Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        LVOT 20 mm (2 cm), VTI₁ 20 cm, VTI₂ 80 cm → CSA = π × 1² ≈ 3.1416 cm² →
        AVA ≈ 3.1416 × 20 / 80 ≈ <strong>0.7854 cm²</strong> (educational severe
        band under the &lt;1 cm² row).
      </p>

      <h2
        id="limits"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limits and Safety
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Assumes a circular LVOT and aligned Doppler samples.</li>
        <li>Does not incorporate indexed AVA, velocity, or mean gradient.</li>
        <li>Not for individualized clinical decision-making.</li>
        <li>Measurements are not stored or shared in URLs.</li>
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
            href="/tools/cardiac-output-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Cardiac Output Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/ejection-fraction-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Ejection Fraction Calculator
          </Link>
        </li>
      </ul>

      <div id="ava-faq" className="mt-10">
        <h2 className="text-lg font-bold tracking-tight text-accent sm:text-xl">
          Frequently Asked Questions
        </h2>
        <div className="mt-4">
          <FAQAccordion items={[...AORTIC_VALVE_AREA_FAQS]} />
        </div>
      </div>
    </article>
  );
}
