import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { ACCOUNTING_PROFIT_FAQS } from './content';

export function AccountingProfitGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-accounting-profit"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Accounting Profit?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Accounting profit is total revenue minus explicit costs recorded in the
 books, operation expenses, interest, depreciation, and taxes in this
        calculator. It does not subtract opportunity or implicit costs, so it
        differs from economic profit.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use This Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter total revenue and choose its currency.</li>
        <li>
          Enter operation expenses that exclude interest, depreciation, and
          taxes (those have their own fields).
        </li>
        <li>Enter interest, depreciation, and taxes as nonnegative amounts.</li>
        <li>
          Read total explicit costs and accounting profit. Change result
          currencies to re-express the same totals without changing the math.
        </li>
      </ol>

      <h2
        id="accounting-profit-formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Formulas
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>
          Total Explicit Costs = Operation Expenses + Interest + Depreciation +
          Taxes
        </p>
        <p>Accounting Profit = Total Revenue − Total Explicit Costs</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Calculations keep full precision and round only for display. Zero
        expenses and negative profit (loss) are allowed. Invalid or non-finite
        inputs produce no result.
      </p>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Total revenue = 100,000</p>
        <p>Operation expenses = 25,000</p>
        <p>Interest = 12,000 · Depreciation = 10,000 · Taxes = 15,000</p>
        <p>Total explicit costs = 25,000 + 12,000 + 10,000 + 15,000 = 62,000</p>
        <p>Accounting profit = 100,000 − 62,000 = 38,000</p>
      </div>

      <h2
        id="accounting-profit-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...ACCOUNTING_PROFIT_FAQS]} />
      </div>
    </article>
  );
}
