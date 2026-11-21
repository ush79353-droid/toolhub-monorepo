import * as React from 'react';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { AVERAGE_FIXED_COST_FAQS } from './content';

export function AverageFixedCostGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-average-fixed-cost"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Average Fixed Cost?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Average fixed cost (AFC) measures how much of a firm’s fixed overhead is attributed to each
        unit of output. Managers use it when pricing, capacity planning, and comparing production
 levels, because the same rent or salaried overhead looks smaller per unit when volume rises.
      </p>

      <h2
        id="average-fixed-cost-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Average Fixed Cost Formula
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The calculator uses the standard microeconomics identity:
      </p>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        Average Fixed Cost = Total Fixed Cost ÷ Number of Units
      </div>

      <h2
        id="how-to-calculate-afc"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Average Fixed Cost
      </h2>
      <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter total fixed cost for the period (non-negative).</li>
        <li>Enter the number of units produced or sold (must be greater than zero).</li>
        <li>The average fixed cost updates automatically as you type.</li>
      </ol>

      <h2 id="afc-example" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Worked Example
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A workshop has 10,000 in fixed costs this month and produces 200 units:
      </p>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Average Fixed Cost = 10,000 ÷ 200 = 50.00 per unit</p>
      </div>

      <h2
        id="fixed-vs-variable"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Fixed vs Variable Costs
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Fixed costs do not change with short-run output; variable costs do. Average fixed cost covers
        only the fixed portion. To study full unit cost you would also include average variable cost
 and average total cost, this tool stays focused on AFC alone.
      </p>

      <h2 id="afc-faq" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={AVERAGE_FIXED_COST_FAQS} />
      </div>
    </article>
  );
}
