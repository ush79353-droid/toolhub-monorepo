import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { BLACK_SCHOLES_FAQS } from './content';

export function BlackScholesGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Black Scholes Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Use this Black Scholes Calculator to estimate European call and put
        prices under the Black–Scholes–Merton framework. Enter the current stock
        price, strike, time to maturity, continuous dividend yield, volatility,
        and risk-free interest rate. Results update as you type. Stock, strike,
        call, and put each support an independent currency when FX rates are
        available.
      </p>

      <h2
        id="definition"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is the Black–Scholes Model?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Black–Scholes (and its Merton dividend extension) prices European
        options on an underlying that follows geometric Brownian motion under
        the risk-neutral measure. The closed-form solution uses the standard
        normal cumulative distribution function N(·) and continuous discounting.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Black–Scholes–Merton Formulas
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>d₁ = [ln(S/K) + (r − q + σ²/2) T] / (σ √T)</p>
        <p>d₂ = d₁ − σ √T</p>
        <p>Call = S e^(−qT) N(d₁) − K e^(−rT) N(d₂)</p>
        <p>Put = K e^(−rT) N(−d₂) − S e^(−qT) N(−d₁)</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        S is spot, K is strike, T is time in years, r is the continuous
        risk-free rate, q is the continuous dividend yield, and σ is
        annualized volatility. Percents entered in the form become decimals
        before these equations run.
      </p>

      <h2
        id="how-to-calculate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Convert time to years and percentages to decimals.</li>
        <li>If needed, convert the strike into the stock currency.</li>
        <li>Compute d₁ and d₂, then N(d₁), N(d₂), N(−d₁), and N(−d₂).</li>
        <li>Apply the call and put formulas above.</li>
        <li>Optionally convert call/put into their display currencies.</li>
      </ol>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use the Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter current stock price and strike (with currencies).</li>
        <li>Enter time to maturity and choose yrs / mos / days.</li>
        <li>Enter dividend yield, volatility, and risk-free rate as %.</li>
        <li>Read the European call and put prices in the results section.</li>
        <li>Share, reload, or clear using the action buttons.</li>
      </ol>

      <h2
        id="inputs"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Inputs Explained
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <strong>Current stock price (S)</strong> — underlying spot; model
          currency anchor.
        </li>
        <li>
          <strong>Strike price (K)</strong> — exercise price; FX-converted into
          S&apos;s currency when different.
        </li>
        <li>
          <strong>Time to maturity</strong> — converted to years (months ÷ 12,
          days ÷ 365).
        </li>
        <li>
          <strong>Dividend yield (q)</strong> — continuous yield percent.
        </li>
        <li>
          <strong>Volatility (σ)</strong> — annualized percent; must be ≥ 0.
        </li>
        <li>
          <strong>Risk-free interest rate (r)</strong> — continuous percent.
        </li>
      </ul>

      <h2
        id="example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Worked Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        S = 100, K = 100, T = 1 year, q = 0%, σ = 20%, r = 5%. Then d₁ ≈ 0.35,
        d₂ ≈ 0.15, call ≈ <strong>10.45</strong>, and put ≈{' '}
        <strong>5.57</strong> in the same currency units. Put-call parity with
        q = 0 checks as C − P = S − K e^(−rT).
      </p>

      <h2
        id="boundaries"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Zero Time and Zero Volatility
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        At T = 0 the calculator returns intrinsic values. At σ = 0 with T &gt; 0
        it returns the discounted forward intrinsic so results stay finite (no
        division by zero through σ √T).
      </p>

      <h2
        id="currency"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Currencies and FX
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Monetary fields use Omega&apos;s shared FX snapshot (ADR-021). Changing a
        currency converts that amount when rates exist. Yields, volatility,
        rates, and time units are never converted. Missing rates block
        conversion instead of assuming 1:1; stale rates still convert with a
        warning.
      </p>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>European exercise only — no early exercise premium.</li>
        <li>Constant r, q, and σ; no local-vol or stochastic-vol surface.</li>
        <li>No transaction costs, taxes, or discrete dividends.</li>
        <li>Educational estimate — not a brokerage quote.</li>
      </ul>

      <h2
        id="related"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related Calculators
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <Link href="/tools/yield-to-maturity-calculator" className="text-primary">
            Yield to Maturity Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/coupon-rate-calculator" className="text-primary">
            Coupon Rate Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/tax-equivalent-yield-calculator" className="text-primary">
            Tax Equivalent Yield Calculator
          </Link>
        </li>
      </ul>

      <div id="bs-faq" className="mt-10">
        <h2 className="text-lg font-bold tracking-tight text-accent sm:text-xl">
          Frequently Asked Questions
        </h2>
        <div className="mt-4">
          <FAQAccordion faqs={[...BLACK_SCHOLES_FAQS]} />
        </div>
      </div>
    </article>
  );
}
