import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { BOAT_LOAN_FAQS } from './content';

export function BoatLoanGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-boat-loan"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is a Boat Loan?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A boat loan is a fixed-term installment loan used to finance a boat purchase. This
        calculator estimates the scheduled monthly principal-and-interest payment and the total
        interest paid over the life of the loan from amount, term, and nominal annual rate.
      </p>

      <h2
        id="boat-loan-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Monthly Payment Formula
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>r = APR / 100 / 12</p>
        <p>n = years × 12 (or months as entered)</p>
        <p>M = P × r / (1 − (1 + r)^(−n))</p>
        <p>When r = 0: M = P / n</p>
        <p>Total interest = (M × n) − P</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Loan amount = 100,000 PKR</p>
        <p>Term = 5 years (60 monthly payments)</p>
        <p>Annual interest rate = 5%</p>
        <p>Monthly payment ≈ 1,887.12 PKR</p>
        <p>Total interest paid ≈ 13,227.40 PKR</p>
      </div>

      <h2
        id="boat-loan-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...BOAT_LOAN_FAQS]} />
      </div>
    </article>
  );
}
