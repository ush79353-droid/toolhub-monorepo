import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { PERPETUITY_FAQS } from './content';

export function PerpetuityGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-perpetuity"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is a Perpetuity?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A perpetuity is a stream of cash flows that continues indefinitely. This calculator
        values a next-period dividend that either stays constant or grows at a constant rate,
        discounted at a required return for the same period.
      </p>

      <h2
        id="perpetuity-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Formula
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Present Value = Dividend / (Discount Rate − Growth Rate)</p>
        <p>Rates are entered as percents and converted to decimals (for example 10% → 0.10).</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 space-y-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <div>
          <p className="font-semibold">No growth</p>
          <p>Dividend = PKR 1,000 · Discount = 10% · Growth = 0%</p>
          <p>Present value = 1,000 / 0.10 = PKR 10,000</p>
        </div>
        <div>
          <p className="font-semibold">Growing perpetuity</p>
          <p>Dividend = PKR 1,000 · Discount = 10% · Growth = 4%</p>
          <p>Present value = 1,000 / (0.10 − 0.04) ≈ PKR 16,666.67</p>
        </div>
      </div>

      <h2
        id="perpetuity-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...PERPETUITY_FAQS]} />
      </div>
    </article>
  );
}
