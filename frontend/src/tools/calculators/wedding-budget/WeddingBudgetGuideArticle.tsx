import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { WEDDING_BUDGET_FAQS } from './content';

export function WeddingBudgetGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-wedding-budget"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is a Wedding Budget?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A wedding budget tracks your planned spend against category expenses — attire,
        subcontractors, venue and catering, ceremony, transport, and any custom costs — then
        shows cost per guest and how much of the planned budget remains.
      </p>

      <h2
        id="wedding-budget-formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Formulas
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Section Total = Sum of section expenses</p>
        <p>Total Wedding Cost = Sum of section totals + custom expenses</p>
        <p>Cost per Guest = Total Wedding Cost / Number of Guests</p>
        <p>Budget Balance = Planned Budget − Total Wedding Cost</p>
        <p>Money lines normalize into the planned-budget currency; guests never convert</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Planned budget = 1,000,000 · Guests = 100</p>
        <p>Bride &amp; groom 200,000 + venue/food 500,000 + other sections 100,000 = total 800,000</p>
        <p>Cost per guest = 800,000 / 100 = 8,000</p>
        <p>Budget balance = 1,000,000 − 800,000 = 200,000 (under budget)</p>
      </div>

      <h2
        id="wedding-budget-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...WEDDING_BUDGET_FAQS]} />
      </div>
    </article>
  );
}
