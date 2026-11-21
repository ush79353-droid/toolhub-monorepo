import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { MAXIMUM_DRAWDOWN_FAQS } from './content';

export function MaximumDrawdownGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2 id="what-is-mdd" className="text-xl font-bold tracking-tight text-accent sm:text-2xl">
        What is maximum drawdown?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Maximum drawdown (MDD) is the largest percentage decline in an investment’s value from a
        peak to a subsequent trough. It connects a peak portfolio value, the lowest later value,
        the percentage decline, and the absolute monetary loss. Investors use it to understand
        downside risk and historical volatility of path-dependent losses. MDD is a historical
 measure; it does not predict future losses.
      </p>

      <h2
        id="how-to-calculate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to calculate maximum drawdown
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>MDD = (Peak Value − Lowest Value) / Peak Value × 100</p>
        <p className="mt-2">Absolute Loss = Peak Value − Lowest Value</p>
      </div>
      <p className="text-sm leading-relaxed text-foreground/90 sm:text-base">
        Example: peak $15,000 and lowest subsequent value $12,500 → absolute loss $2,500 → MDD ≈
        16.67%. Interpret this as the investment fell about one-sixth from its prior high before
        recovering or continuing.
      </p>

      <h2 id="why-important" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Why is maximum drawdown important?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        MDD helps evaluate portfolio risk, strategy downside, risk tolerance, and capital
        preservation. Two investments with similar average returns can have very different drawdown
 profiles; one may be smoother while the other experiences deeper peak-to-trough declines.
      </p>

      <h2
        id="mdd-vs-volatility"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Maximum drawdown vs. volatility
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <strong>Maximum drawdown</strong> measures the largest peak-to-trough decline over a
        selected period. <strong>Volatility</strong> measures the variability of returns (often
        standard deviation). An investment can be volatile in both directions without matching
        another asset’s worst drawdown. Both metrics are useful in risk assessment and answer
        different questions.
      </p>

      <h2
        id="recovery-gains"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How much return is needed to recover from a drawdown?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The percentage gain required to return to the previous peak is larger than the percentage
        lost:
      </p>
      <div className="my-4 overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[320px] text-left text-sm">
          <thead className="bg-muted/60 text-xs text-muted-foreground">
            <tr>
              <th className="px-3 py-2 font-medium">Drawdown</th>
              <th className="px-3 py-2 font-medium">Required recovery gain</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['10%', '11.11%'],
              ['20%', '25%'],
              ['30%', '42.86%'],
              ['40%', '66.67%'],
              ['50%', '100%'],
              ['60%', '150%'],
              ['70%', '233.33%'],
              ['80%', '400%'],
              ['90%', '900%'],
            ].map(([d, g]) => (
              <tr key={d} className="border-t border-border">
                <td className="px-3 py-1.5 tabular-nums">{d}</td>
                <td className="px-3 py-1.5 tabular-nums">{g}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Recovery Gain = D / (1 − D) × 100</p>
      </div>
      <p className="text-sm leading-relaxed text-foreground/90 sm:text-base">
        Deeper drawdowns become increasingly hard to reverse because each additional percentage
        point of loss removes more of the remaining capital base.
      </p>

      <h2 id="step-by-step" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Step-by-step calculation
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Identify the investment’s peak value.</li>
        <li>Identify the lowest subsequent value after that peak.</li>
        <li>Subtract the lowest value from the peak (absolute loss).</li>
        <li>Divide the difference by the peak value.</li>
        <li>Multiply by 100 to express maximum drawdown as a percentage.</li>
      </ol>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Peak = $15,000 · Lowest = $12,500</p>
        <p>Absolute loss = 15,000 − 12,500 = $2,500</p>
        <p>MDD = 2,500 / 15,000 × 100 ≈ 16.67%</p>
      </div>

      <h2
        id="recovery-time"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How much time does it take to recover from a drawdown?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Under a constant annual compound growth rate <em>g</em>, recovery time in years is:
      </p>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>t = −ln(1 − D) / ln(1 + g)</p>
      </div>
      <p className="text-sm leading-relaxed text-foreground/90 sm:text-base">
        Example: a 20% drawdown (D = 0.20) with 10% assumed annual growth (g = 0.10) yields t ≈ 2.34
        years. Assumptions include constant compounding, no fees/taxes/withdrawals, and that growth
 actually materializes; none of which is guaranteed.
      </p>

      <h2 id="mdd-markets" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Maximum drawdown in different markets
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Stocks, cryptocurrencies, mutual funds, ETFs, bonds, and blended portfolios can show very
        different historical drawdowns because of volatility, liquidity, leverage, and
 diversification. Asset-class history is context; not a forecast of future market paths.
      </p>

      <h2 id="limitations" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Limitations of maximum drawdown
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        MDD depends on the selected period, may ignore recovery uncertainty, sequence of returns,
        unrealized versus realized losses, portfolio composition, currency effects, inflation, and
        fees/taxes. It is one risk measure and should not be used alone for investment decisions.
      </p>

      <h2 id="strategies" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Strategies for managing maximum drawdown
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Common risk-management approaches include diversification, position sizing, asset
        allocation, risk-tolerance assessment, rebalancing, stop-loss rules, cash allocation, and
        long-term planning. No strategy guarantees protection from losses.
      </p>

      <h2
        id="related-calculators"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related calculators
      </h2>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm sm:text-base">
        <li>
          <Link href="/tools/investment-calculator" className="text-primary hover:underline">
            Investment Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/average-return-calculator" className="text-primary hover:underline">
            Average Return Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/rate-of-return-calculator" className="text-primary hover:underline">
            Rate of Return Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/compound-interest-calculator" className="text-primary hover:underline">
            Compound Interest Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/roi-calculator" className="text-primary hover:underline">
            ROI Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/cagr-calculator" className="text-primary hover:underline">
            CAGR Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/savings-calculator" className="text-primary hover:underline">
            Savings Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/value-at-risk-calculator-var"
            className="text-primary hover:underline"
          >
            Value at Risk (VaR) Calculator
          </Link>
        </li>
      </ul>

      <h2 id="mdd-faq" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Frequently asked questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...MAXIMUM_DRAWDOWN_FAQS]} />
      </div>
    </article>
  );
}
