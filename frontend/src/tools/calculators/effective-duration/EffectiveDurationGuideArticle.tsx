import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { EFFECTIVE_DURATION_FAQS } from './content';

export function EffectiveDurationGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Effective Duration Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Use this Effective Duration Calculator to estimate how sensitive a
        bond&apos;s price is to parallel changes in market yields. Standard Bond
        mode prices fixed contractual coupons and principal at base, up, and down
 yields: a useful central-difference duration estimate for option-free
        cash flows. Scenario-Based mode accepts externally modeled prices so you
        can compute true effective duration when embedded options change expected
        cash flows. Currency labels are denomination only.
      </p>

      <h2
        id="definition"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is Effective Duration?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Duration measures bond price sensitivity to interest rates. Effective
        duration specifically uses scenario repricing: compare prices when yields
        fall and rise by a chosen differential. Results are expressed in years by
 convention. When expected cash flows can change with yields; calls,
 puts, prepayments; effective duration requires valuation models that
        allow those cash-flow changes. A fixed coupon schedule alone does not
        capture option exercise.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Effective Duration Formula
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>D_eff = (P− − P+) / (2 × P0 × Δy)</p>
        <p>C_eff ≈ (P− + P+ − 2P0) / (P0 × (Δy)²)</p>
        <p>Approx. %ΔP ≈ −D_eff × Δy × 100</p>
        <p>DV01 ≈ D_eff × P0 × 0.0001</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        P− is the price after a yield decrease, P+ after an increase, P0 the
        base price, and Δy the yield shock as a decimal (1 percentage point →
        0.01). Convert percentage UI inputs before applying the formula.
      </p>

      <h2
        id="how-to-calculate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Effective Duration
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Establish the base bond price P0.</li>
        <li>Reprice (or obtain) P− and P+ for ±Δy shocks.</li>
        <li>Convert the yield differential to a decimal.</li>
        <li>Apply D_eff = (P− − P+) / (2 × P0 × Δy).</li>
        <li>
          Interpret as a local first-order sensitivity; check convexity for
          larger moves.
        </li>
      </ol>

      <h2
        id="coupons"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Bond Coupon Payments
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Annual coupon = Face × (annual coupon rate as a decimal). Coupon per
        period = annual coupon ÷ payments per year (1, 2, 4, or 12). Zero-coupon
        bonds use a 0% coupon rate; price then depends only on discounted
        principal.
      </p>

      <h2
        id="bond-price"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate a Bond&apos;s Price
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        For a standard fixed-rate, option-free bond, price is the present value
        of remaining coupons plus principal discounted at the periodic yield.
        This calculator requires a whole number of coupon periods (maturity ×
        frequency) and does not silently round. Assumptions include fixed
        coupons, principal at maturity, consistent yield convention, no default,
        and no embedded option exercise in Standard Bond mode.
      </p>

      <h2
        id="example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Effective Duration Calculation Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Face $10,000 · coupon 8% annual · maturity 3 years · YTM 8% · Δy = 1
        percentage point:
      </p>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Coupon = $800 per year.</li>
        <li>P0 at 8% = $10,000 (par).</li>
        <li>P+ at 9% ≈ $9,746.87.</li>
        <li>P− at 7% ≈ $10,262.43.</li>
        <li>
          D_eff ≈ (10,262.43 − 9,746.87) / (2 × 10,000 × 0.01) ≈{' '}
          <strong>2.58 years</strong>.
        </li>
      </ul>

      <h2
        id="interpret"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Interpret Effective Duration
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A duration of about 2.58 years implies a roughly 2.58% opposite-direction
        price change for a small 1-percentage-point yield move under the linear
        approximation. A one-basis-point move is about 1/100 of that percentage
        impact. Because price–yield is curved, finite shifts can differ from the
        first-order estimate.
      </p>

      <h2
        id="vs-modified"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Effective Duration vs. Modified Duration
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Modified duration usually assumes fixed cash flows and an analytical
        yield derivative. Effective duration uses discrete scenario prices and
        can incorporate changing cash flows when those prices do. For option-free
        bonds they are often close; for callable/putable bonds they can diverge.
      </p>

      <h2
        id="vs-macaulay"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Effective Duration vs. Macaulay Duration
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Macaulay duration is a present-value-weighted average time until cash
        flows arrive. Effective duration is a sensitivity statistic from yield
        shocks. Related conceptually for option-free bonds, they answer different
        questions.
      </p>

      <h2
        id="vs-convexity"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Effective Duration vs. Convexity
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Duration is first-order; convexity captures curvature via (P− + P+ −
        2P0) / (P0 (Δy)²). Larger shocks and large convexity make the linear
        duration approximation less accurate. Convexity here is reported as a
        separate approximation, not confused with duration.
      </p>

      <h2
        id="callable"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Effective Duration of Callable Bonds
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Falling rates can increase call likelihood, capping upside price
        appreciation. Effective duration for callables therefore needs
        option-aware scenario prices; Standard Bond mode&apos;s fixed cash flows
        will overstate price gains in deep call regions.
      </p>

      <h2
        id="putable"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Effective Duration of Putable Bonds
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Put options can support prices when yields rise and the put becomes more
        valuable. Scenario models should reflect that behavior; fixed-schedule
        pricing will not.
      </p>

      <h2
        id="mbs"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Effective Duration and Mortgage-Backed Securities
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Prepayment speeds change with rates, altering expected cash flows.
        Effective duration for MBS is therefore model-dependent. Use Scenario
        mode with prices from a prepayment-aware valuation engine.
      </p>

      <h2
        id="importance"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Why Is Effective Duration Important?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Portfolio managers use it for interest-rate risk, fixed-income
 allocation, risk budgeting, hedging, and asset-liability management; 
        especially when comparing securities whose cash flows may respond to
        rates differently.
      </p>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations of Effective Duration
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Model and curve assumptions drive scenario prices.</li>
        <li>Shock size can change the numerical result.</li>
        <li>Nonparallel yield moves are outside a single Δy parallel shock.</li>
        <li>Credit spread and liquidity risks are not duration alone.</li>
        <li>Convexity and higher-order effects matter for large moves.</li>
        <li>
          Standard mode does not embed call/put/prepayment cash-flow changes.
        </li>
      </ul>

      <h2
        id="related"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related Calculators
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Continue with{' '}
        <Link
          href="/tools/bond-price-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Bond Price
        </Link>
        ,{' '}
        <Link
          href="/tools/bond-ytm-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Bond YTM
        </Link>
        ,{' '}
        <Link
          href="/tools/bond-convexity-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Bond Convexity
        </Link>
        ,{' '}
        <Link
          href="/tools/coupon-rate-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Coupon Rate
        </Link>
        ,{' '}
        <Link
          href="/tools/bond-current-yield-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Bond Current Yield
        </Link>
        ,{' '}
        <Link
          href="/tools/credit-spread-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Credit Spread
        </Link>
        ,{' '}
        <Link
          href="/tools/present-value-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Present Value
        </Link>
        ,{' '}
        <Link
          href="/tools/discounted-cash-flow-calculator-dcf"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          DCF
        </Link>
        , and{' '}
        <Link
          href="/tools/investment-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Investment Calculator
        </Link>
        .
      </p>

      <h2
        id="ed-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion items={[...EFFECTIVE_DURATION_FAQS]} />
      </div>
    </article>
  );
}
