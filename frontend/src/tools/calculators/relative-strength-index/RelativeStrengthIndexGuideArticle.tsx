import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { RSI_FAQS } from './content';

export function RelativeStrengthIndexGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is the Relative Strength Index?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The Relative Strength Index (RSI) is a momentum oscillator that measures
        the magnitude of recent price gains relative to recent price losses. It
        typically ranges from 0 to 100 and is used to gauge bullish or bearish
        momentum, potential overbought or oversold conditions, and momentum
 shifts. RSI is calculated from one security’s sequential closes; not
        by comparing two different securities.
      </p>

      <h2
        id="interpret"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Do You Interpret RSI?
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Below 30; commonly considered oversold (not a guaranteed bounce).</li>
        <li>30–50; lower momentum range.</li>
        <li>50; neutral reference.</li>
        <li>50–70; higher momentum range.</li>
        <li>Above 70; commonly considered overbought (not a guaranteed reversal).</li>
      </ul>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Strong trends can keep RSI in “extreme” zones for extended periods.
        Thresholds are contextual tools, not automatic buy or sell signals.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is the RSI Formula?
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>RSI = 100 − 100 / (1 + RS)</p>
        <p>RS = Average Gain / Average Loss</p>
        <p>Gain = max(ΔP, 0) · Loss = max(−ΔP, 0)</p>
      </div>

      <h2
        id="step-by-step"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate RSI Step by Step
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Worked example with period 5 and closes 100, 102, 101, 104, 103, 106:
      </p>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Changes: +2, −1, +3, −1, +3</p>
        <p>Gains: 2, 0, 3, 0, 3 → avg gain = 8/5 = 1.60</p>
        <p>Losses: 0, 1, 0, 1, 0 → avg loss = 2/5 = 0.40</p>
        <p>RS = 1.60 / 0.40 = 4</p>
        <p>RSI = 100 − 100/(1+4) = 80.00</p>
      </div>

      <h2
        id="wilder"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Wilder&apos;s RSI Smoothing
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>AvgGain_t = (AvgGain_(t−1)×(n−1) + Gain_t) / n</p>
        <p>AvgLoss_t = (AvgLoss_(t−1)×(n−1) + Loss_t) / n</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The first averages use a simple mean of the first n gains and losses.
        Later values use Wilder’s recursive smoother. Simple-average RSI instead
        recomputes a trailing mean each step and can diverge after the first
        reading.
      </p>

      <h2
        id="divergence"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        RSI Divergence
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Bullish divergence: price makes a lower low while RSI makes a higher
        low. Bearish divergence: price makes a higher high while RSI makes a
        lower high. Divergences can flag momentum disagreement but frequently
 fail; treat them as context, not certainty.
      </p>

      <h2
        id="markets"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        RSI in Trending and Ranging Markets
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        In strong uptrends RSI may stay elevated; in strong downtrends it may
        stay depressed. In ranging markets, crosses of 30/70 can be more useful
        as mean-reversion context. Always consider the market regime.
      </p>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations of RSI
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>False overbought/oversold signals in trends.</li>
        <li>Sensitivity to the chosen lookback period.</li>
        <li>Lagging nature of smoothed averages.</li>
        <li>Volatility and gaps can distort short samples.</li>
        <li>No guaranteed predictive accuracy on its own.</li>
      </ul>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use the RSI Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Choose the RSI period (default 14).</li>
        <li>Enter sequential closing prices, oldest to newest.</li>
        <li>Add rows until you have at least period + 1 prices.</li>
        <li>Select Wilder&apos;s RSI or simple-average RSI.</li>
        <li>Read average gain/loss, RS, RSI, and the interpretation.</li>
        <li>Review the RSI history sparkline when multiple readings exist.</li>
      </ol>

      <h2
        id="rsi-faq"
        className="mt-10 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion items={[...RSI_FAQS]} />
      </div>
    </article>
  );
}
