import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { BI_WEEKLY_MORTGAGE_PAYMENT_FAQS } from './content';

export function BiWeeklyMortgagePaymentGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-bi-weekly-mortgage-payment"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is a Bi-Weekly Mortgage Payment?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A bi-weekly mortgage payment plan compares a standard monthly repayment
 schedule with accelerated bi-weekly payments; half the monthly installment
        every 14 days (26 payments per year). The extra half-payment each year goes
        straight to principal, shortening the term and cutting total interest. This
        is not the same as twice-monthly (24/year) payments.
      </p>

      <h2
        id="bi-weekly-mortgage-payment-formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Formulas
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>M = P × r / (1 − (1 + r)^(-n)) &nbsp;(r = 0 → M = P / n)</p>
        <p>Accelerated bi-weekly payment = M / 2 &nbsp;(26 payments / year)</p>
        <p>Each period: interest = balance × period rate; remainder reduces principal</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Mortgage 300,000 · 7.5% · 30 years · Monthly (UK &amp; US) compounding</p>
        <p>Monthly payment ≈ 2,097.64</p>
        <p>Accelerated bi-weekly ≈ 1,048.82 every 14 days</p>
        <p>Baseline term 30 yrs; bi-weekly finishes earlier with lower total interest</p>
      </div>

      <h2
        id="bi-weekly-mortgage-payment-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...BI_WEEKLY_MORTGAGE_PAYMENT_FAQS]} />
      </div>
    </article>
  );
}
