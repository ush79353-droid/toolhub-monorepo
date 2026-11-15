import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { NPV_FAQS } from './content';

export function NpvGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2 id="what-is-npv" className="text-xl font-bold tracking-tight text-accent sm:text-2xl">
        What Is NPV?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Net present value (NPV) measures whether a project’s discounted future cash flows cover its
        initial costs. Positive NPV means the investment is expected to create value at the chosen
        discount rate; negative NPV means it does not.
      </p>

      <h2 id="npv-formula" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        NPV Formula
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>NPV = −Initial Costs + Σ [Cash Flow(t) / (1 + r)^t]</p>
        <p>Expected cash flows = Σ [Cash Flow(t) / (1 + r)^t]</p>
        <p>r = Discount Rate / 100; t starts at 1</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Discount rate = 10%</p>
        <p>Initial costs = PKR 10,000</p>
        <p>Years 1–3 cash flows = PKR 4,000 each; Years 4–5 = 0</p>
        <p>Expected cash flows ≈ PKR 9,947.41</p>
        <p>NPV ≈ PKR −52.59</p>
      </div>

      <h2 id="npv-faq" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...NPV_FAQS]} />
      </div>
    </article>
  );
}
