import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { EARLY_LOAN_PAYOFF_FAQS } from './content';

export function EarlyLoanPayoffGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-early-payoff"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Early Loan Payoff?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Early loan payoff estimates how extra monthly principal payments change interest cost and
        payoff timing versus a baseline schedule with the same loan balance, term, rate, and
        compounding.
      </p>

      <h2
        id="payment-formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Payment Formulas
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>i = (1 + j/m)^(m/12) − 1 (monthly compounding: i = j/12)</p>
        <p>Level: M = P × i / (1 − (1+i)^(−n))</p>
        <p>Decreasing: principal share = P/n; payment = share + balance × i</p>
        <p>Interest savings = baseline interest − accelerated interest</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Loan balance = 10,000 PKR · Term = 10 years · Rate = 7.5% monthly compounding</p>
        <p>No extra payments → monthly repayment ≈ 118.70 · total interest ≈ 4,244.18</p>
      </div>

      <h2
        id="early-loan-payoff-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...EARLY_LOAN_PAYOFF_FAQS]} />
      </div>
    </article>
  );
}
