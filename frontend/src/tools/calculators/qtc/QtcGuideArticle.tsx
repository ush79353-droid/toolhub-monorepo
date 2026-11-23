import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { QTC_FAQS, QTC_SOURCE_NOTE } from './content';

export function QtcGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        QTc Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Correct a measured QT interval for heart rate using Bazett’s formula.
        Enter QT and either heart rate or RR — the linked rate fields stay
        synchronized. Optional Fridericia, Framingham, and Hodges values appear
        in the collapsed panel.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Bazett Formula
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>RR (seconds) = 60 ÷ heart rate (bpm), or measured RR ÷ 1000 when entered in ms.</li>
        <li>QTc (ms) = QT (ms) ÷ √RR.</li>
        <li>At 60 bpm, RR = 1 s, so Bazett QTc equals the measured QT.</li>
      </ul>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
        Primary sources: {QTC_SOURCE_NOTE}
      </p>

      <h2
        id="other-methods"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Other Correction Methods
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Fridericia: QT ÷ ∛RR.</li>
        <li>Framingham (Sagie): QT + 0.154 × (1 − RR) with QT in seconds (implemented as ms + 154 × (1 − RR)).</li>
        <li>Hodges: QT + 1.75 × (HR − 60) with QT in ms.</li>
      </ul>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use the Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter the measured QT interval (ms or s).</li>
        <li>Enter heart rate in bpm, or enter RR and let heart rate sync.</li>
        <li>Read Bazett QTc; expand other methods to compare.</li>
      </ol>

      <h2
        id="example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Worked Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        QT 400 ms at 60 bpm → RR 1000 ms → Bazett QTc 400 ms. At 120 bpm, RR is
        500 ms; Bazett QTc rises because √RR is smaller.
      </p>

      <h2
        id="limits"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limits and Safety
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Bazett over-corrects at high rates and under-corrects at low rates.
        Measurement lead, T-wave morphology, and drugs matter clinically. This
        page does not diagnose long or short QT syndrome and does not recommend
        therapy.
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
            href="/tools/ecg-boxes-to-seconds-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            ECG Boxes to Seconds Calculator
          </Link>
        </li>
      </ul>

      <div id="qtc-faq" className="mt-8">
        <h2 className="text-lg font-bold tracking-tight text-accent sm:text-xl">
          Frequently Asked Questions
        </h2>
        <div className="mt-4">
          <FAQAccordion items={[...QTC_FAQS]} />
        </div>
      </div>
    </article>
  );
}
