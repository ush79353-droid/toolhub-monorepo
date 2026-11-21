import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { FORWARD_RATE_FAQS } from './content';

export function ForwardRateGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Forward Rate Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Use our Forward Rate Calculator to find the annually compounded implied
        forward rate between two spot rates. Enter time period n₁ with spot S₁
        and a longer time period n₂ with spot S₂. The result is the break-even
        reinvestment rate that links the shorter and longer spots under annual
        compounding. This page is for students, analysts, and anyone reading a
        yield curve; it is not a trading system or a forecast of future rates.
      </p>

      <h2
        id="what-is"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is a Forward Rate?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A spot rate is the yield for a loan or zero-coupon investment that
        starts today and matures at a stated horizon. A forward rate is the
        rate for a future interval that is implied by two such spots so that
        rolling the shorter investment at the forward matches the longer
        investment&apos;s payoff. Market quotes may also show traded FRAs or
        futures; this calculator focuses on the curve-implied annual identity.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Forward Rate Formula (Annual Compounding)
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>
          f = [ ((1 + S₂)^n₂ / (1 + S₁)^n₁ ) ^ (1 / (n₂ − n₁)) − 1 ] × 100
        </p>
        <p>Require n₂ &gt; n₁ and (1 + S) &gt; 0 for each spot.</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Here S₁ and S₂ are decimal spot rates (percent ÷ 100), n₁ and n₂ are
        times in years, and f is reported as a percent. The formula is the
        standard annually compounded bootstrap relation between two spots.
      </p>

      <h2
        id="how-to"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate an Implied Forward Rate
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Worked example: n₁ = 1 year, S₁ = 5%; n₂ = 2 years, S₂ = 6%.
      </p>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Convert: S₁ = 0.05, S₂ = 0.06.</li>
        <li>
          Compute (1.06)² / (1.05)¹ = 1.1236 / 1.05 ≈ 1.070095.
        </li>
        <li>
          Raise to 1/(2−1) and subtract 1: f ≈ 0.070095 → about 7.01%.
        </li>
      </ol>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use the Forward Rate Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter n₁ and choose years or months.</li>
        <li>Enter S₁ as a percent.</li>
        <li>Enter a longer n₂ and S₂.</li>
        <li>Read the implied forward rate in the Forward rate section.</li>
        <li>
          Use Load example for the 1y/2y illustration, or Share / Reload /
          Clear as needed.
        </li>
      </ol>

      <h2
        id="spot-vs-forward"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Spot Rate vs Forward Rate
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Spots are observed (or bootstrapped) yields from today to a maturity.
        Forwards describe the intervening period between two maturities. A
        steep curve with a higher long spot than short spot typically implies a
        forward above the short spot; a downward-sloping curve can imply a
        lower forward. Always match compounding and day-count conventions when
        comparing to market quotes.
      </p>

      <h2
        id="compounding"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Annual Compounding Convention
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This tool uses annual compounding exclusively. Continuous compounding
        uses f = (n₂·ln(1+S₂) − n₁·ln(1+S₁)) / (n₂−n₁) in logarithmic form,
        and m-period compounding uses different roots. Mixing conventions
        without conversion produces inconsistent forwards.
      </p>

      <h2
        id="interpretation"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Interpret Results
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Treat the output as a no-arbitrage break-even under the stated spots
        and compounding, not as a guaranteed future fixing. Credit risk,
        liquidity, tax, and term premia can separate implied forwards from
        expected future spots.
      </p>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Annual compounding only; no continuous or semi-annual mode.</li>
        <li>No credit, liquidity, or convexity adjustments.</li>
        <li>Requires n₂ &gt; n₁ after unit conversion.</li>
        <li>Not a currency forward or FRA settlement calculator.</li>
      </ul>

      <h2
        id="related"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related Calculators
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
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
            href="/tools/currency-forward-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Currency Forward Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/credit-spread-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Credit Spread Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/fisher-effect-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Fisher Effect Calculator
          </Link>
        </li>
      </ul>

      <h2
        id="forward-rate-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion faqs={[...FORWARD_RATE_FAQS]} />
      </div>
    </article>
  );
}
