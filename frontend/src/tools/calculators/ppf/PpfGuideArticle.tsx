import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { PPF_FAQS } from './content';
import { DEFAULT_PPF_SCHEME } from './types';

const R = DEFAULT_PPF_SCHEME.defaultAnnualInterestRate;

export function PpfGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        PPF Calculator – Public Provident Fund Interest &amp; Maturity Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Estimate Public Provident Fund maturity value, total investment, credited
        interest, and inflation-adjusted purchasing power using Indian
        financial-year rules, the fifth-day eligible-balance convention, and
        annual interest crediting. Amounts are in INR. Rates and limits are
 configurable educational defaults; verify official notifications before
        investing.
      </p>

      <h2
        id="what-is-ppf"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is a PPF Account?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Public Provident Fund is a long-horizon small-savings scheme designed for
        disciplined annual contributions within a statutory ceiling. Interest is
        notified by the Government of India, and the account typically runs for
        fifteen years measured from the end of the opening financial year.
      </p>

      <h2
        id="how-ppf-works"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Does PPF Work?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        You deposit eligible amounts during each financial year (1 April–31
        March). Interest accrues monthly on the eligible balance and is credited
        at year-end, after which it compounds. At maturity you may withdraw or
        extend the account under scheme rules.
      </p>

      <h2
        id="how-to-calculate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate PPF Returns
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        For each month, identify the balance after deposits on or before the
        fifth day. Monthly interest = EligibleBalance × R ÷ 1,200. Sum monthly
        accruals and credit them on 31 March. Repeat until the FY-based maturity
        date. Do not substitute a generic SIP future-value formula for this
        process.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use the PPF Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Choose Fixed or Custom investment mode.</li>
        <li>Enter deposit amount and frequency, or build a custom schedule.</li>
        <li>Set an illustrative annual rate and optional inflation rate.</li>
        <li>Pick the account start date (drives FY and maturity).</li>
        <li>Optionally model a five-year extension block.</li>
        <li>Review maturity value, interest, chart, and FY schedule.</li>
      </ol>

      <h2
        id="interest-rates"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        PPF Interest Rates
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Rates are revised periodically (often quarterly). This calculator’s
        default {R}% is an editable constant-rate projection assumption, clearly
        labeled as illustrative. When historical period rates are configured,
        monthly interest can use the rate mapped to each YYYY-MM.
      </p>

      <h2
        id="limits"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        PPF Minimum and Maximum Investment
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Configured educational band: ₹
        {DEFAULT_PPF_SCHEME.minimumAnnualDeposit.toLocaleString('en-IN')} to ₹
        {DEFAULT_PPF_SCHEME.maximumAnnualDeposit.toLocaleString('en-IN')} per
        financial year, in multiples of ₹
        {DEFAULT_PPF_SCHEME.depositIncrement}. Limits apply to aggregate FY
        deposits, not to each installment in isolation.
      </p>

      <h2
        id="maturity"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        PPF Maturity Period
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Maturity is not simply start date + 15 calendar years. An account opened
        in FY 2026–27 matures on 31 March 2042 under the standard model used
        here. Always confirm with your account documents.
      </p>

      <h2
        id="fifth-day"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        PPF Deposit Before or After the Fifth Day
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Deposits credited on or before the fifth day raise that month’s eligible
        balance. Deposits after the fifth typically wait until the next month to
        affect eligibility. Timing therefore changes interest even when annual
        totals match.
      </p>

      <h2
        id="monthly-vs-annual"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        PPF Monthly vs. Annual Investment
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Spreading deposits monthly can match cash flow; a larger early-year
        deposit can increase months of eligibility. Both approaches must respect
        the annual ceiling. Compare schedules in Fixed or Custom mode.
      </p>

      <h2
        id="tax"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        PPF Tax Benefits
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Eligible contributions may qualify under Section 80C within overall
        limits when your chosen tax regime allows such deductions. Interest and
        maturity proceeds are often discussed as tax-exempt for eligible
 accounts, but outcomes depend on current law; this is not tax advice.
      </p>

      <h2
        id="withdrawal"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        PPF Withdrawal Rules
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Partial withdrawals may be permitted after a lock-in, subject to
        percentage caps and documentation. Premature closure rules differ.
        Withdrawals are not simulated in this educational engine.
      </p>

      <h2
        id="loan"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        PPF Loan Facility
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Loans against PPF may be available in eligible years under capped
        amounts and repayment conditions. Confirm current facility terms with
        your account office.
      </p>

      <h2
        id="extension"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        PPF Account Extension
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        After maturity, accounts can usually be extended in five-year blocks with
        or without fresh contributions. Extension with contributions typically
        requires a timely declaration. This calculator offers optional +5 year
        scenarios for illustration.
      </p>

      <h2
        id="example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        PPF Interest Calculation Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Suppose you deposit ₹1,00,000 on 5 April at an illustrative 12% annual
        rate. Eligible balance for April is ₹1,00,000, so April interest ≈
        ₹1,000. A deposit on 6 April instead earns ≈ ₹0 for April on that
        deposit. Over a full tenure, annual FY credits compound into the
        maturity balance shown in the results panel.
      </p>

      <h2
        id="vs-fd"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        PPF vs. Fixed Deposit
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        FDs offer varied tenures and payout options with different tax and
        premature-closure rules. PPF emphasizes long lock-in, annual caps, and
        FY interest crediting. Compare using verified current rates rather than
        outdated quotes.
      </p>

      <h2
        id="vs-epf"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        PPF vs. EPF
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        EPF is tied to covered employment with statutory contribution splits
        (including EPS). PPF is voluntary and individual. Many households use
        both for complementary goals.
      </p>

      <h2
        id="pros-cons"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Advantages and Limitations of PPF
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Advantages often cited include disciplined saving, sovereign-backed
        small-savings framework, and tax features where eligible. Limitations
        include long lock-in, contribution ceilings, and rate uncertainty on
        future notifications. Suitability depends on your horizon and liquidity
        needs.
      </p>

      <h2
        id="related"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related Calculators
      </h2>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm sm:text-base">
        <li>
          <Link
            href="/tools/epf-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            EPF Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/post-office-monthly-income-scheme-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Post Office Monthly Income Scheme Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/hra-exemption-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            HRA Exemption Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/compound-interest-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Compound Interest Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/lumpsum-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Lumpsum Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/sip-calculator-systematic-investment-plan"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            SIP Calculator
          </Link>
        </li>
      </ul>

      <h2
        id="ppf-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...PPF_FAQS]} />
      </div>
    </article>
  );
}
