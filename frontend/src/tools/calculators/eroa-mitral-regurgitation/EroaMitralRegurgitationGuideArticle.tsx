import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { EROA_FAQS } from './content';
import { SOURCE_LABEL } from './calculation';

export function EroaMitralRegurgitationGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        EROA - Mitral Regurgitation Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Estimate instantaneous regurgitant flow, effective regurgitant orifice
        area (EROA), and regurgitant volume with the proximal isovelocity
        surface area (PISA) method. Educational only.
      </p>

      <h2
        id="what-is"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is PISA EROA?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Color Doppler aliasing forms a proximal convergence shell. For a
        hemisphere, surface area is 2πr². Multiplying by aliasing speed gives
        instantaneous flow; dividing by peak jet velocity yields orifice area.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Formulas Used
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <strong>Flow</strong> = 2π r² Va (mL/s with cm units)
        </li>
        <li>
          <strong>EROA</strong> = flow / Vmax
        </li>
        <li>
          <strong>RVol</strong> = EROA × VTI (mL/beat)
        </li>
      </ul>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
        Primary sources: {SOURCE_LABEL}
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use the Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter aliasing speed and PISA radius for flow.</li>
        <li>Add maximal MR velocity for EROA.</li>
        <li>Add VTI for regurgitant volume per beat.</li>
      </ol>

      <h2
        id="example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Worked Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        r = 1 cm, Va = 40 cm/s, Vmax = 500 cm/s, VTI = 100 cm → flow ≈{' '}
        <strong>251.33 mL/s</strong>, EROA ≈ <strong>0.503 cm²</strong>, RVol ≈{' '}
        <strong>50.27 mL/beat</strong>.
      </p>

      <h2
        id="limits"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limits and Safety
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Vmax must be positive. Non-hemispheric or constrained jets violate the
        2πr² assumption. This tool does not classify mild/moderate/severe MR.
      </p>

      <h2
        id="related"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related Calculators
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <Link href="/tools/aortic-valve-area-calculator">
            Aortic Valve Area Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/cardiac-output-calculator">
            Cardiac Output Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/ejection-fraction-calculator">
            Ejection Fraction Calculator
          </Link>
        </li>
      </ul>

      <h2
        id="eroa-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion faqs={[...EROA_FAQS]} />
      </div>
    </article>
  );
}
