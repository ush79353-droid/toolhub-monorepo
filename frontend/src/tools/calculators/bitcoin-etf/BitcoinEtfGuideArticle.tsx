import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { BITCOIN_ETF_FAQS } from './content';

export function BitcoinEtfGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-bitcoin-etf-calculator"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is This Calculator?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This tool estimates how a lump-sum Bitcoin ETF investment might grow after an annual expense
        ratio and upfront other costs, using annual compounding. Figures are illustrative estimates
 only; not forecasts, guarantees, or advice.
      </p>

      <h2
        id="bitcoin-etf-formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Formulas & Assumptions
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Effective Annual Return = (1 + Expected Return / 100) × (1 − Expense Ratio / 100) − 1</p>
        <p>
          Future Value = (Investment Amount − Upfront Other Costs) × (1 + Effective Annual
          Return)^Duration
        </p>
        <p>
          Total Cost = Other Costs + Σ yearly expense fees (fee = post-return balance × expense
          ratio)
        </p>
      </div>
      <p className="text-sm leading-relaxed text-foreground/90 sm:text-base">
        Compounding is annual. No live prices. Currency selection changes denomination labels only.
      </p>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 space-y-1 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Investment = 10,000; other costs = 0; duration = 1 year</p>
        <p>Expected return = 10%; expense ratio = 1%</p>
        <p>Effective return = 1.10 × 0.99 − 1 = 8.9%</p>
        <p>Future value = 10,000 × 1.089 = 10,890</p>
        <p>Expense fee ≈ 10,000 × 1.10 × 1% = 110; total cost = 110</p>
      </div>

      <h2 id="bitcoin-etf-faq" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...BITCOIN_ETF_FAQS]} />
      </div>
    </article>
  );
}
