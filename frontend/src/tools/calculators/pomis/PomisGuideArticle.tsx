import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { POMIS_FAQS } from './content';
import { DEFAULT_POMIS_SCHEME } from './types';

const R = DEFAULT_POMIS_SCHEME.annualInterestRate;

export function PomisGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Post Office Monthly Income Scheme Calculator – POMIS Monthly Interest
        Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Estimate monthly interest income, annual interest, total interest over
        the scheme tenure, and total cash received (principal plus cumulative
        interest) for India&apos;s Post Office Monthly Income Scheme. Amounts are
        in INR. Interest rates and investment limits are configurable
        educational settings — always verify the official notification that
        applies to your account.
      </p>

      <h2
        id="what-is-pomis"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is the Post Office Monthly Income Scheme?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        POMIS is a National Savings product offered through India Post. You invest
        a principal amount within scheme limits; the scheme pays interest on a
        monthly cycle and is designed to return the principal at the end of the
        configured tenure. It is commonly used by investors seeking a steady
        monthly cash flow rather than a single maturity payout of interest.
      </p>

      <h2
        id="how-it-works"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Does the Post Office Monthly Income Scheme Work?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        After you deposit an eligible amount, interest accrues under the
        applicable annual rate and is distributed monthly. The principal
        typically stays invested until maturity (or permitted premature
        closure). Monthly interest is payout income — this calculator does not
        compound those monthly payments back into the POMIS balance.
      </p>

      <h2
        id="how-to-calculate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Monthly Income from POMIS
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Use simple monthly distribution of annual interest:
      </p>
      <p className="mt-2 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        MonthlyIncome = P × R ÷ (12 × 100)
      </p>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Example (illustrative rate {R}%): P = ₹4,50,000 → monthly income =
        4,50,000 × {R} ÷ 1,200 = ₹2,475. Annual interest = ₹29,700. Over five
        years, total interest = ₹2,475 × 60 = ₹1,48,500. Total cash received =
        ₹4,50,000 + ₹1,48,500 = ₹5,98,500 (principal at maturity plus interest
        paid along the way).
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use the POMIS Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Choose Individual or Joint to apply the matching investment ceiling.</li>
        <li>Enter the amount invested in INR within the shown limit.</li>
        <li>
          Set the annual interest rate to the official rate applicable at
          account opening (or keep the editable example for what-if analysis).
        </li>
        <li>Optionally add a start date to project the maturity date.</li>
        <li>
          Read monthly income, annual income, total interest, and total cash
          received in the summary; expand the schedule if needed.
        </li>
      </ol>

      <h2
        id="interest-rates"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Post Office MIS Interest Rates
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        POMIS rates are revised from time to time (often with other small
        savings rates). This site stores a configurable default — currently an
        example of {R}% — with an explicit source note. Do not treat the default
        as a live official quote. When the government publishes a new rate, update
        the configured default for new illustrations; existing deposits usually
        continue under the rate locked at opening, subject to scheme terms.
      </p>

      <h2
        id="account-types"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Individual and Joint POMIS Accounts
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Individual accounts are subject to the individual investment ceiling.
        Joint accounts use a higher joint ceiling under the configured rules.
        Switching account type immediately changes limit validation in this
        calculator.
      </p>

      <h2
        id="limits"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        POMIS Investment Limits
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Configured educational defaults: Individual ₹
        {DEFAULT_POMIS_SCHEME.individualInvestmentLimit.toLocaleString('en-IN')}
        , Joint ₹
        {DEFAULT_POMIS_SCHEME.jointInvestmentLimit.toLocaleString('en-IN')},
        minimum ₹
        {DEFAULT_POMIS_SCHEME.minimumInvestment.toLocaleString('en-IN')} in
        multiples of ₹
        {DEFAULT_POMIS_SCHEME.investmentIncrement.toLocaleString('en-IN')}. These
        are not permanent universal constants — confirm with India Post before
        depositing.
      </p>

      <h2
        id="benefits"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Benefits of the Post Office Monthly Income Scheme
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Investors often value predictable monthly payouts, a clear tenure, and
        the government-backed National Savings framework. Benefits depend on the
        rate at opening, tax treatment, and liquidity needs. This page does not
        guarantee returns or sovereign claims beyond publicly described scheme
        characteristics.
      </p>

      <h2
        id="maturity"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        POMIS Maturity and Principal Repayment
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        With a {DEFAULT_POMIS_SCHEME.investmentTermYears}-year configured tenure,
        maturity is projected as start date plus {DEFAULT_POMIS_SCHEME.investmentTermYears}{' '}
        years (calendar-aware). Principal repayment at maturity is modeled
        separately from the monthly interest already paid. Actual processing
        dates follow post office procedures.
      </p>

      <h2
        id="open-account"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Open a POMIS Account
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Generally, eligible residents apply at a post office with identity and
        address proof, KYC, and nomination details as required. Exact
        documentation and modes (branch / digital where available) follow
        current India Post instructions.
      </p>

      <h2
        id="close-account"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Close a POMIS Account
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Normal closure occurs at maturity with principal repayment. Premature
        closure, if permitted, may involve lock-in periods and interest
        adjustments. Always read the account terms; this calculator does not
        price premature-closure penalties.
      </p>

      <h2
        id="taxation"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Is POMIS Interest Taxable?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Interest from POMIS is generally considered taxable under Indian income
        tax rules applicable to the holder, and TDS provisions may apply
        depending on thresholds and law in force. It is not universally
        tax-free. Seek professional tax advice for your situation.
      </p>

      <h2
        id="vs-fd"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        POMIS vs. Fixed Deposits
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Fixed deposits may compound or pay interest at chosen frequencies and
        often have different tenures, premature-closure charges, and deposit
        insurance frameworks. POMIS emphasizes monthly income payouts with a
        National Savings ceiling structure. Compare rates, tax, and liquidity
        using verified current figures — this article avoids quoting unverified
        live FD rates.
      </p>

      <h2
        id="who-should"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Who Should Consider POMIS?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        POMIS may appeal to investors who want regular monthly cash flow within
        scheme limits and are comfortable locking principal for the tenure.
        It may be less suitable if you need unrestricted liquidity, higher
        market-linked returns, or deposits above the applicable ceiling.
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
            href="/tools/simple-interest-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Simple Interest Calculator
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
        id="pomis-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...POMIS_FAQS]} />
      </div>
    </article>
  );
}
