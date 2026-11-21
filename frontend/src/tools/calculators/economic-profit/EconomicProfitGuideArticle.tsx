import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { ECONOMIC_PROFIT_FAQS } from './content';

export function EconomicProfitGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-economic-profit"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Economic Profit?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Economic profit measures whether a business earns more than its next-best alternative. It
        starts with total revenue, subtracts explicit cash costs, then also subtracts implicit
        opportunity costs such as forgone salary or capital returns. Unlike accounting profit, a
 zero economic profit still means a normal return was earned, just not above the opportunity
        cost of the resources used.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use This Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter total revenue for the period you are analyzing.</li>
        <li>Enter explicit costs (wages paid, rent, materials, and other cash expenses).</li>
        <li>
          Enter implicit costs (forgone wages, forgone interest, or other opportunity costs). Do not
          repeat amounts already listed as explicit costs.
        </li>
        <li>Read economic profit. Use each currency selector when amounts are in different units.</li>
      </ol>

      <h2
        id="economic-profit-formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Formulas
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Economic Profit = Total Revenue − Explicit Costs − Implicit Costs</p>
        <p>Accounting Profit = Total Revenue − Explicit Costs (implicit costs excluded)</p>
        <p>Inputs normalize into the total-revenue currency before subtracting</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Total revenue = 100,000 · Explicit costs = 40,000 · Implicit costs = 25,000</p>
        <p>Economic profit = 100,000 − 40,000 − 25,000 = 35,000</p>
        <p>Accounting profit for the same figures would be 60,000 (implicit costs not subtracted)</p>
      </div>

      <h2
        id="economic-profit-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...ECONOMIC_PROFIT_FAQS]} />
      </div>
    </article>
  );
}
