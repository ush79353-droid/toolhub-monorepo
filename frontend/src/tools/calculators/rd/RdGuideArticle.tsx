import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { RD_FAQS } from './content';

export function RdGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        RD Calculator — Recurring Deposit
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Use our RD Calculator to estimate maturity value, total deposits, and
        interest for a fixed monthly recurring deposit. The model follows a
        common Indian/Pakistani bank convention: monthly deposits with quarterly
        compounding. Money fields support independent currency conversion via
        stored FX rates.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        RD Formula
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>i = r / 400</p>
        <p>n = months / 3</p>
        <p>M = R × [(1+i)^n − 1] / [1 − (1+i)^(−1/3)]</p>
        <p>Total deposits = R × months</p>
        <p>Interest = M − total deposits</p>
      </div>

      <h2
        id="how-to"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter the monthly deposit and choose its currency.</li>
        <li>Set the RD term in years or months.</li>
        <li>Enter the annual interest rate percent.</li>
        <li>Read total deposits, interest, and maturity (each with its own currency).</li>
      </ol>

      <h2
        id="example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Worked Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Monthly deposit PKR 5,000 for 5 years at 6% annual (quarterly
        compounding) deposits PKR 300,000 in total and matures near PKR 350,000
        (interest near PKR 50,000), depending on rounding display.
      </p>

      <h2
        id="compounding"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Compounding Convention
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Deposits are modeled at month-end. Interest compounds quarterly using
        i = r/400. This is not simple interest and not the same as SIP monthly
        compounding. Bank products may use slightly different day-count or
        payout rules; treat results as estimates.
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
            href="/tools/sip-calculator-systematic-investment-plan"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            SIP Calculator — Systematic Investment Plan
          </Link>
        </li>
      </ul>

      <h2
        id="rd-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion faqs={[...RD_FAQS]} />
      </div>
    </article>
  );
}
