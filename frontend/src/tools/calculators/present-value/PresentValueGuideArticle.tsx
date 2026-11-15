import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { PRESENT_VALUE_FAQS } from './content';

export function PresentValueGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-present-value"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Present Value?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Present value discounts a future amount back to today using a per-period interest rate. It
        answers how much you would need now to reach a target future value after compounding.
      </p>

      <h2
        id="present-value-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Formulas
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Present Value = Future Value ÷ (1 + r)^n</p>
        <p>Total Interest = Future Value − Present Value</p>
        <p>r = Interest Rate / 100 (per period)</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Future value = PKR 12,100</p>
        <p>Number of periods = 2</p>
        <p>Interest rate = 10% per period</p>
        <p>Present value = 12,100 ÷ (1.10)^2 = PKR 10,000</p>
        <p>Total interest = 12,100 − 10,000 = PKR 2,100</p>
      </div>

      <h2
        id="present-value-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...PRESENT_VALUE_FAQS]} />
      </div>
    </article>
  );
}
