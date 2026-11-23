import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { LMP_BASE_GESTATION_DAYS } from '../due-date/types';
import { GESTATIONAL_AGE_FAQS } from './content';
import { SOURCE_LABEL } from './calculation';

export function GestationalAgeGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Gestational Age Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Enter an estimated due date and a current date to see how many completed
        gestational weeks and days that dating implies — the same 280-day
        convention used across Omega&apos;s pregnancy dating tools.
      </p>

      <h2
        id="how-it-works"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How It Works
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The calculator counts whole calendar days between your current date and
        the EDD, adds that difference to {LMP_BASE_GESTATION_DAYS} (40 weeks),
        and converts the total into weeks plus leftover days. All math is
        date-only so daylight saving and clock time do not affect the result.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Dating Formula
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Gestational days ≈ {LMP_BASE_GESTATION_DAYS} + (current date − EDD).
        Equivalently: {LMP_BASE_GESTATION_DAYS} − (EDD − current date). When the
        current date is on the EDD, the result is 40 weeks 0 days.
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
        If the EDD is 1 July and today is 24 June (7 calendar days before the
        EDD), gestational days = 280 − 7 = 273 →{' '}
        <strong>39 weeks 0 days</strong>. If the current date equals the EDD,
        the result is <strong>40 weeks 0 days</strong>.
      </p>

      <h2
        id="limits"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limits
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Educational EDD-based dating only — not CRL or biparietal ultrasound tables.</li>
        <li>
          Dates before the implied last menstrual period for the entered EDD show
          0 weeks until counting would be positive.
        </li>
        <li>Not a substitute for prenatal care, growth scans, or delivery planning.</li>
      </ul>

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
          </Link>{' '}
          — derive EDD from LMP or conception.
        </li>
        <li>
          <Link
            href="/tools/crown-rump-length-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Crown–Rump Length Calculator
          </Link>{' '}
          — first-trimester ultrasound dating.
        </li>
        <li>
          <Link
            href="/tools/conception-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Conception Calculator
          </Link>{' '}
          — estimated conception from due date or LMP.
        </li>
      </ul>

      <h2
        id="gestational-age-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion items={GESTATIONAL_AGE_FAQS} />
      </div>
    </article>
  );
}