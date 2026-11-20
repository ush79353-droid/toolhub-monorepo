import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { FIB_FAQS } from './content';

export function FibonacciRetracementGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-are"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Are Fibonacci Levels?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Fibonacci levels are ratios used in technical analysis to mark possible
        retracement and extension prices within or beyond a selected swing.
        They do not reliably predict future prices by themselves.
      </p>

      <h2
        id="sequence"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        The Fibonacci Sequence
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, …</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        After the first two terms, each number is the sum of the previous two.
        Ratios of consecutive large terms approach the golden ratio.
      </p>

      <h2
        id="golden-ratio"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        The Golden Ratio
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>φ = (1 + √5) / 2 ≈ 1.618</p>
        <p>Related retracement ≈ 61.8%</p>
      </div>

      <h2
        id="retracement"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Are Fibonacci Retracement Levels?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Retracements mark possible pullback zones inside a measured high–low
        range: 23.6%, 38.2%, 50%, 61.8%, 76.4%, 78.6%, and 100%. The 50% midpoint
        is widely used even though it is not a Fibonacci ratio.
      </p>

      <h2
        id="extension"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Are Fibonacci Extension Levels?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Extensions project hypothetical targets beyond the measured move using
        ratios such as 100%, 127.2%, 161.8%, 200%, and 261.8%. This calculator
        uses a two-price convention; three-point extensions may differ across
        platforms.
      </p>

      <h2
        id="retracement-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Fibonacci Retracement Formula
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Uptrend: High − (High − Low) × Ratio</p>
        <p>Downtrend: Low + (High − Low) × Ratio</p>
        <p>Example Low 100 · High 200 · 61.8%</p>
        <p>Uptrend → 138.2 · Downtrend → 161.8</p>
      </div>

      <h2
        id="extension-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Fibonacci Extension Formula
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Uptrend: Low + (High − Low) × Ratio</p>
        <p>Downtrend: High − (High − Low) × Ratio</p>
        <p>161.8% example: uptrend 261.8 · downtrend 38.2</p>
      </div>

      <h2
        id="how-to-calculate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Fibonacci Retracement
      </h2>
      <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Identify a swing low and swing high.</li>
        <li>Compute the price difference.</li>
        <li>Choose uptrend or downtrend orientation.</li>
        <li>Apply each ratio with the matching formula.</li>
        <li>Plot or review the resulting prices.</li>
      </ol>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use the Fibonacci Retracement Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Select Uptrend or Downtrend.</li>
        <li>Choose Retracement or Extension levels.</li>
        <li>Enter the low price.</li>
        <li>Enter the high price.</li>
        <li>Review the price difference.</li>
        <li>Review the calculated Fibonacci levels.</li>
        <li>Compare levels with charts and other analysis.</li>
      </ol>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The calculator does not choose swing points for you.
      </p>

      <h2
        id="trading"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use Fibonacci Levels in Trading
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Traders sometimes use levels to study pullbacks, possible support or
        resistance, and hypothetical targets. Treat them as reference points,
        not guarantees or investment advice.
      </p>

      <h2
        id="support-resistance"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Fibonacci Support and Resistance
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Price may pause near popular ratios, especially with confluence from
        other tools. Pauses are not assured reversals.
      </p>

      <h2
        id="uptrends"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Fibonacci Levels in Uptrends
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Retracements are measured down from the high. Extensions project above
        the high under this calculator&apos;s two-price model.
      </p>

      <h2
        id="downtrends"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Fibonacci Levels in Downtrends
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Retracements are measured up from the low. Extensions project below the
        low and can become negative mathematically.
      </p>

      <h2
        id="ratios"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Common Fibonacci Ratios
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Retracement set: 0%, 23.6%, 38.2%, 50%, 61.8%, 76.4%, 78.6%, 100%.
        Extension set: 0%, 61.8%, 100%, 127.2%, 161.8%, 200%, 261.8%. Other
        platforms may omit or add ratios.
      </p>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Advantages and Limitations
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Easy, consistent ratios across price scales</li>
        <li>Swing selection is subjective</li>
        <li>Extension conventions differ by platform</li>
        <li>Markets need not respect Fibonacci levels</li>
        <li>Useful as a complement, not a standalone system</li>
      </ul>

      <h2
        id="fib-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion items={[...FIB_FAQS]} />
      </div>
    </article>
  );
}
