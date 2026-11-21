import * as React from 'react';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { BREAK_EVEN_FAQS } from './content';

export function BreakEvenGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2 id="what-is-break-even" className="text-xl font-bold tracking-tight text-accent sm:text-2xl">
        What Is Break-even?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
 Break-even analysis finds how many units you must sell, and the revenue that volume
 produces, before fixed costs are covered by contribution margin. It is a planning check, not
        a full profit-and-loss statement.
      </p>

      <h2
        id="break-even-formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Break-even Formulas
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Contribution per unit = Revenue per unit − Cost per unit</p>
        <p>Margin (%) = (Contribution ÷ Revenue per unit) × 100</p>
        <p>Markup (%) = (Contribution ÷ Cost per unit) × 100</p>
        <p>Break-even units = Fixed costs ÷ Contribution per unit</p>
        <p>Units to sell = ceil(Break-even units)</p>
        <p>Break-even revenue = Units to sell × Revenue per unit</p>
      </div>

      <h2
        id="how-to-calculate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate
      </h2>
      <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter revenue per unit, variable cost per unit, and fixed costs.</li>
        <li>Confirm contribution is positive (price above variable cost).</li>
        <li>Read margin, markup, units to sell, and break-even revenue as they update.</li>
      </ol>

      <h2
        id="margin-vs-markup"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Margin vs Markup
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Margin expresses contribution as a share of selling price. Markup expresses the same
        contribution as a share of cost. They move together but are not interchangeable percentages.
      </p>

      <h2 id="worked-example" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Worked Example
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Revenue 100, cost 60, fixed costs 2,000:
      </p>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Contribution = 40</p>
        <p>Margin = 40%</p>
        <p>Markup = 66.67%</p>
        <p>Units to sell = ceil(2,000 ÷ 40) = 50</p>
        <p>Break-even revenue = 50 × 100 = 5,000</p>
      </div>

      <h2 id="break-even-faq" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={BREAK_EVEN_FAQS} />
      </div>
    </article>
  );
}
