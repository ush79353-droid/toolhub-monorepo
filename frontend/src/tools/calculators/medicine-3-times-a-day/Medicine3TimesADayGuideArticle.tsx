import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { MEDICINE_3_TIMES_A_DAY_FAQS } from './content';

export function Medicine3TimesADayGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Medicine 3 Times a Day Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Pick how many doses you take per day, enter the time of the first dose,
        and see evenly spaced later times. This is simple clock arithmetic for
        education — not a substitute for your prescription label.
      </p>

      <h2
        id="how-it-works"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How It Works
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Around-the-clock modes divide 24 hours by the dose count (2 → 12 h, 3 →
        8 h, every-6-hours → 6 h) and add that interval from the first dose,
        wrapping past midnight when needed. The waking-hours four-dose mode
        instead spaces doses evenly across a fixed 15-hour waking window from
        first to last dose (about every 5 hours).
      </p>

      <h2
        id="modes"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Dosing Modes
      </h2>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-foreground/90">
        <li>
          <strong>2 doses</strong> — 12-hour around-the-clock interval.
        </li>
        <li>
          <strong>3 doses</strong> — 8-hour around-the-clock interval (24 ÷ 3).
          Not every “TID” label requires this; confirm with your clinician.
        </li>
        <li>
          <strong>4 doses (waking hours)</strong> — four times across a 15-hour
          waking window (educational QID daytime spacing).
        </li>
        <li>
          <strong>4 doses (every 6 hours)</strong> — strict q6h around the
          clock; one dose may fall overnight.
        </li>
      </ul>

      <h2
        id="example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Worked Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Mode <strong>3 doses</strong>, first dose <strong>07:00 AM</strong> →
        second <strong>03:00 PM</strong>, third <strong>11:00 PM</strong>{' '}
        (every 8 hours). Four waking-hours doses from 07:00 AM → 12:00 PM, 5:00
        PM, 10:00 PM. Every 6 hours from 07:00 AM → 1:00 PM, 7:00 PM, 1:00 AM.
      </p>

      <h2
        id="limits"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limits
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The tool does not adjust for food, empty-stomach rules, drug
        interactions, or hospital standard administration times. Waking-hours
        spacing uses a fixed 15-hour educational window — not your personal
        wake and bedtime. Always follow the label and ask a pharmacist when
        unsure.
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
            href="/tools/drug-half-life-calculator"
            className="text-primary"
          >
            Drug Half-Life Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/prescription-refill-calculator"
            className="text-primary"
          >
            Prescription Refill Calculator
          </Link>
        </li>
      </ul>

      <h2
        id="medicine-3-times-a-day-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-3">
        <FAQAccordion faqs={[...MEDICINE_3_TIMES_A_DAY_FAQS]} />
      </div>
    </article>
  );
}
