import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { CREDIT_SPREAD_FAQS } from './content';

export function CreditSpreadGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Credit Spread Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Use our Credit Spread Calculator to find the difference between a
        corporate bond&apos;s yield and the yield of a comparable government
        bond. Calculate credit spreads in percentage points or basis points,
        reverse-solve for corporate or government yields, and read a clear
        interpretation of positive, zero, or negative spreads. The tool is
        designed for students, analysts, and investors who need a transparent
        CS = Y<sub>c</sub> − Y<sub>g</sub> comparison — not a substitute for
        full credit research, curve models, or option-adjusted analytics.
      </p>

      <h2
        id="definition"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is a Credit Spread? Credit Spread Definition
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A credit spread is the extra yield investors receive (or forgo) when
        holding a corporate or other credit-sensitive bond instead of a
        comparable government bond. Corporate bond yields embed expectations
        about coupons, price, maturity, and creditworthiness. Government bonds
        typically serve as the reference benchmark because sovereign issuers in
        their own currency are often treated as the lowest-credit-risk curve in
        that market — though that does not make every government yield
        universally risk-free. Liquidity, taxes, and market conditions also
        influence quoted yields, so the observed spread compensates for more
        than pure default risk alone.
      </p>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Prefer the same yield measure on both sides of the comparison — commonly
        yield to maturity — and align maturity, currency, and quoting
        conventions. Confusing coupon rate, current yield, YTM, and yield
        spread produces misleading differences even when the arithmetic looks
        tidy.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Credit Spread Formula
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>CS = Y_c − Y_g</p>
        <p>CS_bps = CS × 100</p>
        <p>Y_c = Y_g + CS</p>
        <p>Y_g = Y_c − CS</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Here CS is the credit spread in percentage points, Y<sub>c</sub> is the
        corporate bond yield in percent, and Y<sub>g</sub> is the government
        bond yield in percent. The spread is an absolute difference in yield
        levels. A result of 3.50 percentage points is not a 3.50% relative
        increase of one yield over the other — it is 3.50 points on the yield
        scale, equal to 350 basis points.
      </p>

      <h2
        id="how-to-calculate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate the Credit Spread of a Corporate Bond
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Worked example using comparable yields:
      </p>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          Identify the corporate bond yield: Y<sub>c</sub> = 5.30%.
        </li>
        <li>
          Identify the government bond yield: Y<sub>g</sub> = 1.80%.
        </li>
        <li>
          Apply CS = Y<sub>c</sub> − Y<sub>g</sub> = 5.30 − 1.80 = 3.50
          percentage points.
        </li>
        <li>
          Convert to basis points: CS<sub>bps</sub> = 3.50 × 100 = 350 bps.
        </li>
      </ol>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Interpretation: the corporate bond yields 3.50 percentage points (350
        bps) more than the selected government benchmark. That gap may reflect
        compensation for credit risk, liquidity differences, and other
        bond-specific factors — not default risk in isolation.
      </p>

      <h2
        id="basis-points"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Credit Spread in Basis Points
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A basis point is one-hundredth of a percentage point: 1 bp = 0.01
        percentage points, and 100 bps = 1 percentage point. Bond markets quote
        spreads in bps because small yield moves matter for price and relative
        value. Switching the calculator between percentage points and bps
        changes only the display (or input unit); it does not change the
        underlying financial difference.
      </p>
      <div className="my-4 overflow-x-auto rounded-xl border border-border">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-muted/40 text-accent">
            <tr>
              <th className="px-3 py-2 font-semibold">Percentage points</th>
              <th className="px-3 py-2 font-semibold">Basis points</th>
            </tr>
          </thead>
          <tbody className="text-foreground/90">
            {[
              ['0.25', '25'],
              ['0.50', '50'],
              ['1.00', '100'],
              ['1.50', '150'],
              ['2.00', '200'],
              ['3.50', '350'],
              ['5.00', '500'],
            ].map(([pp, bps]) => (
              <tr key={pp} className="border-t border-border">
                <td className="px-3 py-2 tabular-nums">{pp}</td>
                <td className="px-3 py-2 tabular-nums">{bps}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use the Credit Spread Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          Choose what to solve for: credit spread, corporate yield, or
          government yield.
        </li>
        <li>
          Enter the known yields as percentages. When solving for a yield, enter
          the spread in bps or percentage points using the unit selector.
        </li>
        <li>
          Results update automatically. Read both the bps headline and the
          percentage-point secondary line.
        </li>
        <li>
          Expand the formula breakdown to verify CS = Y<sub>c</sub> − Y<sub>g</sub>{' '}
          and the ×100 conversion.
        </li>
        <li>
          Use Reload to restore the example, Clear to blank inputs, and Copy or
          Share to export a text summary (no confidential portfolio data).
        </li>
      </ol>

      <h2
        id="interpret"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Interpret Credit Spreads
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Positive spreads (corporate above government) are the usual case when
        the comparison is fair. Zero spreads mean identical quoted yields under
        the selected comparison. Negative spreads mean the corporate yield is
        below the government yield — possible with benchmark mismatch,
        liquidity, structure, or demand effects, and not treated as calculator
        errors here.
      </p>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Narrower spreads can be associated with lower perceived credit risk,
        improving conditions, stronger demand, or easier financing. Wider
        spreads can be associated with higher perceived credit risk, uncertainty,
        thinner liquidity, greater risk aversion, or weaker issuer fundamentals.
        Always interpret relative to credit rating, sector, maturity, market
        regime, historical levels for that name or cohort, security structure,
        and benchmark choice. Do not use unsupported universal rules such as
        “above 300 bps always means high default risk.”
      </p>

      <h2
        id="drivers"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Causes Credit Spreads to Widen or Narrow?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Spreads respond to credit quality and default risk, expected recovery in
        default, market liquidity, macroeconomic conditions, interest-rate
        volatility (especially for spread products with optionality), and
        investor risk appetite. Financing stress, sector shocks, and rating
        actions can widen spreads quickly; improving earnings, supportive policy,
        or heavy inflows into credit can tighten them. Because multiple drivers
        move together, attributing every basis point to “credit only” overstates
        precision.
      </p>

      <h2
        id="vs-yield-spread"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Credit Spread vs. Yield Spread
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Yield spread is the general idea of subtracting one yield from another
        (for example, corporate vs Treasury, municipal vs taxable, or two
        corporates). Credit spread usually focuses on the compensation
        associated with credit relative to a government or similar low-credit-risk
        benchmark. In practice the labels overlap; this calculator computes a
        simple nominal yield difference and labels it a credit spread in that
        common market sense.
      </p>

      <h2
        id="vs-risk-free"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Credit Spread vs. Risk-Free Rate
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Analysts often call the government yield a risk-free rate for teaching
        and modeling in a given currency, but real sovereign bonds can carry
        inflation, currency, political, and (in some cases) credit risk.
        Choosing a mismatched maturity, a different currency, or a less liquid
        government issue can distort the spread even when the arithmetic is
        correct. Treat the government bond as a reference benchmark, not an
        automatic proof of zero risk in every jurisdiction.
      </p>

      <h2
        id="vs-premium"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Credit Spread vs. Credit Risk Premium
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        An observed bond yield difference is a market package: expected credit
        losses, risk premia for uncertainty, liquidity, taxes, and sometimes
        structural features. The credit risk premium is the compensation
        investors demand for bearing credit risk beyond expected loss. The
        calculator reports the full simple spread; it does not decompose that
        package into pure credit risk premium components.
      </p>

      <h2
        id="measures"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        G-Spread, I-Spread, Z-Spread, and Option-Adjusted Spread
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <strong>G-spread:</strong> yield difference versus a comparable
          government yield or interpolated government curve point — closest in
          spirit to this calculator&apos;s simple CS = Y<sub>c</sub> − Y<sub>g</sub>.
        </li>
        <li>
          <strong>I-spread:</strong> yield difference versus an interest-rate
          swap benchmark of similar maturity.
        </li>
        <li>
          <strong>Z-spread:</strong> a constant spread added to a benchmark
          spot curve so discounted cash flows equal the bond&apos;s market
          price.
        </li>
        <li>
          <strong>Option-adjusted spread (OAS):</strong> a model spread that
          adjusts for embedded options.
        </li>
        <li>
          <strong>CDS spread:</strong> a market quote tied to the cost of
          credit protection under a credit default swap, not a bond YTM minus
          government YTM.
        </li>
      </ul>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        These measures are not interchangeable. This tool does not label its
        output as OAS, Z-spread, or CDS spread.
      </p>

      <h2
        id="ig-vs-hy"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Investment-Grade vs. High-Yield Credit Spreads
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Investment-grade issuers typically trade at narrower average spreads
        than high-yield (speculative-grade) issuers because markets assign lower
        expected credit risk — all else equal. Within each bucket, sector,
        seniority, covenant quality, maturity, and liquidity still create wide
        dispersion. Avoid quoting unverified “current market” average spreads as
        universal facts; use live market data for trading decisions.
      </p>

      <h2
        id="investors"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Investors Use Credit Spreads
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Investors compare bonds against government or peer benchmarks, track
        issuer and sector risk through time, size portfolio credit exposure,
        inform financing discussions when spreads affect funding costs, and
        monitor economic stress when spreads widen broadly. Spreads are
        decision inputs alongside ratings, fundamentals, covenants, and
        liquidity — not a complete credit scorecard by themselves.
      </p>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations of Credit Spread Analysis
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Maturity mismatches, currency mismatches, different day-count or yield
        conventions, embedded options, liquidity gaps, poor benchmark selection,
        and bond-specific features (calls, puts, subordination, collateral) all
        distort simple spreads. Educational calculators clarify arithmetic and
        units; they do not replace curve construction, pricing models, or due
        diligence.
      </p>

      <h2
        id="related"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related Calculators
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Continue with{' '}
        <Link
          href="/tools/bond-ytm-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Bond YTM
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
          href="/tools/bond-price-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Bond Price
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
          href="/tools/interest-coverage-ratio-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Interest Coverage Ratio
        </Link>
        ,{' '}
        <Link
          href="/tools/debt-to-equity-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Debt to Equity
        </Link>
        ,{' '}
        <Link
          href="/tools/debt-to-asset-ratio-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Debt to Asset
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
          href="/tools/discount-rate-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Discount Rate
        </Link>
        ,{' '}
        <Link
          href="/tools/investment-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Investment Calculator
        </Link>
        , and{' '}
        <Link
          href="/tools/wacc-calculator-weighted-average-cost-of-capital"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          WACC
        </Link>
        .
      </p>

      <h2
        id="credit-spread-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion items={[...CREDIT_SPREAD_FAQS]} />
      </div>
    </article>
  );
}
