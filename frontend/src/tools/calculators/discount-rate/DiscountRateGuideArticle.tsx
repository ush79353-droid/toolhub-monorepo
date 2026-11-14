import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { DISCOUNT_RATE_FAQS } from './content';

export function DiscountRateGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-discount-rate"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Discount Rate?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A discount rate is the annual rate that makes the present value of future amounts equal a
        given PV. Use it to back out the implied yield from a known price, future value, and any
        recurring cash flows.
      </p>

      <h2
        id="discount-rate-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Discount Rate Formula
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>PV = FV ÷ (1 + r/m)^(m×t) + Σ[CF ÷ (1 + r/m)^(m×timeᵢ)]</p>
        <p>With CF = 0: r = m × [(FV ÷ PV)^(1 ÷ (m×t)) − 1]</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 space-y-1 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>PV = 1,000; FV = 1,500; term = 5 years; compounding yearly; CF = 0</p>
        <p>r = 1 × [(1,500 ÷ 1,000)^(1/5) − 1] ≈ 8.447%</p>
      </div>

      <h2
        id="discount-rate-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...DISCOUNT_RATE_FAQS]} />
      </div>
    </article>
  );
}
