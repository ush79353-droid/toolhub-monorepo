import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { PISA_FAQS } from './content';
import { SOURCE_LABEL } from './calculation';

export function PisaGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        PISA Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Estimate proximal isovelocity surface area, volume flow rate, mitral
        valve area (stenosis path), effective regurgitant orifice area, and
        regurgitant volume with optional α/180 leaflet correction. Educational
        only — not a severity grade or treatment order.
      </p>

      <h2
        id="what-is"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is PISA?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Color Doppler aliasing forms a proximal convergence shell. For a
        hemisphere, surface area is 2πr². Multiplying by aliasing speed (Vr)
        gives instantaneous flow. Dividing by peak jet velocity (Vmax) yields
        orifice area. In mitral stenosis, a leaflet opening angle α scales the
        shell by α/180.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Formulas Used
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <strong>PISA</strong> = 2π r² × (α / 180) (cm²; blank α → 180°)
        </li>
        <li>
          <strong>VFR</strong> = PISA × Vr (mL/s with cm units)
        </li>
        <li>
          <strong>MVA / EROA</strong> = VFR / Vmax (cm²; mm² = 100 × cm²)
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
        <li>Enter PISA radius (r) and aliasing speed (Vr).</li>
        <li>
          Optionally enter α (degrees). Leave blank for a full hemisphere
          (180°).
        </li>
        <li>Add Vmax for MVA and EROA; add VTI for regurgitant volume.</li>
        <li>
          Use unit selectors to change display units; physical values convert
          when you switch units on inputs.
        </li>
      </ol>

      <h2
        id="example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Worked Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        r = 1 cm, Vr = 40 cm/s, α = 180°, Vmax = 500 cm/s, VTI = 100 cm → PISA ≈
        6.283 cm², VFR ≈ 251.33 mL/s, MVA/EROA ≈ 0.503 cm² (≈ 50.3 mm²), RVol ≈
        50.3 mL/beat.
      </p>

      <h2
        id="limits"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limits and Safety
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Assumes hemispheric geometry with optional α/180 scaling.</li>
        <li>Does not grade MR or MS severity or choose anticoagulation.</li>
        <li>Zero or missing Vmax leaves orifice area blank (no division).</li>
        <li>Entries stay in your browser; share uses the public page URL only.</li>
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
            href="/tools/eroa-mitral-regurgitation-calculator"
            className="text-primary underline-offset-2 hover:underline"
          >
            EROA - Mitral Regurgitation Calculator
          </Link>
        </li>
      </ul>

      <h2
        id="pisa-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="not-prose mt-4">
        <FAQAccordion faqs={[...PISA_FAQS]} />
      </div>
    </article>
  );
}
