import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { OVULATION_FAQS } from './content';
import { SOURCE_LABEL } from './calculation';

export function OvulationGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Ovulation Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Estimate ovulation timing, a fertile window, and a possible due date
        from your average cycle length and the first day of your last period.
        Results are approximate calendar teaching aids only.
      </p>

      <h2
        id="what-is"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Timing Is Estimated
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Natural fertility guidance commonly describes a fertile window in the
        days leading up to ovulation. This tool uses a fixed luteal-phase
        assumption (ovulation fourteen days before the next period) and shows
        three cycles so you can plan ahead.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Formulas Used
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          Cycle <em>k</em> start = LMP + <em>k</em> × cycle length (k = 0, 1, 2)
        </li>
        <li>
          Ovulation = cycle start + (length − 15) days → cycle day (length − 14)
        </li>
        <li>
          Fertile window = ovulation − 5 days through ovulation (six days)
        </li>
        <li>Due date ≈ ovulation + 266 days</li>
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
        <li>Enter your average cycle duration (default 28 days).</li>
        <li>Enter the first day of your last period.</li>
        <li>Expand second/third cycle panels as needed.</li>
      </ol>

      <h2
        id="example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Worked Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        LMP = 2026-01-01 with a 28-day cycle → ovulation{' '}
        <strong>2026-01-14</strong>, fertile window{' '}
        <strong>2026-01-09 – 2026-01-14</strong>, due date ≈{' '}
        <strong>2026-10-07</strong>.
      </p>

      <h2
        id="limits"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limits and Safety
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Irregular cycles, illness, and hormones shift ovulation. This calculator
        is not contraception, not infertility care, and not pregnancy dating by
        ultrasound.
      </p>

      <h2
        id="related"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related Calculators
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <Link href="/tools/conception-calculator">Conception Calculator</Link>
        </li>
        <li>
          <Link href="/tools/period-calculator">Period Calculator</Link>
        </li>
        <li>
          <Link href="/tools/edd-calculator-estimated-date-of-delivery">
            EDD Calculator
          </Link>
        </li>
      </ul>

      <h2
        id="ovulation-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion faqs={[...OVULATION_FAQS]} />
      </div>
    </article>
  );
}
