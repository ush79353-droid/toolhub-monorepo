import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { ECG_BOXES_FAQS } from './content';

const SOURCE_LABEL =
  'Standard ECG paper geometry: 1 mm small / 5 mm large horizontal boxes; common speeds 25 and 50 mm/s (AHA/ACC ECG recording conventions as taught in clinical ECG primers).';

export function EcgBoxesToSecondsGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        ECG Boxes to Seconds Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Count small or large squares on an ECG strip and convert that horizontal
        span into seconds (or milliseconds / minutes). The tool uses standard
        paper geometry: 1 mm small boxes, 5 mm big boxes, and 25 or 50 mm/s
        paper speed.
      </p>

      <h2
        id="what-is"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What This Calculator Does
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        It answers “how long is this interval on the paper?” It does not
        interpret rhythms, measure amplitudes, or estimate heart rate from
        cycles per minute.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Formula and Paper Standards
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Duration (seconds) = (number of boxes × box width in mm) ÷ paper speed
        (mm/s). Small width = 1 mm; big width = 5 mm. Five small boxes equal one
        big box, so five small boxes at the same speed match one big box.
      </p>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Source note: {SOURCE_LABEL}
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter how many boxes span the interval.</li>
        <li>Choose Small (1 mm) or Big (5 mm).</li>
        <li>Select the recording paper speed (25 or 50 mm/s).</li>
        <li>Read duration; switch sec / ms / min without changing the interval.</li>
      </ol>

      <h2
        id="example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Worked Examples
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>1 small box at 25 mm/s → 1 × 1 ÷ 25 = 0.04 s.</li>
        <li>1 big box at 50 mm/s → 1 × 5 ÷ 50 = 0.10 s.</li>
        <li>5 small boxes at 25 mm/s → 0.20 s (same as 1 big box at 25 mm/s).</li>
      </ul>

      <h2
        id="limits"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limits and Safety
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Assumes undistorted standard grid paper and the selected speed. Skewed
        photocopies, nonstandard paper, or misread speeds produce wrong times.
        This is an educational timing aid, not clinical advice.
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
            href="/tools/ecg-heart-rate-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            ECG Heart Rate Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/seconds-converter"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Seconds Converter
          </Link>
        </li>
      </ul>

      <h2
        id="ecg-boxes-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion faqs={[...ECG_BOXES_FAQS]} />
      </div>
    </article>
  );
}
