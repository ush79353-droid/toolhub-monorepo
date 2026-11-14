import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { SELL_THROUGH_RATE_FAQS } from './content';

export function SellThroughRateGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-sell-through-rate"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Sell-Through Rate?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Sell-through rate shows what share of inventory received was sold in a period. Retailers and
        merchandisers use it to judge demand versus stock brought in.
      </p>

      <h2
        id="sell-through-rate-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Sell-Through Rate Formula
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Sell-through Rate (%) = (Units Sold / Units Received) × 100</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Number of units sold = 150</p>
        <p>Number of units received = 200</p>
        <p>Sell-through rate = (150 / 200) × 100 = 75%</p>
      </div>

      <h2
        id="sell-through-rate-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...SELL_THROUGH_RATE_FAQS]} />
      </div>
    </article>
  );
}
