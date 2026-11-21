import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { STOCK_FAQS } from './content';

export function StockGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-stock-calculator"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is a Stock Calculator?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A stock calculator estimates profit, return on investment (ROI), and the
        break-even selling price for a round-trip share trade after percent
        brokerage commissions. Enter how many shares you traded, the buy and
        sell prices per share, and each commission rate. Totals stay distinct
        from per-share prices. Taxes, dividends, and extra fees are not modeled.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use This Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter the number of shares (must be greater than zero).</li>
        <li>
          Under Purchase of shares, enter the buying price per share and buying
          commission percent. Read the commission amount and net buying cost
          totals.
        </li>
        <li>
          Under Selling shares, enter the selling price per share and selling
          commission percent. Read the sale commission and net selling proceeds.
        </li>
        <li>
          Review profit, ROI %, and break-even selling price per share. Change
          any money field&apos;s currency to re-express amounts with stored FX
          rates; percents and share count never convert.
        </li>
      </ol>

      <h2
        id="stock-trading-formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Trading Formulas
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Gross purchase cost = N × B</p>
        <p>Buying commission = Gross purchase × b / 100</p>
        <p>Net buying cost = Gross purchase + Buying commission</p>
        <p>Gross sale proceeds = N × S</p>
        <p>Selling commission = Gross sale × s / 100</p>
        <p>Net selling proceeds = Gross sale − Selling commission</p>
        <p>Profit = Net selling proceeds − Net buying cost</p>
        <p>ROI (%) = Profit / Net buying cost × 100</p>
        <p>Break-even selling price/share = Net buying cost / [N × (1 − s/100)]</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        N is shares, B and S are per-share prices, and b and s are commission
        percents. Calculations keep full precision and round only for display.
        Zero commissions, losses, and zero profit are allowed. Selling
        commission of 100% leaves break-even undefined.
      </p>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Shares N = 100</p>
        <p>Buying price B = 50 · Buying commission b = 1%</p>
        <p>Selling price S = 60 · Selling commission s = 1%</p>
        <p>Gross purchase = 100 × 50 = 5,000</p>
        <p>Buying commission = 5,000 × 1% = 50 · Net buying cost = 5,050</p>
        <p>Gross sale = 100 × 60 = 6,000</p>
        <p>Selling commission = 6,000 × 1% = 60 · Net selling = 5,940</p>
        <p>Profit = 5,940 − 5,050 = 890</p>
        <p>ROI = 890 / 5,050 × 100 ≈ 17.6238%</p>
        <p>Break-even / share = 5,050 / [100 × 0.99] ≈ 51.0101</p>
      </div>

      <h2
        id="stock-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...STOCK_FAQS]} />
      </div>
    </article>
  );
}
