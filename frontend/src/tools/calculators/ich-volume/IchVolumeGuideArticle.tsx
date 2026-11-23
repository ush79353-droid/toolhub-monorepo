import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { ICH_VOLUME_FAQS } from './content';
import { SOURCE_LABEL } from './calculation';

export function IchVolumeGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        ICH Volume Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Estimate intracerebral hemorrhage volume from axial CT using the bedside
        ABC/2 ellipsoid formula (or ABC/3 for irregular shapes).
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        ABC/2 and ABC/3
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Measure the largest diameter (A) and the perpendicular diameter (B) on
        the slice with the greatest hematoma area. Convert slice thickness to
        centimeters and form C from slice count (or weighted counts). Volume ≈
        A×B×C/2 for ellipsoid or round hematomas; ÷3 when marked irregular,
        separated, or multinodular.
      </p>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
        {SOURCE_LABEL}
      </p>

      <h2
        id="weighted"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Weighted Slices
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Optional Kothari weighting compares each slice to the largest-area
        slice: ≥75% counts as 1, 25–75% as 0.5, and &lt;25% as 0. Do not add
        those counts on top of a separate total slice number — use one C path.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter length and width in cm on the largest axial slice.</li>
        <li>Enter slice thickness in mm and the number of slices (or area bands).</li>
        <li>Choose ellipsoid/round (ABC/2) or irregular (ABC/3).</li>
        <li>Open Result to read estimated volume in mL.</li>
      </ol>

      <h2
        id="limits"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limits and Safety
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Bedside formulas can diverge from planimetry for large, irregular, or
        anticoagulated bleeds. This tool does not recommend surgery, reversal,
        or blood-pressure targets.
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
            href="/tools/cerebral-perfusion-pressure-calculator"
            className="text-primary hover:underline"
          >
            Cerebral Perfusion Pressure Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/grace-calculator"
            className="text-primary hover:underline"
          >
            GRACE Calculator
          </Link>
        </li>
      </ul>

      <div id="ich-faq" className="mt-10">
        <h2 className="text-lg font-bold tracking-tight text-accent sm:text-xl">
          Frequently Asked Questions
        </h2>
        <div className="mt-4">
          <FAQAccordion items={[...ICH_VOLUME_FAQS]} />
        </div>
      </div>
    </article>
  );
}
