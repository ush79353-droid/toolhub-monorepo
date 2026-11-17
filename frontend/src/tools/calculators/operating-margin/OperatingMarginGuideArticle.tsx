import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { OPERATING_MARGIN_FAQS } from './content';

export function OperatingMarginGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-operating-margin"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Operating Margin?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Operating margin compares operating income with revenue for the same period after
        cost of goods sold and operating expenses. Analysts use it as a quick check of
        core operating profitability before interest and taxes. It is a simple
        percentage, not a complete financial model.
      </p>

      <h2
        id="operating-margin-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Operating Margin Formula
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Operating Income = Revenue − COGS − Operating Expenses</p>
        <p>Operating Margin (%) = (Operating Income ÷ Revenue) × 100</p>
        <p>Revenue ≠ 0</p>
        <p>
          When currencies differ, convert COGS and operating expenses into the revenue
          currency, then subtract and divide.
        </p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Revenue = 1,000,000 · COGS = 400,000 · Operating expenses = 250,000</p>
        <p>Operating income = 1,000,000 − 400,000 − 250,000 = 350,000</p>
        <p>Operating margin = (350,000 ÷ 1,000,000) × 100 = 35.00%</p>
        <p>
          If expenses push income to −20,000 with revenue 100,000, the margin is −20.00%.
          Zero revenue is blocked.
        </p>
      </div>

      <h2
        id="operating-margin-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...OPERATING_MARGIN_FAQS]} />
      </div>
    </article>
  );
}
