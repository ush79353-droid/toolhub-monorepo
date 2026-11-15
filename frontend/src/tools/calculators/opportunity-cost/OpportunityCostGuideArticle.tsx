import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { OPPORTUNITY_COST_FAQS } from './content';

export function OpportunityCostGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-opportunity-cost"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Opportunity Cost?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Opportunity cost is the value of the next-best alternative you give up. This calculator
        compares spending money today with investing it, applying income tax to earnings and
        adjusting the forgone gain for inflation so nominal and real amounts are not mixed.
      </p>

      <h2
        id="opportunity-cost-formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Formulas
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>t = Years + Months / 12</p>
        <p>Net Return = Annual Return × (1 − Tax)</p>
        <p>Total Savings (after tax) = P × (1 + Net Return)^t</p>
        <p>Real FV = Total Savings / (1 + Inflation)^t</p>
        <p>Opportunity Cost = Real FV − P</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Money to spend = PKR 100,000</p>
        <p>Annual return = 10%, Income tax = 20% → Net return = 8%</p>
        <p>Period = 1 year, Inflation = 5%</p>
        <p>Total savings after tax = 100,000 × 1.08 = PKR 108,000</p>
        <p>Real FV = 108,000 / 1.05 ≈ PKR 102,857.14</p>
        <p>Opportunity cost = 102,857.14 − 100,000 = PKR 2,857.14</p>
      </div>

      <h2
        id="opportunity-cost-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...OPPORTUNITY_COST_FAQS]} />
      </div>
    </article>
  );
}
