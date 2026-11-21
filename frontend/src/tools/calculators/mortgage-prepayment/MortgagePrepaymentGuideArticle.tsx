import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { MORTGAGE_PREPAYMENT_FAQS } from './content';

export function MortgagePrepaymentGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-mortgage-prepayment"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Mortgage Prepayment?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
 Mortgage prepayment means sending extra money toward principal, on a regular schedule,
 as a lump sum, or both, while keeping the contractual installment. That shortens the
        amortization and reduces total interest.
      </p>

      <h2
        id="mortgage-prepayment-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Prepayments Work
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Scheduled payment from standard amortization (P, r, n)</p>
        <p>Each period: interest = balance × period rate</p>
        <p>Apply scheduled payment + extras to principal (capped at payoff)</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 space-y-1 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>PKR 100,000 · 6% · 30 years · Monthly (US & UK)</p>
        <p>Scheduled payment ≈ PKR 599.55 monthly · 360 payments</p>
        <p>Total interest ≈ PKR 115,838.19 · Total payment ≈ PKR 215,838.19</p>
      </div>

      <h2
        id="mortgage-prepayment-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...MORTGAGE_PREPAYMENT_FAQS]} />
      </div>
    </article>
  );
}
