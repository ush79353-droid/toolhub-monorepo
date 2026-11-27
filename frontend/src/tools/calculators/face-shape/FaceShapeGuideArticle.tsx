import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { FACE_SHAPE_FAQS } from './content';
import {
  JAWLINE_PROXY_CAVEAT,
  METHODOLOGY_NOTE,
} from './calculation';

export function FaceShapeGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Face Shape Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Estimate a styling-oriented face-shape label from forehead, cheek, jawline-proxy,
        and face-length measurements. {METHODOLOGY_NOTE} Feature sharpness adjusts a
        few round vs angular rules only.
      </p>

      <h2
        id="shapes"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Seven face shapes
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Possible labels: oval, round, oblong, square, triangle (pear), diamond, and
        heart. Overlapping profiles return the first match in the ordered rule list below.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Omega heuristic rules
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Convert all inputs to centimeters. Let F=forehead width, C=cheeks width,
        J=jawline length (proxy), L=face length, and rLF=L/C.
      </p>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90">
        <li>
          <strong>Heart:</strong> F ≥ 1.05×C (equal F/C counts when widths match exactly),
          J ≤ 0.92×C, L ≥ 1.25×C.
        </li>
        <li>
          <strong>Diamond:</strong> C ≥ 1.05×F and ≥ 1.05×J, L ≥ 1.2×C, sharpness not
          round.
        </li>
        <li>
          <strong>Triangle (pear):</strong> J ≥ 1.08×C and ≥ 1.05×F, L ≥ 1.15×C.
        </li>
        <li>
          <strong>Square:</strong> |F−C|/C ≤ 0.06, |C−J|/C ≤ 0.08, rLF ≤ 1.35, sharpness
          not round.
        </li>
        <li>
          <strong>Round:</strong> |F−C|/C ≤ 0.08, |C−J|/C ≤ 0.10, rLF ≤ 1.28, and sharp
          roundness or rLF ≤ 1.22.
        </li>
        <li>
          <strong>Oblong:</strong> rLF ≥ 1.45 with balanced F/C/J within 12% spread.
        </li>
        <li>
          <strong>Oval:</strong> 1.28 ≤ rLF &lt; 1.45, C ≥ 0.95×F and ≥ 0.95×J.
        </li>
        <li>
          <strong>Fallback:</strong> soft oval with “closest match” note.
        </li>
      </ol>

      <h2
        id="measurements"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to measure
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        {JAWLINE_PROXY_CAVEAT} Use a flexible tape in cm or inches. Face length runs from
        hairline to chin; cheek width is the broadest cheekbone span; forehead width is
        the broadest forehead span.
      </p>

      <h2
        id="fs-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="not-prose mt-4">
        <FAQAccordion items={FACE_SHAPE_FAQS} />
      </div>
    </article>
  );
}