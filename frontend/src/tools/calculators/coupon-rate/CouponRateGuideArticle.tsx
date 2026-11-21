import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { COUPON_RATE_FAQS } from './content';

export function CouponRateGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Coupon Rate Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Use this Coupon Rate Calculator to calculate the annual coupon rate of a
        bond based on its face value and periodic interest payments. You can
        also determine the annual coupon payment and the amount received each
        payment period, or reverse-solve for face value and coupon amounts.
      </p>

      <h2
        id="definition"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is the Coupon Rate? Bond Coupon Rate Definition
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The coupon rate is the annual contractual interest on a bond expressed
        as a percentage of face (par / nominal) value. Investors receive coupon
        cash flows on a stated schedule for traditional fixed-rate bonds. Face
        value is the principal amount typically repaid at maturity — not
        necessarily the market price. Coupon rates matter because they set the
        bond’s cash interest before considering market price, taxes, or default
        risk.
      </p>

      <h2
        id="how-to-calculate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate the Coupon Rate
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Coupon rate (%) = (Annual coupon / Face value) × 100</p>
        <p>Annual coupon = Coupon per period × Payments per year</p>
        <p>r% = (C_period × f / F) × 100</p>
      </div>

      <h2
        id="frequencies"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Coupon Rate Formula for Different Payment Frequencies
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Annual (f=1), semiannual (f=2), quarterly (f=4), every two months (f=6),
        monthly (f=12), and weekly (f=52) schedules all use the same identity:
        annualize periodic coupons, then divide by face value. Only the payment
        count changes.
      </p>

      <h2
        id="annual-coupon"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Annual Coupon Payments
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Annual coupon = Face value × (coupon rate ÷ 100). Convert the percent to
        a decimal before multiplying. Example: $1,000 × 0.05 = $50.
      </p>

      <h2
        id="per-period"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Coupon Payments per Period
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Coupon per period = Annual coupon ÷ payments per year. Semiannual $50/year
        → $25; quarterly $80/year → $20; monthly $60/year → $5.
      </p>

      <h2
        id="example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Coupon Rate Calculation Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Face value $1,000, coupon per period $25, semiannual (f=2):
      </p>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>C_annual = 25 × 2 = $50</p>
        <p>r = (50 / 1000) × 100 = 5%</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The bond pays 5% of face annually — $25 every six months, $50 per year —
        excluding taxes, fees, default, and reinvestment effects.
      </p>

      <h2
        id="vs-current-yield"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Coupon Rate vs. Current Yield
      </h2>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[28rem] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-border text-accent">
              <th className="py-2 pr-3 font-semibold">Measure</th>
              <th className="py-2 font-semibold">Formula idea</th>
            </tr>
          </thead>
          <tbody className="text-foreground/90">
            <tr className="border-b border-border">
              <td className="py-2 pr-3">Coupon rate</td>
              <td className="py-2">Annual coupon / Face value</td>
            </tr>
            <tr>
              <td className="py-2 pr-3">Current yield</td>
              <td className="py-2">Annual coupon / Market price</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Example: $50 coupon, $1,000 face → 5% coupon rate. If market price is
        $950, current yield ≈ 5.26%. They differ because denominators differ.
      </p>

      <h2
        id="vs-ytm"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Coupon Rate vs. Yield to Maturity (YTM)
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        YTM is the discount rate that equates the present value of remaining
        coupons and principal to the current market price (under stated
        assumptions). It embeds price, maturity, coupons, and redemption — so it
        is not the coupon rate. Discount bonds often show YTM above coupon rate;
        premium bonds often show YTM below coupon rate, all else equal.
      </p>

      <h2
        id="market-rates"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Market Interest Rates Affect Bond Prices
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        New issues may set coupons near prevailing yields. For an existing
        fixed-rate bond, coupons generally stay fixed. When market yields rise,
        existing fixed-rate prices generally fall (and vice versa), all else
        equal. Sensitivity depends on maturity, duration, credit risk, and other
        factors — the fixed coupon itself does not automatically reset.
      </p>

      <h2
        id="fixed-vs-floating"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Fixed-Rate Bonds vs. Floating-Rate Bonds
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Fixed-rate bonds keep a contractual coupon rate. Floating-rate notes
        typically reset on a schedule using a reference rate plus a spread
        (sometimes with floors/caps). Floating payments can change even though
        the formula is contractual.
      </p>

      <h2
        id="zero-coupon"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is a Zero-Coupon Bond?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A zero-coupon bond pays no periodic coupons (coupon rate 0%). Return
        typically comes from the gap between purchase price and redemption
        value, subject to terms and tax treatment.
      </p>

      <h2
        id="good-rate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is a Good Coupon Rate?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        “Good” depends on market yields, credit quality, inflation, maturity,
        taxes, and the price you pay. A high coupon on a risky issuer is not
        automatically attractive; a low coupon on a premium-priced high-quality
        bond may still fit a portfolio. Avoid treating any single percent as
        universally good.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use the Coupon Rate Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter the bond’s face value.</li>
        <li>Enter the coupon payment per period (or choose another solve mode).</li>
        <li>Select payment frequency.</li>
        <li>Review annual coupon and coupon rate.</li>
        <li>Open the formula breakdown for the step-by-step math.</li>
      </ol>

      <h2
        id="mistakes"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Common Coupon Rate Calculation Mistakes
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Using market price instead of face value.</li>
        <li>Forgetting payment frequency when annualizing.</li>
        <li>Confusing coupon rate with current yield or YTM.</li>
        <li>Mixing currencies without an FX step.</li>
        <li>Mixing percent and decimal forms of the rate.</li>
        <li>Assuming every bond pays coupons annually.</li>
      </ul>

      <h2
        id="related"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related Calculators
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <Link href="/tools/bond-current-yield-calculator" className="font-medium text-primary underline-offset-2 hover:underline">
            Bond Current Yield Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/bond-ytm-calculator" className="font-medium text-primary underline-offset-2 hover:underline">
            Bond YTM Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/bond-price-calculator" className="font-medium text-primary underline-offset-2 hover:underline">
            Bond Price Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/bond-yield-calculator" className="font-medium text-primary underline-offset-2 hover:underline">
            Bond Yield Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/present-value-calculator" className="font-medium text-primary underline-offset-2 hover:underline">
            Present Value Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/future-value-calculator" className="font-medium text-primary underline-offset-2 hover:underline">
            Future Value Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/compound-interest-calculator" className="font-medium text-primary underline-offset-2 hover:underline">
            Compound Interest Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/discount-rate-calculator" className="font-medium text-primary underline-offset-2 hover:underline">
            Discount Rate Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/interest-rate-calculator" className="font-medium text-primary underline-offset-2 hover:underline">
            Interest Rate Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/investment-calculator" className="font-medium text-primary underline-offset-2 hover:underline">
            Investment Calculator
          </Link>
        </li>
      </ul>

      <h2
        id="coupon-rate-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...COUPON_RATE_FAQS]} />
      </div>
    </article>
  );
}
