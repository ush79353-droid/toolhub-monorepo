import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { STUDENT_LOAN_PAYMENT_FAQS } from './content';

export function StudentLoanPaymentGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-student-loan-payment"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What This Calculator Estimates
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Estimate student loan periodic payments, interest, fee-inclusive totals, APR, and
        effective APR from a stated nominal or effective rate, compounding and payment
        frequencies, term, and prepaid / loaned / origination fees.
      </p>

      <h2
        id="student-loan-payment-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Payment & Fee Formula
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>r from nominal/effective rate + compound vs payment frequency</p>
        <p>n = term years × payments per year (months contribute years/12)</p>
        <p>Payment = P × r / (1 − (1 + r)^(−n)); if r = 0 → P / n</p>
        <p>APR: net proceeds = (Payment + prepaid/n) × annuity(r, n)</p>
        <p>Effective APR = (1 + r_apr)^paymentsPerYear − 1</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>
          Loan 10,000 PKR · 5% nominal monthly · 6 years monthly · prepaid 200 · loaned 500 ·
          origination 8% from loan amount
        </p>
        <p>Net proceeds 9,200 · financed 10,500 · payment ≈ 169.10 · 72 payments</p>
        <p>Total payment ≈ 12,375.33 · finance charge ≈ 3,175.33 · APR ≈ 10.31% · EAR ≈ 10.81%</p>
      </div>

      <h2
        id="student-loan-payment-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...STUDENT_LOAN_PAYMENT_FAQS]} />
      </div>
    </article>
  );
}
