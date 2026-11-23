import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { EDD_FAQS } from './content';
import { SOURCE_LABEL } from './calculation';

export function EddGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        EDD Calculator — Estimated Date of Delivery
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Compare educational due-date estimates from last menstrual period and
        ultrasound gestational age. The tool shows each method&apos;s EDD and
        gestational age as of a current date, plus the day difference when both
        methods are available.
      </p>

      <h2
        id="methods"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        LMP and Ultrasound Methods
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <strong>LMP</strong> — add 280 days to the first day of the last
          period, then adjust by (cycle length − 28).
        </li>
        <li>
          <strong>Ultrasound</strong> — from the scan date, add 280 days minus
          the reported gestational age in days (7 × weeks + days).
        </li>
      </ul>

      <h2
        id="cycle"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Cycle Length Adjustment
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Regular cycles from 21–45 days adjust only the LMP EDD. Ultrasound EDD
        never receives a cycle offset, even though the reference UI places the
        cycle control near the ultrasound fields.
      </p>

      <h2
        id="comparison"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Comparing Gestational Ages
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        For each available EDD, gestational days as of the current date equal
        280 − (EDD − current date). The difference is ultrasound age minus LMP
        age in whole days, with an explicit direction label.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Confirm or change the current date.</li>
        <li>Enter LMP and/or ultrasound date with weeks and days.</li>
        <li>Select average cycle length (affects LMP only).</li>
        <li>Read each EDD, ages, and the difference when both exist.</li>
      </ol>

      <h2
        id="example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Worked Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        LMP <strong>2026-01-01</strong> · cycle <strong>28</strong> → LMP EDD{' '}
        <strong>2026-10-08</strong>. Ultrasound <strong>2026-03-01</strong> at{' '}
        <strong>8w 0d</strong> → US EDD <strong>2026-10-11</strong>. As of{' '}
        <strong>2026-04-01</strong>, LMP age is slightly ahead of the ultrasound
        age (difference labeled toward LMP).
      </p>

      <h2
        id="limits"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limits and Safety
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        ACOG clinical practice decides when ultrasound dating should revise an
        LMP EDD. This calculator never silently prefers one method. IVF dating,
        irregular cycles outside 21–45 days, and care plans are out of scope.
      </p>
      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
        Source: {SOURCE_LABEL}
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
            href="/tools/due-date-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Due Date Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/conception-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Conception Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/reverse-due-date-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Reverse Due Date Calculator
          </Link>
        </li>
      </ul>

      <h2
        id="edd-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-3">
        <FAQAccordion faqs={[...EDD_FAQS]} />
      </div>
    </article>
  );
}
