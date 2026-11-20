import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { PP_FAQS } from './content';

export function PivotPointGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is a Pivot Point?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Pivot points are technical analysis levels computed from the previous
        trading period&apos;s high, low, and close. Traders use the central
        pivot and related support/resistance lines as short-term reference
        zones in stocks, forex, commodities, and other markets. They are
        decision aids, not guaranteed price targets.
      </p>

      <h2
        id="types"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Types of Pivot Points
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Classic (floor) pivots — equal weight on H, L, and C.</li>
        <li>Woodie — weights the close more heavily in the pivot.</li>
        <li>Camarilla — short-range levels from close ± fractions of 1.1× range.</li>
        <li>Fibonacci — pivot plus Fibonacci fractions of the prior range.</li>
        <li>DeMark — conditional X from open vs close, then P, R1, and S1.</li>
      </ul>

      <h2
        id="how-to-calculate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Pivot Points
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Take the prior period high (H), low (L), and close (C). For DeMark also
        use open (O). Apply the selected method&apos;s formulas to obtain the
        central pivot and its support/resistance set.
      </p>

      <h2
        id="classic"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Floor Pivot Points (Classic)
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>P = (H + L + C) / 3</p>
        <p>R1 = 2P − L · R2 = P + (H − L) · R3 = H + 2(P − L)</p>
        <p>S1 = 2P − H · S2 = P − (H − L) · S3 = L − 2(H − P)</p>
        <p>Example: H110 L90 C100 → P100 · R1 110 · R2 120 · R3 130 · S1 90 · S2 80 · S3 70</p>
      </div>

      <h2
        id="woodie"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Woodie Pivot Points
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>P = (H + L + 2C) / 4</p>
        <p>Then classic-style R1–R3 and S1–S3 from that weighted pivot</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This calculator uses the closing-price-weighted Woodie convention.
        Some platforms use an opening-price variant instead.
      </p>

      <h2
        id="camarilla"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Camarilla Pivot Points
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>D = H − L</p>
        <p>R1 = C + 1.1D/12 · R2 = C + 1.1D/6 · R3 = C + 1.1D/4 · R4 = C + 1.1D/2</p>
        <p>S1–S4 mirror those distances below C</p>
        <p>Reference P = (H + L + C) / 3 (display only)</p>
      </div>

      <h2
        id="fibonacci"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Fibonacci Pivot Points
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>P = (H + L + C) / 3 · D = H − L</p>
        <p>R1 = P + 0.382D · R2 = P + 0.618D · R3 = P + D</p>
        <p>S1 = P − 0.382D · S2 = P − 0.618D · S3 = P − D</p>
      </div>

      <h2
        id="demark"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        DeMark Pivot Points
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>If C &lt; O: X = H + 2L + C</p>
        <p>If C &gt; O: X = 2H + L + C</p>
        <p>If C = O: X = H + L + 2C</p>
        <p>P = X/4 · R1 = X/2 − L · S1 = X/2 − H</p>
      </div>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use the Pivot Point Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Choose a calculation method.</li>
        <li>Enter the previous period&apos;s high price.</li>
        <li>Enter the previous period&apos;s low price.</li>
        <li>Enter the previous period&apos;s close price.</li>
        <li>Enter the opening price if using DeMark.</li>
        <li>Review the calculated pivot point.</li>
        <li>Review resistance and support levels for that method.</li>
      </ol>

      <h2
        id="how-to-trade"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Trade Pivot Points
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Traders often watch potential support near S levels, resistance near R
        levels, breakouts beyond those zones, and range behavior around the
        pivot. Combine with trend context, volume, confirmation, and stop-loss
        planning. Pivot points do not reliably predict market direction on their
        own.
      </p>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations of Pivot Points
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Levels depend on historical OHLC, can fail in volatile markets, and may
        produce false breakouts. Different timeframes and methods yield
        different maps. Use supporting analysis and risk controls rather than
        pivots alone.
      </p>

      <h2
        id="pp-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion items={[...PP_FAQS]} />
      </div>
    </article>
  );
}
