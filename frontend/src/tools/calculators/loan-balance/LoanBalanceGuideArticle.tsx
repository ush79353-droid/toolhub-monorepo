import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { LOAN_BALANCE_FAQS } from './content';

export function LoanBalanceGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-loan-balance"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Remaining Loan Balance?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Remaining loan balance is the outstanding principal on a fixed-rate amortizing loan after
        a given number of scheduled monthly payments. This calculator estimates that balance from
 the original loan amount, annual interest rate, full term, and elapsed period; without
        extra payments or fees.
      </p>

      <h2
        id="loan-balance-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Loan Balance Formula
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>r = APR / 100 / 12</p>
        <p className="mt-2">M = P × r / (1 − (1+r)^(−n)) &nbsp;(r = 0 → M = P / n)</p>
        <p className="mt-2">
          B = P × (1+r)^k − M × (((1+r)^k − 1) / r) &nbsp;(r = 0 → B = P × (1 − k/n))
        </p>
        <p className="mt-2">n = years × 12 + months &nbsp;·&nbsp; k = elapsed months</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Loan = PKR 100,000</p>
        <p>Interest rate = 6% annually</p>
        <p>Loan term = 10 years (120 months)</p>
        <p>Period = 3 years (36 months)</p>
        <p>
          Monthly payment ≈ PKR 1,110.21 · Remaining balance after 36 payments ≈ PKR 75,996.91
        </p>
      </div>

      <h2
        id="loan-balance-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...LOAN_BALANCE_FAQS]} />
      </div>
    </article>
  );
}
