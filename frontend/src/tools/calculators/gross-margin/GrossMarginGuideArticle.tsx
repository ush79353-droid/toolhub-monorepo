import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { GROSS_MARGIN_FAQS } from './content';

export function GrossMarginGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-gross-margin"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Gross Margin?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Gross margin expresses gross profit — revenue minus cost of goods sold — as a percentage of
        revenue. It is a core profitability screen for how efficiently a business turns sales into
        gross profit before operating costs.
      </p>

      <h2
        id="gross-margin-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Gross Margin Formula
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Gross Profit = Revenue − COGS</p>
        <p>Gross Margin (%) = (Gross Profit / Revenue) × 100</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Revenue = PKR 100,000</p>
        <p>COGS = PKR 60,000</p>
        <p>Gross profit = 100,000 − 60,000 = PKR 40,000</p>
        <p>Gross margin = (40,000 / 100,000) × 100 = 40.00%</p>
      </div>

      <h2
        id="gross-margin-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...GROSS_MARGIN_FAQS]} />
      </div>
    </article>
  );
}
