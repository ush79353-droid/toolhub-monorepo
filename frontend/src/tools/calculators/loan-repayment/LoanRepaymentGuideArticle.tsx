import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { LOAN_REPAYMENT_FAQS } from './content';

export function LoanRepaymentGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-loan-repayment"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is a Loan Repayment Calculator?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A loan repayment (loan payoff) calculator estimates monthly payments, total interest,
        balances over time, and yearly repayment structure from loan amount, term, interest rate,
        compounding, and optional extra monthly payments.
      </p>

      <h2
        id="payment-formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Payment Formulas
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>r = (1 + annualRate/m)^(m/12) − 1 (monthly compounding: r = annualRate/12)</p>
        <p>Even total: M = P × r / (1 − (1+r)^(−n)); r = 0 → M = P/n</p>
        <p>Even principal: principal share = P/n; payment = share + balance × r</p>
        <p>Extra payments apply to outstanding principal after the scheduled principal share</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Loan amount = 10,000 PKR · Term = 10 years · Rate = 7.5% monthly compounding</p>
        <p>Even total payments, no extra → monthly repayment ≈ 118.70 · total interest ≈ 4,244.18</p>
      </div>

      <h2
        id="loan-repayment-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...LOAN_REPAYMENT_FAQS]} />
      </div>
    </article>
  );
}
