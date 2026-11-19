import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { EV_TO_SALES_FAQS } from './content';

export function EvToSalesGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-ev-to-sales"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is EV to Sales?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Enterprise value (EV) estimates the total firm value available to all capital
        providers. EV to sales divides that value by period sales (revenues) to compare
        companies on a sales multiple. This calculator does not invent EBITDA, earnings, or
        other valuation modes.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use This Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter cash, market capitalization, and total debt with their currencies.</li>
        <li>Adjust minority interest and preferred shares (defaults 0) if needed.</li>
        <li>Read enterprise value; change its currency to re-express the same EV.</li>
        <li>Enter sales (revenues) and read the dimensionless EV to sales ratio.</li>
      </ol>

      <h2
        id="ev-to-sales-formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        EV and EV/Sales Formulas
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>
          Enterprise Value = Market Capitalization + Total Debt + Minority Interest +
          Preferred Shares − Cash and Cash Equivalents
        </p>
        <p>EV to Sales = Enterprise Value / Sales Revenue</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Money inputs normalize into the market-cap currency before the formulas run. Full
        precision is kept; display rounding only. Zero sales makes EV/Sales undefined (not
        Infinity). Negative EV is allowed.
      </p>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Market cap 1,000,000 · Debt 200,000 · Minority 0 · Preferred 0 · Cash 50,000</p>
        <p>EV = 1,000,000 + 200,000 + 0 + 0 − 50,000 = 1,150,000</p>
        <p>Sales = 500,000 → EV/Sales = 1,150,000 / 500,000 = 2.3</p>
      </div>

      <h2
        id="ev-to-sales-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-3 not-prose">
        <FAQAccordion faqs={[...EV_TO_SALES_FAQS]} />
      </div>
    </article>
  );
}
