import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { YIELD_TO_MATURITY_FAQS } from './content';

export function YieldToMaturityGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Yield to Maturity Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Yield to maturity (YTM) is the constant annualized rate that equates a
        bond&apos;s purchase price with the present value of its remaining
        coupons and principal. Bond prices and yields move inversely: when price
        falls, YTM rises for the same promised cash flows. This calculator solves
        the full periodic pricing equation with a bounded bisection root finder
        (closed form for zero-coupon bonds) — not a rough approximate YTM
        shortcut. Enter face value, price, coupon rate, frequency, and years to
        maturity; optionally reverse-solve for price, face value, or coupon rate.
        Currency labels are denomination only.
      </p>

      <h2
        id="definition"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is Yield to Maturity (YTM)?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        YTM is an internal-rate-of-return measure based on promised cash flows
        and the selected price and timing assumptions. It reflects coupon income
        and principal repayment if the issuer pays as scheduled and you hold to
        maturity. The IRR story also assumes coupons can be reinvested at the
        YTM. Credit and default risk are outside the formula — a high YTM can
        simply price higher risk.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Yield to Maturity Formula
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>P = Σ C/(1+y/m)^t + F/(1+y/m)^N</p>
        <p>C = F × c / m</p>
        <p>N = m × T</p>
        <p>EAY = (1 + y/m)^m − 1</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        P is price, F face value, c annual coupon rate (decimal), m payments per
        year, T years to maturity, y nominal annual YTM, and N remaining periods.
        Coupons are discounted period by period at y/m.
      </p>

      <h2
        id="how-to-calculate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Yield to Maturity
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Face $1,000 · price $950 · coupon 5% · annual · 10 years.</li>
        <li>C = 1,000 × 0.05 = $50; N = 10.</li>
        <li>
          Solve 950 = Σ 50/(1+y)^t + 1,000/(1+y)^10 for y by bisection.
        </li>
        <li>
          Result: YTM ≈ <strong>5.67%</strong> annually.
        </li>
      </ol>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The discount to face raises yield above the 5% coupon. YTM is still not a
        guaranteed investment return.
      </p>

      <h2
        id="factors"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Factors Affect Yield to Maturity?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Market price, face value, coupon rate, remaining years, coupon frequency,
        broader interest rates, and issuer credit risk all shape quoted or implied
        YTM. Liquidity, call features, and tax treatment can also move prices
        without changing the contractual coupon schedule.
      </p>

      <h2
        id="comparisons"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Coupon Rate vs. Current Yield vs. YTM
      </h2>
      <div className="my-4 overflow-x-auto rounded-xl border border-border">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-muted/40 text-accent">
            <tr>
              <th className="px-3 py-2 font-semibold">Metric</th>
              <th className="px-3 py-2 font-semibold">Focus</th>
            </tr>
          </thead>
          <tbody className="text-foreground/90">
            <tr className="border-t border-border">
              <td className="px-3 py-2">Coupon rate</td>
              <td className="px-3 py-2">Annual coupon ÷ face value</td>
            </tr>
            <tr className="border-t border-border">
              <td className="px-3 py-2">Current yield</td>
              <td className="px-3 py-2">Annual coupon ÷ bond price</td>
            </tr>
            <tr className="border-t border-border">
              <td className="px-3 py-2">YTM</td>
              <td className="px-3 py-2">
                IRR of price vs remaining coupons + principal
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2
        id="discount-premium"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Discount Bonds, Premium Bonds, and Par Bonds
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Discount (P &lt; F): YTM generally &gt; coupon. Par (P = F): YTM equals
        coupon under the standard model. Premium (P &gt; F): YTM generally &lt;
        coupon as the premium amortizes over remaining life.
      </p>

      <h2
        id="frequency"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Coupon Frequency Affects YTM
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Annual, semiannual, quarterly, and monthly conventions change m, C, and
        N. This tool reports nominal annual YTM (periodic × m) and effective
        annual yield (1+periodic)^m − 1. Do not confuse the two.
      </p>

      <h2
        id="zero-coupon"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Zero-Coupon Bond Yield to Maturity
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        With C = 0, P = F/(1+y/m)^N and y = m × ((F/P)^(1/N) − 1). Example: F =
        1,000, P = 900, annual, 5 years → y ≈ 2.13%.
      </p>

      <h2
        id="ytc"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Yield to Maturity vs. Yield to Call
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Callable bonds may be redeemed before maturity at a call price. Yield to
        call uses cash flows to the call date. YTM can overstate expected yield if
        call risk is material.
      </p>

      <h2
        id="yield-curve"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Understanding the Yield Curve
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The yield curve plots yields against maturity for comparable bonds.
        Upward-sloping (normal), flat, and inverted shapes reflect expectations,
        term premia, and policy — different maturities can show different yields
        even for the same issuer class.
      </p>

      <h2
        id="rates-prices"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Interest Rates Affect Bond Prices
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        When market yields rise, existing fixed coupons look less attractive and
        prices fall so implied YTMs rise. When yields fall, prices rise. Duration
        approximates the sensitivity of that move.
      </p>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations of Yield to Maturity
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Reinvestment at the YTM may not occur.</li>
        <li>Default and credit migration are ignored.</li>
        <li>Taxes, fees, and inflation are ignored.</li>
        <li>Call and other embedded options need separate yields.</li>
        <li>Clean vs dirty price and accrued interest can matter.</li>
        <li>Irregular coupon dates need a settlement schedule.</li>
        <li>Yield conventions differ across markets.</li>
      </ul>

      <h2
        id="when-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        When Should You Use a YTM Calculator?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Useful for bond investors, analysts, portfolio managers, fixed-income
        research, financial planning, and comparing debt securities — always
        alongside credit, liquidity, and structural review.
      </p>

      <h2
        id="related"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related Calculators
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Explore{' '}
        <Link href="/tools/bond-ytm-calculator" className="font-medium text-primary underline-offset-2 hover:underline">
          Bond YTM
        </Link>
        ,{' '}
        <Link href="/tools/bond-yield-calculator" className="font-medium text-primary underline-offset-2 hover:underline">
          Bond Yield
        </Link>
        ,{' '}
        <Link href="/tools/bond-current-yield-calculator" className="font-medium text-primary underline-offset-2 hover:underline">
          Current Yield
        </Link>
        ,{' '}
        <Link href="/tools/bond-price-calculator" className="font-medium text-primary underline-offset-2 hover:underline">
          Bond Price
        </Link>
        ,{' '}
        <Link href="/tools/coupon-rate-calculator" className="font-medium text-primary underline-offset-2 hover:underline">
          Coupon Rate
        </Link>
        ,{' '}
        <Link href="/tools/tax-equivalent-yield-calculator" className="font-medium text-primary underline-offset-2 hover:underline">
          Tax Equivalent Yield
        </Link>
        ,{' '}
        <Link href="/tools/effective-duration-calculator" className="font-medium text-primary underline-offset-2 hover:underline">
          Effective Duration
        </Link>
        ,{' '}
        <Link href="/tools/bond-convexity-calculator" className="font-medium text-primary underline-offset-2 hover:underline">
          Bond Convexity
        </Link>
        ,{' '}
        <Link href="/tools/present-value-calculator" className="font-medium text-primary underline-offset-2 hover:underline">
          Present Value
        </Link>
        , and{' '}
        <Link href="/tools/effective-interest-rate-calculator" className="font-medium text-primary underline-offset-2 hover:underline">
          Effective Interest Rate
        </Link>
        .
      </p>

      <h2
        id="ytm-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion items={[...YIELD_TO_MATURITY_FAQS]} />
      </div>
    </article>
  );
}
