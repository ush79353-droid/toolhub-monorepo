import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { AVERAGE_RETURN_FAQS } from './content';

export function AverageReturnGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-average-return"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What is average return?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Average return summarizes how an investment performed over time. Holding periods, cash-flow
 timing, and the chosen methodology all matter; different averages can describe the same
        history differently. Gains and losses must be interpreted with risk, fees, taxes, and
        inflation in mind.
      </p>

      <h2 id="what-is-arr" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        What is average rate of return?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Average rate of return (ARR) usually means an average annual investment return over a
        defined span. Related ideas include arithmetic averages, annualized conversions, geometric
        averages, money-weighted returns, and time-weighted returns. Simple ARR without cash flows
        does not automatically reflect deposits and withdrawals.
      </p>

      <h2
        id="what-is-cumulative"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What is cumulative return?
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Cumulative Return = ((1+R1)×(1+R2)×…×(1+Rn) − 1) × 100</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Cumulative return compounds sequential period returns. Negative periods reduce the product;
        holding lengths affect how you later annualize the overall result.
      </p>

      <h2
        id="average-vs-cumulative"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Average return vs. cumulative return
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        In this calculator’s second section, <strong>average annual return</strong> means the
        arithmetic average of each observation’s annualized return. <strong>Cumulative return</strong>{' '}
        compounds the period returns themselves. Example: 10%, −2%, and 15% sum to 23% if added, but
        compound to <strong>24.07%</strong>.
      </p>

      <h2
        id="cash-flow-method"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to calculate average return based on cash flow
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Build signed cash flows: −starting balance, −deposits, +withdrawals, +ending balance. Solve
        for the annualized rate r such that the discounted cash flows sum to zero (XIRR with a
        365-day year). A simple ending-minus-starting percentage ignores contribution timing and can
        misstate performance.
      </p>

      <h2
        id="average-cumulative-method"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to calculate average and cumulative return
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Convert each holding period to months (years × 12 + months).</li>
        <li>Annualize each period return: (1+R)^(12/M) − 1.</li>
        <li>Average those annualized returns arithmetically.</li>
        <li>Compound period returns for cumulative return.</li>
        <li>
          Optionally annualize the cumulative result over total months: (1+C)^(12/TotalMonths) − 1.
        </li>
      </ol>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Worked path for 10% (14 months), −2% (5 months), 15% (27 months): cumulative ≈ 24.07%.
      </p>

      <h2
        id="time-weighted"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What is the time-weighted rate of return?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Time-weighted return splits history at cash-flow dates, measures each subperiod, then links
        returns geometrically. It reduces the effect of contribution timing and is common for manager
        comparison. It is not the same as the money-weighted cash-flow section above.
      </p>

      <h2
        id="money-weighted"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What is the money-weighted rate of return?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Money-weighted return embeds starting value, ending value, and the size/timing of deposits
 and withdrawals. XIRR is the usual dated-cash-flow implementation: the method used in
        Section One of this tool.
      </p>

      <h2 id="limitations" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Limitations of average return calculations
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Methodology choice changes the number</li>
        <li>Inflation, taxes, and fees may be omitted</li>
        <li>Risk and volatility are not described by averages alone</li>
        <li>Cash-flow timing and unequal holding periods matter</li>
        <li>Past returns do not guarantee future results</li>
      </ul>

      <h2
        id="related-calculators"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related calculators
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <Link href="/tools/investment-calculator" className="text-primary hover:underline">
            Investment Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/interest-calculator" className="text-primary hover:underline">
            Interest Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/roi-calculator" className="text-primary hover:underline">
            ROI Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/compound-interest-calculator" className="text-primary hover:underline">
            Compound Interest Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/rate-of-return-calculator" className="text-primary hover:underline">
            Rate of Return Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/cagr-calculator" className="text-primary hover:underline">
            CAGR Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/annualized-return-calculator" className="text-primary hover:underline">
            Annualized Return Calculator
          </Link>
        </li>
      </ul>

      <h2
        id="average-return-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently asked questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...AVERAGE_RETURN_FAQS]} />
      </div>
    </article>
  );
}
