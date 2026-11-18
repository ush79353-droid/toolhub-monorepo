import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { SIMPLE_MORTGAGE_FAQS } from './content';

export function SimpleMortgageGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-simple-mortgage"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What This Calculator Estimates
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Estimate a fixed-rate mortgage monthly payment from loan amount, yearly interest
        rate, and term. Optional taxes, insurance, and fees stay unavailable until verified
        charge fields are sourced.
      </p>

      <h2
        id="simple-mortgage-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Payment Formula
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>r = APR / 1200</p>
        <p>n = years × 12 (or months when unit is mos)</p>
        <p>Payment = P × r / (1 − (1 + r)^(−n))</p>
        <p>When r = 0: Payment = P / n</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Loan = 200,000 PKR · Rate = 4.5% · Term = 30 years</p>
        <p>n = 360 · Monthly payment ≈ 1,013.37 PKR</p>
      </div>

      <h2
        id="simple-mortgage-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...SIMPLE_MORTGAGE_FAQS]} />
      </div>
    </article>
  );
}
