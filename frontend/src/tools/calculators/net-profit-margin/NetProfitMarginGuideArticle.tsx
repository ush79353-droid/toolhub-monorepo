import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { NET_PROFIT_MARGIN_FAQS } from './content';

export function NetProfitMarginGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-net-profit-margin"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Net Profit Margin?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Net profit margin expresses net profit — earnings after all relevant expenses and taxes —
        as a percentage of total revenues. It is a bottom-line profitability screen, distinct from
        gross margin (revenue minus cost of goods sold only) and operating margin (after operating
        expenses but before interest and taxes in many presentations).
      </p>

      <h2
        id="net-profit-margin-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Net Profit Margin Formula
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Net Profit Margin (%) = (Net Profit / Total Revenues) × 100</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Net profit = PKR 25,000</p>
        <p>Total revenues = PKR 100,000</p>
        <p>Net profit margin = (25,000 / 100,000) × 100 = 25.00%</p>
      </div>

      <h2
        id="net-profit-margin-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...NET_PROFIT_MARGIN_FAQS]} />
      </div>
    </article>
  );
}
