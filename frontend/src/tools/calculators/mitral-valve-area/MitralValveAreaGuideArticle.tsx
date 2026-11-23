import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { MITRAL_VALVE_AREA_FAQS } from './content';
import { SOURCE_LABEL } from './calculation';

export function MitralValveAreaGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Mitral Valve Area Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Estimate mitral valve area from Doppler measurements using continuity,
        pressure half-time, or deceleration time. The tool is educational: it
        does not diagnose mitral stenosis or recommend intervention.
      </p>

      <h2
        id="what-is"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is MVA?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Mitral valve area (MVA) estimates the effective orifice of the mitral
        valve. Smaller areas with elevated gradients are associated with mitral
        stenosis in clinical practice; interpretation always needs imaging
        context.
      </p>

      <h2
        id="methods"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Calculation Methods
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <strong>Continuity equation</strong> — CSA = π(d/2)²; MVA = CSA ×
          LVOT VTI / mitral VTI.
        </li>
        <li>
          <strong>Pressure half-time</strong> — MVA = 220 / PHT (ms).
        </li>
        <li>
          <strong>Deceleration time</strong> — PHT ≈ 0.29 × DT; then MVA = 220 /
          PHT.
        </li>
      </ul>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
        Primary framing: {SOURCE_LABEL}
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use the Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Choose Continuity, Pressure half-time, or Deceleration time.</li>
        <li>Enter the measurements shown for that method (units optional).</li>
        <li>Read LVOT area (continuity) and mitral valve area as they update.</li>
        <li>Switching methods clears prior method-specific fields.</li>
      </ol>

      <h2
        id="example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Worked Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Continuity: LVOT diameter 2 cm, LVOT VTI 20 cm, mitral VTI 40 cm → LVOT
        area = π ≈ 3.142 cm² → MVA ≈ 1.571 cm². Pressure half-time 220 ms → MVA
        = 1 cm².
      </p>

      <h2
        id="limits"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limits and Safety
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Pressure half-time and deceleration estimates can fail with significant
        aortic regurgitation, tachycardia, or abnormal left atrial / ventricular
        compliance. Continuity assumes comparable stroke volumes without major
        intervening shunt or regurgitation. This calculator is not medical
        advice.
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
            href="/tools/aortic-valve-area-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Aortic Valve Area Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/gorlin-formula-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Gorlin Formula Calculator
          </Link>
        </li>
      </ul>

      <div id="mva-faq" className="mt-10">
        <h2 className="text-lg font-bold tracking-tight text-accent sm:text-xl">
          Frequently Asked Questions
        </h2>
        <div className="mt-4">
          <FAQAccordion faqs={[...MITRAL_VALVE_AREA_FAQS]} />
        </div>
      </div>
    </article>
  );
}
