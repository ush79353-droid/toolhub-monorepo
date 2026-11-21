import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { STOCK_SPLIT_FAQS } from './content';

export function StockSplitGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-stock-split"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is a Stock Split?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A stock split changes how many shares you hold and the price of each share without
        changing the theoretical value of your position. In an A-for-B split, every B old
        shares become A new shares. Forward splits (for example 2-for-1) increase share
        count and lower price; reverse splits (for example 1-for-5) do the opposite.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use This Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter the number of shares you hold before the split (must be positive).</li>
        <li>Enter the pre-split share price and choose its currency.</li>
        <li>
          Set the A-for-B ratio. A 2-for-1 split gives two new shares for every one old
          share; a 1-for-5 reverse split consolidates five shares into one.
        </li>
        <li>
          Read After stock split for the new share count and adjusted price. Change the
          after-price or portfolio-value currency to re-express results without changing
          the ratio or share count.
        </li>
      </ol>

      <h2
        id="stock-split-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Stock Split Formulas
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>New Shares = Original Shares × A / B</p>
        <p>New Share Price = Original Share Price × B / A</p>
        <p>Portfolio Value Before = Original Shares × Original Share Price</p>
        <p>Portfolio Value After = New Shares × New Share Price</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A and B must be positive. Share price must be zero or greater. Calculations keep
        full precision and round only for display. Fractional shares are allowed
        mathematically; brokers may use cash-in-lieu instead. Taxes, fees, and dividends
        are not modeled.
      </p>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Original shares = 100</p>
        <p>Original share price = 50 PKR</p>
        <p>Split ratio = 2-for-1</p>
        <p>New shares = 100 × 2 / 1 = 200</p>
        <p>New share price = 50 × 1 / 2 = 25 PKR</p>
        <p>Portfolio before = 100 × 50 = 5,000 PKR</p>
        <p>Portfolio after = 200 × 25 = 5,000 PKR</p>
      </div>

      <h2
        id="stock-split-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-3">
        <FAQAccordion faqs={[...STOCK_SPLIT_FAQS]} />
      </div>
    </article>
  );
}
