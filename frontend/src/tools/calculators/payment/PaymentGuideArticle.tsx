import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { PAYMENT_FAQS } from './content';

export function PaymentGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-payment-calculator"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is This Calculator?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Estimate a fixed monthly loan payment for a chosen term, or solve how long a fixed
        monthly payment takes to clear a balance. Results include totals, a principal-versus-
        interest doughnut, annual and monthly amortization tables, and a repayment chart.
      </p>

      <h2
        id="payment-formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Formulas
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>r = Annual Interest Rate / 1200</p>
        <p>n = Years × 12</p>
        <p>Payment = P × r / (1 − (1+r)^(-n))</p>
        <p>Zero interest: Payment = P / n</p>
        <p>Fixed payments: n = ln(PMT / (PMT − P·r)) / ln(1+r)</p>
        <p>Total Interest = Total Repayment − Principal</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>$200,000 · 15 years · 6% fixed term</p>
        <p>r = 0.005 · n = 180</p>
        <p>Monthly payment ≈ $1,687.71</p>
        <p>Total of 180 payments ≈ $303,788.46 · Interest ≈ $103,788.46</p>
      </div>

      <h2
        id="payment-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...PAYMENT_FAQS]} />
      </div>
    </article>
  );
}
