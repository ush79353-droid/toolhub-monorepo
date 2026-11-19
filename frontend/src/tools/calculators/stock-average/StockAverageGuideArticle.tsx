import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { STOCK_AVERAGE_FAQS } from './content';

export function StockAverageGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-stock-average"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is a Stock Average?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A stock average (cost basis per share) is the weighted average price you paid
        across purchases. It answers “what did I really pay per share?” when you bought
        the same stock at different prices and quantities. This calculator uses two
        purchases, matches a simple buy-average workflow, and optionally marks your
        position to the current market price.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use This Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          Optionally enter the current stock price and choose its currency (independent
          FX).
        </li>
        <li>
          Enter the 1st buy share count and per-share price with its currency.
        </li>
        <li>
          Enter the 2nd buy share count and per-share price with its currency.
        </li>
        <li>
          Read total shares, total investment cost, and weighted average buying price.
          With a current price, also see market value, unrealized profit/loss, and return
          %.
        </li>
      </ol>

      <h2
        id="stock-average-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Weighted Average Formulas
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Total Shares = Q1 + Q2</p>
        <p>Total Cost = Q1 × P1 + Q2 × P2</p>
        <p>Average Purchase Price = Total Cost / Total Shares</p>
        <p>Market Value = Total Shares × M (when current price M is provided)</p>
        <p>Unrealized Profit/Loss = Market Value − Total Cost</p>
        <p>Return (%) = Profit/Loss / Total Cost × 100 (undefined if Total Cost = 0)</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Share quantities must be positive. Prices must be zero or greater. Buy prices and
        the optional market price are normalized into the 1st buy price currency before
        math. Calculations keep full precision and round only for display. No commissions,
        dividends, or taxes are invented.
      </p>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Buy 100 shares at 50 and 50 shares at 60 (same currency). Total shares = 150.
        Total cost = 5,000 + 3,000 = 8,000. Average = 8,000 / 150 ≈ 53.3333. If the
        current price is 55, market value = 8,250, unrealized profit = 250, return ≈
        3.125%.
      </p>

      <h2
        id="stock-average-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion faqs={[...STOCK_AVERAGE_FAQS]} />
      </div>
    </article>
  );
}
