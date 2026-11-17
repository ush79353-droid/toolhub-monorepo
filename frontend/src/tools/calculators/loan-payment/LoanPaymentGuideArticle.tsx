import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { LOAN_PAYMENT_FAQS } from './content';

export function LoanPaymentGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-loan-payment"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is a Loan Payment?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A loan payment is the recurring amount that amortizes a fixed principal over a chosen term
        and payment frequency. This calculator reports the number of installments, the periodic
        interest rate, each periodic payment, and the total of all payments.
      </p>

      <h2
        id="loan-payment-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Loan Payment Formulas
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>n = (Years + Months / 12) × Payments Per Year</p>
        <p className="mt-2">r = (Annual Rate / 100) / Payments Per Year</p>
        <p className="mt-2">Payment = P × r / (1 − (1 + r)^(-n))</p>
        <p className="mt-2">When r = 0: Payment = P / n</p>
        <p className="mt-2">Loan Payment Total = Payment × n</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Loan amount = 100,000 PKR · Annual rate = 5% · Term = 5 yrs 0 mos · Yearly</p>
        <p>n = 5 · r = 5% · Payment ≈ 23,097.48 PKR · Total ≈ 115,487.40 PKR</p>
      </div>

      <h2
        id="loan-payment-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...LOAN_PAYMENT_FAQS]} />
      </div>
    </article>
  );
}
