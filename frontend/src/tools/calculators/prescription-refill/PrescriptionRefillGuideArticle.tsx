import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { PRESCRIPTION_REFILL_FAQS } from './content';
import { SOURCE_LABEL } from './calculation';

export function PrescriptionRefillGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Prescription Refill Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Enter the fill date, quantity dispensed, and fixed units taken per day to
        see days of supply, the last covered calendar day, and the next supply
        date. This is an educational worksheet — not pharmacy authorization.
      </p>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
        Reference note: the attached screenshot showed a peptide syringe tool by
        mistake. Functional scope follows the refill date-arithmetic brief, not
        peptide reconstitution.
      </p>

      <h2
        id="how-it-works"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How It Works
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        On a fixed prescribed schedule, days of supply equal the dispensed count
        divided by how many units you take each day. The calculator then walks
        forward on the calendar (date-only, no clock time or DST) to the last day
        that supply covers and the day after — the educational next supply date.
        PRN / as-needed labels are excluded because they have no fixed daily rate.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Date Arithmetic
      </h2>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-foreground/90">
        <li>
          <strong>Days supplied</strong> = quantity dispensed ÷ units per day
          (must be a whole number)
        </li>
        <li>
          <strong>Last covered day</strong> = fill date + days supplied − 1
        </li>
        <li>
          <strong>Next supply date</strong> = fill date + days supplied
        </li>
      </ul>
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
        Fill <strong>2026-01-15</strong>, quantity <strong>30</strong>, units per
        day <strong>1</strong> → <strong>30</strong> days supplied → last covered{' '}
        <strong>2026-02-13</strong> → next supply <strong>2026-02-14</strong>{' '}
        (crosses month end). A 30-day supply starting on 31 January still uses the
        same add-days rule across February.
      </p>

      <h2
        id="limits"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limits
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Insurers, early-refill windows, controlled-substance rules, and pharmacy
        policy can allow or block refills earlier or later than this calendar.
        Partial / fractional day supplies are rejected rather than guessed. Do not
        use this tool for PRN schedules or as dispensing authorization.
      </p>

      <h2
        id="related"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related Calculators
      </h2>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-foreground/90">
        <li>
          <Link
            href="/tools/medicine-3-times-a-day-calculator"
            className="text-primary"
          >
            Medicine 3 Times a Day Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/drug-half-life-calculator" className="text-primary">
            Drug Half-Life Calculator
          </Link>
        </li>
      </ul>

      <h2
        id="prescription-refill-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion items={PRESCRIPTION_REFILL_FAQS} />
      </div>
    </article>
  );
}
