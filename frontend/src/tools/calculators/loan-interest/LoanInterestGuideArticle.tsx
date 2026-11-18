import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { LOAN_INTEREST_FAQS } from './content';

export function LoanInterestGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-loan-interest"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Loan Interest?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Loan interest is the cost of borrowing principal over a fixed term. This calculator
        amortizes a balance at a nominal annual rate with independent payment and compounding
        frequencies, then reports total interest, total payment, the periodic installment, and
        a yearly balances chart of principal remaining, principal paid, and interest paid.
      </p>

      <h2
        id="loan-interest-formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Loan Interest Formulas
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>r = (1 + APR / (100 × m))^(m / p) − 1</p>
        <p>n = term in years × p</p>
        <p>Payment = P × r / (1 − (1 + r)^(−n))</p>
        <p>When r = 0: Payment = P / n</p>
        <p>Total payment = Payment × n</p>
        <p>Interest = Total payment − Principal</p>
      </div>
      <p className="text-sm leading-relaxed text-foreground/90 sm:text-base">
        Here <span className="font-mono">m</span> is compounding periods per year and{' '}
        <span className="font-mono">p</span> is payments per year. The yearly chart samples the
        full amortization schedule at each year-end (and the final period).
      </p>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Loan balance = PKR 10,000</p>
        <p>Term = 10 years</p>
        <p>Interest rate = 4% APR</p>
        <p>Payment frequency = Monthly (p = 12)</p>
        <p>Compounding frequency = Monthly (m = 12)</p>
        <p>r = 0.04 / 12 ≈ 0.00333333</p>
        <p>n = 10 × 12 = 120</p>
        <p>Monthly payment ≈ PKR 101.25</p>
        <p>Total payment ≈ PKR 12,149.42</p>
        <p>Interest to be paid ≈ PKR 2,149.42</p>
      </div>

      <h2
        id="loan-interest-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...LOAN_INTEREST_FAQS]} />
      </div>
    </article>
  );
}
