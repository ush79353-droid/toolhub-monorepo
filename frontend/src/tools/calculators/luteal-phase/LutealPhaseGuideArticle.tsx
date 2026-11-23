import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { LUTEAL_PHASE_FAQS } from './content';
import { SOURCE_LABEL } from './calculation';

export function LutealPhaseGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Luteal Phase Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Enter your ovulation date and the first day of the next menstrual period
        to see how many calendar days make up the luteal phase for that cycle.
      </p>

      <h2
        id="how-it-works"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How It Works
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The luteal phase runs from ovulation until the day before the next period
        begins clinically; this calculator reports the calendar span from
        ovulation to the first day of that next period using date-only math (no
        clock time or DST).
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Day Count Convention
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <strong>Luteal phase days = period start date − ovulation date</strong>{' '}
        on the calendar. That is elapsed calendar days, not “whole days strictly
        between” the two events (which would subtract one). Example: ovulation 10
        November and period 24 November → <strong>14 days</strong>.
      </p>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
        {SOURCE_LABEL}
      </p>

      <h2
        id="example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Worked Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Ovulation <strong>2026-11-10</strong>, next period{' '}
        <strong>2026-11-24</strong> → luteal phase{' '}
        <strong>14 days</strong>. A leap-day span (for example 28 Feb 2024 to 1
        Mar 2024) still uses plain calendar subtraction.
      </p>

      <h2
        id="limits"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limits
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Ovulation timing from apps, LH tests, or ultrasound may disagree with the
        date you enter. Very short or long spans may warrant clinical review;
        this tool does not diagnose luteal phase defect or infertility.
      </p>

      <h2
        id="related"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related Calculators
      </h2>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-foreground/90">
        <li>
          <Link href="/tools/conception-calculator" className="text-primary">
            Conception Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/gestational-age-calculator" className="text-primary">
            Gestational Age Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/edd-calculator" className="text-primary">
            EDD Calculator
          </Link>
        </li>
      </ul>

      <h2
        id="luteal-phase-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion items={LUTEAL_PHASE_FAQS} />
      </div>
    </article>
  );
}