import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { ECG_HR_FAQS, ECG_HR_SOURCE_NOTE } from './content';

export function EcgHeartRateGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        ECG Heart Rate Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Measure the distance between two consecutive R peaks and convert it to
        beats per minute using the ECG paper speed. Enter millimeters or time,
        or count small/big boxes — the linked fields stay synchronized.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How BPM Is Calculated
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Duration (s) = R–R distance (mm) ÷ paper speed (mm/s).</li>
        <li>BPM = 60 ÷ duration (s).</li>
        <li>
          At 25 mm/s, four big boxes (20 mm) → 0.8 s → 75 bpm (the familiar 300 ÷
          4 shortcut).
        </li>
      </ul>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
        Primary sources: {ECG_HR_SOURCE_NOTE}
      </p>

      <h2
        id="boxes"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Millimeters vs Boxes
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Small boxes are 1 mm; big boxes are 5 mm. Choosing seconds or
        milliseconds enters <em>time</em>, not paper distance — the calculator
        converts with the selected speed so the box count remains consistent.
      </p>

      <h2
        id="irregular"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Irregular Rhythms
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A single R–R interval is only an instantaneous estimate. When intervals
        vary, clinicians typically count QRS complexes over a timed strip (for
        example 6 seconds × 10). This page does not implement that method.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use the Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter the R–R distance in mm (or duration in s/ms).</li>
        <li>Or count small/big boxes between consecutive R waves.</li>
        <li>Confirm paper speed (25 or 50 mm/s).</li>
        <li>Read the estimated BPM.</li>
      </ol>

      <h2
        id="example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Worked Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <strong>20 mm</strong> at <strong>25 mm/s</strong> → 0.8 s →{' '}
        <strong>75 bpm</strong>. The same strip is <strong>4 big boxes</strong>.
      </p>

      <h2
        id="limits"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limits and Safety
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Not a diagnosis or rhythm interpretation.</li>
        <li>Zero-length intervals are rejected.</li>
        <li>Assumes undistorted standard grid paper and the selected speed.</li>
      </ul>

      <h2
        id="related"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related Calculators
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <Link href="/tools/ecg-boxes-to-seconds-calculator">
            ECG Boxes to Seconds Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/cardiac-output-calculator">
            Cardiac Output Calculator
          </Link>
        </li>
      </ul>

      <h2
        id="ecg-hr-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion faqs={[...ECG_HR_FAQS]} />
      </div>
    </article>
  );
}
