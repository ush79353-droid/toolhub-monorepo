import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { LUMPSUM_FAQS } from './content';

export function LumpsumGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Lumpsum Calculator – Calculate Investment Returns
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This Lumpsum Calculator estimates the growth of a one-time investment
        under a nominal annual return, compounding frequency, term, and optional
        inflation rate. Switch modes to solve for initial capital, final balance,
        required return, or investment duration. Results are educational
        projections—not guaranteed investment outcomes.
      </p>

      <h2
        id="what-is-lumpsum"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is a Lumpsum Investment?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A lumpsum (lump-sum) investment places a single amount of capital into an
        asset or account and leaves it to compound. No scheduled top-ups are
        assumed unless you model them separately (for example with a SIP tool).
      </p>

      <h2
        id="what-is-calculator"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is a Lumpsum Calculator?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        It applies compound-interest mathematics so you can plan goals, compare
        compounding conventions, and see how inflation erodes purchasing power of
        a future balance.
      </p>

      <h2
        id="how-it-works"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Does a Lumpsum Calculator Work?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        You choose what to solve for, then supply the remaining inputs: principal
        or goal, nominal return, term (years or months), start date, inflation,
        and compounding frequency. The engine computes dependent outputs such as
        EAR, real FV, end date, and a yearly growth schedule.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Lumpsum Investment Formula
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>FV = PV (1 + r/n)^(n t)</p>
        <p>Continuous: FV = PV e^(r t)</p>
        <p>PV = FV / (1 + r/n)^(n t)</p>
        <p>RealFV = FV / (1 + i)^t</p>
        <p>EAR = (1 + r/n)^n − 1</p>
      </div>

      <h2
        id="how-to-calculate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Lumpsum Investment Returns
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Convert the annual rate to a decimal r.</li>
        <li>Pick n (1, 2, 4, 12, 52, 365) or continuous compounding.</li>
        <li>Express term t in years (months ÷ 12).</li>
        <li>Compute FV, then earnings = FV − PV.</li>
        <li>Optionally divide FV by (1+i)^t for purchasing power.</li>
      </ol>

      <h2
        id="example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Lumpsum Investment Calculation Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        ₹100,000 at 10% for 10 years, compounded annually: FV ≈ ₹259,374.25 and
        earnings ≈ ₹159,374.25. To reach ₹100,000 in 10 years at 10% monthly
        compounding, required PV ≈ ₹36,940.70.
      </p>

      <h2
        id="required-capital"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Much Should I Invest to Reach My Goal?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Use Initial lumpsum mode. Higher assumed returns or longer terms reduce
        the capital needed today; lower returns or shorter terms raise it.
      </p>

      <h2
        id="compounding"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Does Compounding Frequency Affect Investment Returns?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        For a fixed nominal rate, more frequent compounding usually increases
        EAR. This calculator treats weekly as 52 periods/year and daily as 365.
        Continuous compounding uses the exponential limit.
      </p>

      <h2
        id="inflation"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Does Inflation Affect Lumpsum Investments?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Inflation discounts future purchasing power. RealFV = FV / (1+i)^t is
        expressed in start-date currency units. Inflation must be greater than
        −100% for this annual model.
      </p>

      <h2
        id="vs-sip"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Lumpsum vs. SIP Investment
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Lumpsum deploys capital immediately; SIP spreads purchases over time.
        Compare scenarios with both calculators rather than assuming one strategy
        always wins.
      </p>

      <h2
        id="risks"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Advantages and Risks of Lumpsum Investing
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Advantages include simplicity and full compounding from day one. Risks
        include market timing, volatility, and the uncertainty of any assumed
        return. Negative returns and high inflation can erase real gains.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use the Lumpsum Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Choose what you want to know (PV, FV, rate, or term).</li>
        <li>Fill the remaining money, rate, and term fields.</li>
        <li>Set start date, inflation, and compounding frequency.</li>
        <li>Review primary result, EAR, real value, chart, and schedule.</li>
      </ol>

      <h2
        id="related"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related Calculators
      </h2>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm sm:text-base">
        <li>
          <Link
            href="/tools/sip-calculator-systematic-investment-plan"
            className="text-primary"
          >
            SIP Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/compound-interest-calculator"
            className="text-primary"
          >
            Compound Interest Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/future-value-calculator" className="text-primary">
            Future Value Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/inflation-calculator" className="text-primary">
            Inflation Calculator
          </Link>
        </li>
      </ul>

      <h2
        id="lumpsum-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion faqs={[...LUMPSUM_FAQS]} />
      </div>
    </article>
  );
}
