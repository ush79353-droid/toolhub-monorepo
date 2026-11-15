import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { RATE_OF_RETURN_FAQS } from './content';

export function RateOfReturnGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-rate-of-return-calculator"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is a Rate of Return Calculator?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This calculator finds the annual nominal rate of return that connects an initial investment
        to a final amount over a chosen holding period. You can include interim deposits or
        withdrawals, choose how often interest compounds, and select cash-flow frequency and timing.
      </p>

      <h2
        id="rate-of-return-formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Formulas
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Without cash flows:</p>
        <p>r = m × [(FV / PV)^(1 / (m × t)) − 1]</p>
        <p className="mt-2">With cash flows (solve r such that projected FV matches the final amount):</p>
        <p>i = (1 + r / m)^(m / f) − 1</p>
        <p>FV = PV × (1 + i)^n + PMT × [((1 + i)^n − 1) / i] × (beginning ? (1 + i) : 1)</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Initial investment = PKR 1,000</p>
        <p>Final amount received = PKR 5,000</p>
        <p>Investment length = 10 years</p>
        <p>Compounding = Monthly (m = 12)</p>
        <p>Periodic cash flow = 0</p>
        <p>r = 12 × [(5)^(1 / 120) − 1] ≈ 16.203%</p>
      </div>

      <h2
        id="rate-of-return-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...RATE_OF_RETURN_FAQS]} />
      </div>
    </article>
  );
}
