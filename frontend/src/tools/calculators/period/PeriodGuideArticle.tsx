import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { PERIOD_FAQS } from './content';
import { SOURCE_LABEL } from './calculation';

export function PeriodGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Period Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Estimate upcoming period dates, a fertile window, and ovulation day from
        your average cycle length, period length, and last period start.
      </p>

      <h2
        id="method"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Calendar Method
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Next period starts are spaced by your cycle length from the last period
        start. Bleeding spans are inclusive. Ovulation uses cycle day (length −
        14); the fertile window is the six days ending that day — the same
        convention as the Ovulation Calculator.
      </p>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
        {SOURCE_LABEL}
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Set cycle duration (default 28 days).</li>
        <li>Set period duration (default 6 days).</li>
        <li>Enter the first day of your last period.</li>
        <li>Read the next three periods, fertile window, and ovulation day.</li>
      </ol>

      <h2
        id="limits"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limits and Safety
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Irregular cycles, illness, and contraception change timing. This tool is
        not contraception and does not diagnose fertility problems.
      </p>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm">
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
            href="/tools/conception-calculator"
            className="text-primary hover:underline"
          >
            Conception Calculator
          </Link>
        </li>
      </ul>

      <div id="period-faq" className="mt-10">
        <h2 className="text-lg font-bold tracking-tight text-accent sm:text-xl">
          Frequently Asked Questions
        </h2>
        <div className="mt-4">
          <FAQAccordion items={[...PERIOD_FAQS]} />
        </div>
      </div>
    </article>
  );
}
