import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { RESERVE_RATIO_FAQS } from './content';

export function ReserveRatioGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Reserve Ratio Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Banks fund themselves in part with deposits and hold reserve assets for
        settlement, withdrawals, and — where rules apply — regulatory coverage
        of those deposits. The reserve ratio summarizes reserves relative to
        deposits. This calculator computes the actual ratio, required reserves
        from a stated required ratio, excess reserves or shortfalls, reverse
        solves for deposits or reserves, and the textbook simple money
        multiplier. It is an educational tool: currency selection is
        denomination only (not FX conversion), and simplified “funds not held as
        reserves” figures are not automatic lending capacity.
      </p>

      <h2
        id="what-is-reserve-ratio"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is the Reserve Ratio?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The reserve ratio expresses bank reserves as a percentage of the
        deposit base used in the calculation. If a bank holds $100 million of
        reserves against $1,000 million of deposits, the ratio is 10%. The
        ratio answers a coverage question — how large are reserves relative to
        deposits — not a full description of liquidity, capital, or credit
        risk. Definitions of eligible reserves and deposits follow the
        jurisdiction and reporting framework you have in mind.
      </p>

      <h2
        id="fractional-reserve-banking"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is Fractional Reserve Banking?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        In the traditional textbook story, deposit-taking institutions keep
        reserves equal to only a fraction of deposit liabilities and extend
        loans that create new deposits elsewhere in the system. Central banks
        supply settlement balances, operate payment systems, and may set reserve
        requirements. Interbank markets and standing facilities help banks
        manage daily liquidity. Modern practice is more complex: banks manage
        capital ratios, liquidity coverage, stable funding, credit standards,
        and funding costs. A fixed reserve ratio alone does not determine how
        much banks lend to households and firms, and banks do not simply “lend
        out reserves” dollar-for-dollar to the public in the way casual
        narratives sometimes claim.
      </p>

      <h2
        id="reserve-ratio-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Reserve Ratio Formula
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>RR = (R / D) × 100</p>
        <p>Required Reserves = D × (r / 100)</p>
        <p>Excess / Shortfall = Actual Reserves − Required Reserves</p>
        <p>L = D − R (simplified; only if R ≤ D)</p>
        <p>m = 100 / RR (undefined if RR = 0)</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        R is total reserves, D is total deposits, r or RR is a reserve ratio in
        percent, L is funds not held as reserves in the simplified illustration,
        and m is the simple money multiplier. Keep currency magnitudes
        consistent before dividing.
      </p>

      <h2
        id="calculate-reserve-ratio"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate the Reserve Ratio
      </h2>
      <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Identify total deposits (example: $1,000 million).</li>
        <li>Identify total reserves (example: $100 million).</li>
        <li>Divide reserves by deposits: 100 ÷ 1,000 = 0.10.</li>
        <li>Multiply by 100: reserve ratio = 10%.</li>
        <li>
          Optionally compute L = 1,000 − 100 = $900 million as funds not held as
          reserves — a balance-sheet illustration, not unrestricted lending
          capacity.
        </li>
      </ol>

      <h2
        id="required-reserves"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Are Required Reserves?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Required reserves are the reserve amount implied by deposits and a
        required reserve ratio when such a requirement applies. Not every
        banking system currently imposes a positive reserve requirement. The
        U.S. Federal Reserve reduced reserve requirement ratios to zero in March
        2020; banks there still face liquidity, capital, and supervisory
        expectations. Always separate the actual reserves-to-deposits ratio from
        any required ratio used for teaching or compliance exercises.
      </p>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs text-accent sm:text-sm">
        Required Reserves = D × (r / 100)
      </div>

      <h2
        id="calculate-required"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Required Reserves
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Example: deposits $2,500 million and required ratio 8% → required
        reserves = 2,500 × 0.08 = $200 million. Use the calculator’s Required
        Reserves mode for this solve. The simplified model accepts required
        ratios from 0% to 100%.
      </p>

      <h2
        id="excess-reserves"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Are Excess Reserves?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Excess reserves are actual reserves above the required amount. They are
        a surplus relative to that requirement, not a free warrant to expand
        credit without regard to capital, liquidity, or risk. When actual
        reserves fall short of required reserves, this tool reports a reserve
        shortfall instead of labeling a negative gap as available excess.
      </p>

      <h2
        id="calculate-excess"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Excess Reserves
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Excess (or shortfall) = Actual Reserves − Required Reserves. Example:
        actual $150 million and required $100 million → $50 million surplus.
        Example shortfall: actual $80 million and required $100 million → $20
        million shortfall. Use Excess / Shortfall mode to compute either case.
      </p>

      <h2
        id="loanable-funds"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Are Loanable Funds?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Textbook presentations sometimes treat deposits minus reserves as
        “loanable funds.” That identity can illustrate a simplified T-account,
        but real-world lending capacity depends on capital requirements,
        liquidity buffers, wholesale funding, borrower demand, collateral, and
        risk appetite. When reserves exceed deposits, the simplified L = D − R
        illustration is marked not applicable rather than shown as a negative
        lending capacity.
      </p>

      <h2
        id="money-supply"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Reserve Ratios Affect the Money Supply
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Deposit-expansion models link a binding reserve ratio to successive
        rounds of lending and redepositing. Those models assume fixed ratios, no
        cash drain, no excess reserves, and unconstrained capital. Modern
        monetary systems also reflect interest-rate corridors, quantitative
        tools, and bank balance-sheet preferences. Treat multiplier arithmetic
        as pedagogy, not a complete map of money creation.
      </p>

      <h2
        id="money-multiplier"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Reserve Ratio and Money Multiplier Formula
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs text-accent sm:text-sm">
        m = 1 / r = 100 / RR
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        At RR = 10%, m = 10. At RR = 0%, the simple multiplier is undefined —
        this calculator never displays Infinity. For richer monetary-aggregate
        math (base, supply, currency drain), see the{' '}
        <Link
          href="/tools/money-multiplier-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Money Multiplier Calculator
        </Link>
        .
      </p>

      <h2
        id="vs-lcr"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Reserve Ratio vs. Liquidity Coverage Ratio
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The liquidity coverage ratio (LCR) compares high-quality liquid assets
        with projected net cash outflows over a short stress horizon. A reserve
        ratio compares reserves with deposits. HQLA baskets, outflow weights,
        and stress assumptions make LCR a different metric — use the{' '}
        <Link
          href="/tools/lcr-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          LCR Calculator
        </Link>{' '}
        for that framework, and do not treat the two as interchangeable.
      </p>

      <h2
        id="vs-nsfr"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Reserve Ratio vs. Net Stable Funding Ratio
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The net stable funding ratio (NSFR) weighs available stable funding
        against required stable funding over a longer horizon. It addresses
        structural funding resilience, not a simple deposits-to-reserves
        percentage. See the{' '}
        <Link
          href="/tools/nsfr-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          NSFR Calculator
        </Link>{' '}
        for that educational estimate.
      </p>

      <h2
        id="advantages-limits"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Advantages and Limitations of Reserve Ratios
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Advantages: simple coverage metric; useful teaching identity; clear link to required-reserve arithmetic when requirements exist.</li>
        <li>Limitations: weak predictor of lending; ignores capital and liquidity rules; definitions vary; zero requirements do not mean unconstrained liquidity.</li>
        <li>Monetary-policy context differs across interest-on-reserves regimes and quantity-based frameworks.</li>
      </ul>

      <h2
        id="countries"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Reserve Requirements in Different Countries
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Authorities set, change, or abolish reserve requirements for monetary
        control, liquidity, or historical reasons. Rates and eligible
        liabilities differ internationally and over time. This article does not
        list unverified current country rates. When you cite a specific rate,
        include the jurisdiction and effective date from an official source.
      </p>

      <h2
        id="why-hold"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Why Banks Hold Reserves
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Banks hold reserves to settle payments, meet withdrawals, manage
        intraday liquidity, satisfy regulatory or supervisory expectations where
        they apply, and support operational buffers. Even with a zero required
        ratio, settlement and liquidity needs remain.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use the Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Choose currency denomination and magnitude.</li>
        <li>Select a mode: Reserve Ratio, Required Reserves, Excess/Shortfall, Deposits, or Reserves.</li>
        <li>Enter the known inputs; read-only fields update automatically.</li>
        <li>Optionally enter a required ratio in Reserve Ratio mode for surplus/shortfall and multiplier context.</li>
        <li>Reload restores the 1,000 / 100 million example; Clear empties fields.</li>
      </ol>

      <h2
        id="related"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related Calculators
      </h2>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-foreground/90 sm:text-base">
        <li>
          <Link href="/tools/money-multiplier-calculator" className="text-primary hover:underline">
            Money Multiplier Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/money-supply-calculator" className="text-primary hover:underline">
            Money Supply Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/lcr-calculator" className="text-primary hover:underline">
            LCR Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/nsfr-calculator" className="text-primary hover:underline">
            NSFR Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/mpc-calculator" className="text-primary hover:underline">
            MPC Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/inflation-calculator" className="text-primary hover:underline">
            Inflation Calculator
          </Link>
        </li>
      </ul>

      <h2
        id="reserve-ratio-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion faqs={[...RESERVE_RATIO_FAQS]} />
      </div>
    </article>
  );
}
