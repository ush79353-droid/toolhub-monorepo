import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { RV_LOAN_FAQS } from './content';

export function RvLoanGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-rv-loan"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is an RV Loan?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        An RV loan finances a recreational vehicle purchase after an optional down payment.
        This calculator estimates the financed principal, fixed monthly payment, total of
        installments, and financing cost (interest) from price, down payment, term, and
        nominal annual rate.
      </p>

      <h2
        id="rv-loan-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Payment Formula
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>P = RV price − down payment</p>
        <p>N = years × 12 + months</p>
        <p>r = APR / 100 / 12</p>
        <p>M = P × r / (1 − (1 + r)^(−N))</p>
        <p>When r = 0: M = P / N</p>
        <p>Total paid = M × N</p>
        <p>Cost of loan = total paid − P</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>RV price = 100,000 PKR · Down payment = 20,000 PKR</p>
        <p>Term = 5 years · Interest = 6%/yr</p>
        <p>Loan amount = 80,000 · N = 60</p>
        <p>Monthly payment ≈ 1,546.62 PKR</p>
        <p>Total paid ≈ 92,797.45 PKR · Cost of loan ≈ 12,797.45 PKR</p>
      </div>

      <h2
        id="rv-loan-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...RV_LOAN_FAQS]} />
      </div>
    </article>
  );
}
