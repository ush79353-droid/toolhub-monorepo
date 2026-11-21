import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { RETURN_ON_SALES_FAQS } from './content';

export function ReturnOnSalesGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-return-on-sales"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Return on Sales?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Return on sales (ROS) expresses operating profit — earnings after operating expenses —
        as a percentage of net sales. It is an operating profitability screen, distinct from
        net profit margin (after interest and taxes) and gross margin (after cost of goods sold
        only).
      </p>

      <h2
        id="return-on-sales-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Return on Sales Formula
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Return on Sales (%) = (Operating Profit / Net Sales) × 100</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Operating profit = PKR 25,000</p>
        <p>Net sales = PKR 100,000</p>
        <p>Return on sales = (25,000 / 100,000) × 100 = 25.00%</p>
      </div>

      <h2
        id="return-on-sales-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...RETURN_ON_SALES_FAQS]} />
      </div>
    </article>
  );
}
