import * as React from 'react';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { COST_FUNCTION_FAQS } from './content';

export function CostFunctionGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-a-cost-function"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is a Cost Function?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A cost function links total cost to output quantity. Managers use the linear form
        TC(Q) = Fixed Cost + Variable Cost per Unit × Q to plan production, quote prices, and
 estimate break-even volume when fixed and variable costs are known, or when two total-cost
        observations can reveal those parameters.
      </p>

      <h2
        id="cost-function-formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Formulas
      </h2>
      <div className="my-4 space-y-3 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Total Cost = Fixed Cost + (Variable Cost per Unit × Quantity)</p>
        <p>Variable Cost per Unit = (Cost₂ − Cost₁) / (Quantity₂ − Quantity₁)</p>
        <p>Fixed Cost = Cost₁ − (Variable Cost per Unit × Quantity₁)</p>
        <p>TC(Q) = Fixed Cost + Variable Cost per Unit × Q</p>
      </div>

      <h2 id="how-to-use" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Use
      </h2>
      <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Choose fixed-and-variable mode or two-point mode.</li>
        <li>Enter only the fields for that mode. Results update automatically when inputs are valid.</li>
        <li>Use the same currency for every money field; the selector changes denomination only.</li>
      </ol>

      <h2
        id="cost-function-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Worked Example
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Fixed cost 1,000, variable cost 5 per unit, quantity 100:
      </p>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Total Cost = 1,000 + 5 × 100 = 1,500</p>
        <p>TC(Q) = 1,000.00 + 5.00 × Q</p>
      </div>

      <h2
        id="cost-function-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={COST_FUNCTION_FAQS} />
      </div>
    </article>
  );
}
