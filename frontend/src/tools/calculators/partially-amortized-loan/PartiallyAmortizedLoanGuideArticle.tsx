import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { PARTIALLY_AMORTIZED_FAQS } from './content';

export function PartiallyAmortizedLoanGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-partially-amortized"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is a Partially Amortized Loan?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A partially amortized loan uses a longer amortization schedule to set the monthly
        payment, but the borrower only makes those payments for a shorter period. At the end of
        that payment period, the remaining principal is due as a balloon payment.
      </p>

      <h2
        id="partially-amortized-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Formulas
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>r = APR / 100 / 12</p>
        <p className="mt-2">M = P × r / (1 − (1+r)^(−N)) &nbsp;(r = 0 → M = P / N)</p>
        <p className="mt-2">Total paid = M × K</p>
        <p className="mt-2">
          Balloon B = P × (1+r)^K − M × (((1+r)^K − 1) / r) &nbsp;(r = 0 → B = P − M×K)
        </p>
        <p className="mt-2">Total = Total paid + Balloon</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Full loan = PKR 100,000</p>
        <p>Annual interest rate = 6%/yr</p>
        <p>Amortization time = 20 years (N = 240)</p>
        <p>Payment period = 5 years (K = 60)</p>
        <p>Monthly payment ≈ PKR 716.43</p>
        <p>Total paid during payment period ≈ PKR 42,985.86</p>
        <p>Balloon payment ≈ PKR 84,899.60</p>
        <p>Total ≈ PKR 127,885.46</p>
      </div>

      <h2
        id="partially-amortized-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...PARTIALLY_AMORTIZED_FAQS]} />
      </div>
    </article>
  );
}
