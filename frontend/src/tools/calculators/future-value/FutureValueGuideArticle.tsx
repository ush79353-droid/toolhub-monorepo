import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { FUTURE_VALUE_FAQS } from './content';

export function FutureValueGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-future-value"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Future Value?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Future value is what a present amount grows to after compounding for a number of periods,
        optionally with recurring deposits or withdrawals.
      </p>

      <h2
        id="future-value-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Future Value Formula
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>FV = PV × (1 + r)^n</p>
        <p className="mt-2">Total Interest = FV − PV</p>
        <p className="mt-2">With contributions: Total Interest = FV − PV − Net Contributions</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Present value = PKR 10,000</p>
        <p>Interest rate = 5% per period</p>
        <p>Periods = 3</p>
        <p>Future value = 10,000 × (1.05)^3 = PKR 11,576.25</p>
        <p>Total interest = 11,576.25 − 10,000 = PKR 1,576.25</p>
      </div>

      <h2
        id="future-value-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...FUTURE_VALUE_FAQS]} />
      </div>
    </article>
  );
}
