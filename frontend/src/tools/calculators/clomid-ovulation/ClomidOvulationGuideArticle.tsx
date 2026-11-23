import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { CLOMID_OVULATION_FAQS } from './content';
import {
  OVULATION_OFFSET_MAX_DAYS,
  OVULATION_OFFSET_MIN_DAYS,
  SOURCE_LABEL,
} from './calculation';

export function ClomidOvulationGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Clomid Ovulation Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Enter the first day and inclusive length of a prescribed clomiphene
        (Clomid) course to see an approximate calendar window when ovulation is
        often described after treatment. This worksheet does not prove ovulation
        happened and does not choose dose or cycle day.
      </p>

      <h2
        id="what-it-does"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What This Calculator Does
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        It performs date-only arithmetic on the course you already have on paper.
        Treatment start defaults to today so the form matches a live session;
        duration stays blank until you enter the prescribed number of days.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Timing Formula
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Last treatment day = start + duration − 1. Approximate ovulation window
        = last day + {OVULATION_OFFSET_MIN_DAYS} through last day +{' '}
        {OVULATION_OFFSET_MAX_DAYS}.
      </p>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
        Source: {SOURCE_LABEL}
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Set treatment start to the first pill day on the prescription.</li>
        <li>Enter the inclusive duration in days (often 5).</li>
        <li>Read the approximate ovulation window in the ovulation field.</li>
      </ol>

      <h2
        id="example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Worked Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Start <strong>2026-01-01</strong>, duration <strong>5</strong> days →
        last treatment <strong>2026-01-05</strong> → approximate window{' '}
        <strong>01/10/2026 – 01/15/2026</strong>.
      </p>

      <h2
        id="limits"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limits and Safety
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Ultrasound, LH kits, progesterone labs, and trigger timing can move the
        true fertile days. Follow the clinician who prescribed clomiphene. This
        tool never stores your dates on our servers.
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
            href="/tools/ovulation-calculator"
            className="text-primary hover:underline"
          >
            Ovulation Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/pregnancy-calculator"
            className="text-primary hover:underline"
          >
            Pregnancy Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/bbt-calculator-basal-body-temperature"
            className="text-primary hover:underline"
          >
            BBT Calculator
          </Link>
        </li>
      </ul>

      <div id="clomid-faq" className="mt-10">
        <h2 className="text-lg font-bold tracking-tight text-accent sm:text-xl">
          Frequently Asked Questions
        </h2>
        <div className="mt-4">
          <FAQAccordion items={[...CLOMID_OVULATION_FAQS]} />
        </div>
      </div>
    </article>
  );
}
