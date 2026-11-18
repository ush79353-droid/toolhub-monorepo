import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { MORTGAGE_ACCELERATION_FAQS } from './content';

export function MortgageAccelerationGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-mortgage-acceleration"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Mortgage Acceleration?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Mortgage acceleration compares a standard monthly repayment schedule with a
        faster option — typically accelerated bi-weekly payments, ordinary bi-weekly
        payments, or monthly payments with overpayment. Paying more frequently or
        adding extra principal shortens the term and cuts total interest.
      </p>

      <h2
        id="mortgage-acceleration-formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Formulas
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>M = P × r / (1 − (1 + r)^(-n)) &nbsp;(r = 0 → M = P / n)</p>
        <p>Accelerated bi-weekly payment = M / 2 &nbsp;(26 payments / year)</p>
        <p>Ordinary bi-weekly payment = (M × 12) / 26</p>
        <p>Each period: interest = balance × period rate; remainder reduces principal</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Loan 300,000 · 7.5% · 30 years · Monthly (UK &amp; US) compounding</p>
        <p>Monthly payment ≈ 2,097.64</p>
        <p>Accelerated bi-weekly ≈ 1,048.82 every 14 days</p>
        <p>Baseline term 30 yrs; accelerated finishes earlier with lower total interest</p>
      </div>

      <h2
        id="mortgage-acceleration-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...MORTGAGE_ACCELERATION_FAQS]} />
      </div>
    </article>
  );
}
