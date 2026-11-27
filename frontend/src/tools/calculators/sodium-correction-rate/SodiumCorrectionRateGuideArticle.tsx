import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { SODIUM_CORRECTION_RATE_FAQS } from './content';
import { SOURCE_NOTE } from './calculation';

export function SodiumCorrectionRateGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Sodium Correction Rate Calculator for Hypo- and Hypernatremia
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Estimate how far one liter of a chosen IV fluid is predicted to move
        serum sodium, and what infusion rate matches an aimed hourly change.
        Educational Adrogué–Madias worksheet only — not a laboratory report,
        diagnosis, or infusion order.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What&apos;s the rate of sodium correction formula?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        {SOURCE_NOTE} Worked example (Omni FAQ style): adult male 70 kg, serum
        120 mEq/L, 2% NaCl (342 mEq/L), aimed 0.5 mEq/L/h → TBW 42 L → ΔNa/L ≈
        5.16 → flow ≈ 97 mL/h.
      </p>

      <h2
        id="how-to"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How do I use the calculator?
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Select age/sex category (sets the TBW fraction).</li>
        <li>Enter weight and measured serum sodium.</li>
        <li>
          Choose a replacement fluid and the aimed hourly sodium change that
          appear after those inputs are valid.
        </li>
        <li>
          Read total body water, predicted ΔNa per liter, and estimated mL/h
          flow — then recheck labs in practice; the model ignores urine and
          other losses.
        </li>
      </ol>

      <div id="scr-faq" className="not-prose mt-8">
        <FAQAccordion items={SODIUM_CORRECTION_RATE_FAQS} />
      </div>
    </article>
  );
}
