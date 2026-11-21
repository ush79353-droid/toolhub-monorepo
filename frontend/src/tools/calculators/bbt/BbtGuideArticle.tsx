import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { BBT_FAQS } from './content';
import { K_CELSIUS_PER_HOUR, MAX_CORRECTION_ABS_MINUTES } from './types';

export function BbtGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        BBT Calculator | Basal Body Temperature
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Use this calculator when you take a basal body temperature earlier or
        later than your usual wake time. It applies a published educational
        linear timing correction so one off-schedule reading is easier to place
        on a chart. It does not confirm ovulation and is not medical advice.
      </p>

      <h2
        id="what-is-bbt"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is Basal Body Temperature?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Basal body temperature is your resting temperature measured immediately
        after waking, before activity. Fertility-awareness methods look for a
        sustained post-ovulatory rise, but that interpretation needs a full
        charting method—not a single adjusted point from this tool.
      </p>

      <h2
        id="why-adjust"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Why Adjust for Timing?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Resting temperature tends to drift upward the longer you remain in bed.
        A reading taken an hour late can look warmer for timing reasons alone.
        A conservative teaching rule shifts the reading back toward your usual
        check time so day-to-day comparisons stay more consistent.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Adjustment Formula
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        With times expressed in hours and k = {K_CELSIUS_PER_HOUR} °C per hour
        (0.05 °C per 30 minutes):
      </p>
      <p className="mt-2 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        adjusted = measured − k × (actual − usual)
      </p>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Equivalently, temperature difference (°C) = (time difference in minutes
        ÷ 30) × 0.05, where time difference = usual − actual. Overnight gaps use
        the shortest signed path within ±12 hours. Corrections outside ±
        {MAX_CORRECTION_ABS_MINUTES / 60} hours are not applied.
      </p>

      <h2
        id="units"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Celsius and Fahrenheit
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Absolute temperatures convert with °F = °C × 9/5 + 32. Temperature
        differences use the 9/5 scale factor only—the +32 offset belongs on
        absolute readings, not on deltas.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use the Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter your usual basal check time in hours and minutes.</li>
        <li>Enter today’s actual check time.</li>
        <li>Enter the measured temperature and choose °C or °F.</li>
        <li>
          Read the adjusted temperature and temperature difference. Optionally
          open the timing summary for the signed time gap and steps.
        </li>
      </ol>

      <h2
        id="example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Worked Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Usual time 06:30, actual time 07:00, measured 36.60 °C. The reading is
        30 minutes late, so the correction is −0.05 °C and the adjusted value is
        36.55 °C.
      </p>

      <h2
        id="limits"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limits and Safety
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This is an educational heuristic, not a diagnosis. Fever, alcohol, short
        sleep, shift work, and medications can dominate small timing effects.
        Do not use basal temperature alone as contraception. Inputs are not
        stored by Omega Calculators; share actions copy the public page link
        only.
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
            href="/tools/pregnancy-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Pregnancy Calculator
          </Link>{' '}
          (when available in the catalog)
        </li>
        <li>
          <Link
            href="/tools"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Browse all calculators
          </Link>
        </li>
      </ul>

      <div id="bbt-faq" className="mt-10">
        <h2 className="text-lg font-bold tracking-tight text-accent sm:text-xl">
          Frequently Asked Questions
        </h2>
        <div className="mt-4">
          <FAQAccordion faqs={[...BBT_FAQS]} />
        </div>
      </div>
    </article>
  );
}
