import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { YIELD_TO_CALL_FAQS } from './content';

export function YieldToCallGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Yield to Call Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Yield to call (YTC) measures the annualized return you would earn if you
        buy a callable bond at today&apos;s market price and the issuer redeems
        it on the modeled call date. Enter annual interest (coupon cash per
        year), call price, market price, and whole years until call. The
        calculator solves the full annual pricing equation with bounded
        bisection — not a rough approximate YTC shortcut. Currency labels are
        denomination only.
      </p>

      <h2
        id="definition"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is Yield to Call (YTC)?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        YTC is an internal-rate-of-return style measure on the cash flows that
        stop at the call: scheduled annual interest through the call year, then
        the call redemption amount instead of waiting for maturity face value.
        Issuers typically call when it is advantageous to refinance; investors
        use YTC alongside YTM to see which horizon is more binding.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Yield to Call Formula
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        With annual payments and whole years N until call:
      </p>
      <pre className="mt-3 overflow-x-auto rounded-lg border border-border bg-muted/20 p-3 text-xs sm:text-sm">
        {`P = Σ_{t=1}^{N} C / (1+y)^t + Call / (1+y)^N`}
      </pre>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Here C is annual interest, Call is the call price, P is market price,
        and y is the annual yield to call (decimal). When C = 0, y has the
        closed form (Call/P)^(1/N) − 1.
      </p>

      <h2
        id="how-to-calculate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate YTC
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter the yearly coupon cash amount as annual interest.</li>
        <li>Enter the call redemption price and current market price.</li>
        <li>Enter whole years until the assumed call date.</li>
        <li>
          Read the solved yield to call. Optionally expand steps for the
          equation and intermediate totals.
        </li>
      </ol>

      <h2
        id="ytc-vs-ytm"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        YTC vs Yield to Maturity
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        YTM discounts coupons through final maturity and redeems face value. YTC
        truncates at the call date and redeems at the call price. For premium
        callable bonds, YTC is often lower than YTM because the call caps the
        upside of high coupons. Compare both horizons; neither is a guarantee
        of realized return.
      </p>

      <h2
        id="when-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        When to Use a YTC Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Use YTC when a bond has an upcoming call and you want the yield if that
        call is exercised. It is especially useful for premium bonds where the
        issuer is more likely to refinance. Pair it with current yield and YTM
        for a fuller picture.
      </p>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This tool uses an annual payment convention matching the annual interest
        input. It does not model make-whole calls, sinking funds, yield to worst
        across multiple call dates, accrued interest conventions, or credit
        default. Semiannual market quotes may need adjusted inputs. Results are
        educational estimates, not advice.
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
            href="/tools/yield-to-maturity-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Yield to Maturity Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/coupon-rate-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Coupon Rate Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/tax-equivalent-yield-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Tax Equivalent Yield Calculator
          </Link>
        </li>
      </ul>

      <h2
        id="ytc-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion faqs={[...YIELD_TO_CALL_FAQS]} />
      </div>
    </article>
  );
}
