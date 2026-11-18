import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { HOME_MORTGAGE_FAQS } from './content';

export function HomeMortgageGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-home-mortgage"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is a Home Mortgage?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A Home Mortgage (mortgage) finances a property purchase. Equal periodic
        payments cover interest and principal over the term. Optional private
        mortgage insurance (PMI) may apply when the down payment is below 20%.
      </p>

      <h2
        id="home-mortgage-formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Formulas
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Loan = Home value − Down payment</p>
        <p>Down payment % = Down payment / Home value × 100</p>
        <p>M = P × r / (1 − (1 + r)^(-n)) &nbsp;(r = 0 → M = P / n)</p>
        <p>Periodic PMI = Loan × (annual PMI % / 100) / periods per year</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Home 150,000 · Down 10% (15,000) · Loan 135,000</p>
        <p>4.5% · 30 years · Monthly (US & UK) · Monthly payments</p>
        <p>
          Payment ≈ 684.03 · 360 payments · Total ≈ 246,249.06 · Interest ≈
          111,249.06
        </p>
        <p>
          PMI 0.5%/yr → 56.25 per month · 73 periods → 4,106.25 until LTV ≤ 80%
        </p>
        <p>Total with costs ≈ 250,355.31</p>
      </div>

      <h2
        id="home-mortgage-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...HOME_MORTGAGE_FAQS]} />
      </div>
    </article>
  );
}
