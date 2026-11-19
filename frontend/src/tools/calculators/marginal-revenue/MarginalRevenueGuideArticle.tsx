import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { MARGINAL_REVENUE_FAQS } from './content';

export function MarginalRevenueGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-marginal-revenue"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Marginal Revenue?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Marginal revenue is the additional revenue from selling one more unit. This
        calculator uses the discrete approximation ΔTR/ΔQ from an observed change in
        total revenue and quantity — not a continuous derivative, and not a cost,
        profit, or elasticity model.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use This Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter initial and final revenue with their currencies.</li>
        <li>Enter initial and final quantity (units; never FX-converted).</li>
        <li>Read ΔTR, ΔQ, and marginal revenue (revenue per additional unit).</li>
        <li>If quantity does not change, MR stays undefined — no division by zero.</li>
      </ol>

      <h2
        id="marginal-revenue-formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Formulas
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Change in Total Revenue (ΔTR) = Final Revenue − Initial Revenue</p>
        <p>Change in Quantity (ΔQ) = Final Quantity − Initial Quantity</p>
        <p>Marginal Revenue ≈ ΔTR / ΔQ (undefined when ΔQ = 0)</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Initial revenue = 10,000 PKR · Final revenue = 12,500 PKR</p>
        <p>ΔTR = 2,500 PKR</p>
        <p>Initial quantity = 100 · Final quantity = 125</p>
        <p>ΔQ = 25</p>
        <p>Marginal revenue = 2,500 / 25 = 100 PKR per unit</p>
      </div>

      <h2
        id="marginal-revenue-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-3 not-prose">
        <FAQAccordion faqs={[...MARGINAL_REVENUE_FAQS]} />
      </div>
    </article>
  );
}
