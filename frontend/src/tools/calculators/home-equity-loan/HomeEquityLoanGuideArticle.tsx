import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { HOME_EQUITY_LOAN_FAQS } from './content';

export function HomeEquityLoanGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-home-equity-loan"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is a Home Equity Loan?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A home equity loan is a fixed-term installment loan secured by home equity. This
        calculator estimates the scheduled monthly payment, total of all payments, and total
        interest from loan amount, annual rate, and term in years.
      </p>

      <h2
        id="home-equity-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Payment Formula
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>r = APR / 1200</p>
        <p>n = years × 12</p>
        <p>Payment = P × r / (1 − (1 + r)^(−n))</p>
        <p>When r = 0: Payment = P / n</p>
        <p>Total of payments = Payment × n</p>
        <p>Total interest = Total of payments − P</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Loan amount = $150,000 · Interest = 8% · Term = 15 years</p>
        <p>n = 180 · Monthly pay ≈ $1,433.48</p>
        <p>Total of 180 payments ≈ $258,026.06 · Total interest ≈ $108,026.06</p>
      </div>

      <h2
        id="home-equity-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...HOME_EQUITY_LOAN_FAQS]} />
      </div>
    </article>
  );
}
