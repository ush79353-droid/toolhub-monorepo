import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { MORTGAGE_AMORTIZATION_FAQS } from './content';

export function MortgageAmortizationGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-mortgage-amortization"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Mortgage Amortization?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Mortgage amortization schedules equal monthly principal-and-interest payments over a
        fixed term. This calculator also estimates optional housing costs (taxes, insurance,
        PMI, HOA, and other annual fees) as monthly and lifetime out-of-pocket totals.
      </p>

      <h2
        id="ma-formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Formulas
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>P = Home × (1 − Down% / 100)</p>
        <p>r = APR / 1200 · n = years × 12</p>
        <p>M = P × r / (1 − (1 + r)^(−n))</p>
        <p>When r = 0: M = P / n</p>
        <p>Total interest = M × n − P</p>
        <p>Monthly tax = Home × (tax% / 100) / 12</p>
        <p>Monthly fee = Annual fee / 12</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Home $500,000 · Down 20% · Loan $400,000 · 30 years · 7.319%</p>
        <p>Monthly mortgage ≈ $2,747.45 · 360 payments ≈ $989,082.16 · Interest ≈ $589,082.16</p>
        <p>Tax 1.2% → $500/mo · Insurance $2,500/yr → $208.33/mo · Other $5,000/yr → $416.67/mo</p>
        <p>Out-of-pocket ≈ $3,872.45/mo · $1,394,082.16 total · Payoff Nov. 2056</p>
      </div>

      <h2 id="ma-faq" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...MORTGAGE_AMORTIZATION_FAQS]} />
      </div>
    </article>
  );
}
