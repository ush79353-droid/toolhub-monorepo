import * as React from 'react';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { SAFETY_STOCK_FAQS } from './content';

export function SafetyStockGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-safety-stock"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Safety Stock?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Safety stock is the extra inventory kept to absorb higher-than-average demand or longer-than-
        average lead times. Pairing it with a reorder point helps avoid stockouts without carrying
        unnecessary inventory every day.
      </p>

      <h2
        id="safety-stock-formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Formulas
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>
          Safety Stock = max(0, (Max Daily Usage × Max Lead Time) − (Average Daily Usage × Average
          Lead Time))
        </p>
        <p>Reorder Point = (Average Daily Usage × Average Lead Time) + Safety Stock</p>
      </div>

      <h2 id="how-to-use" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Use
      </h2>
      <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter max and average daily usage in units (non-negative).</li>
        <li>Enter max and average lead time in days (greater than zero).</li>
        <li>Safety stock and reorder point update automatically and round up to whole units.</li>
      </ol>

      <h2
        id="safety-stock-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Worked Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Max daily usage 100, max lead 10 days, average usage 70, average lead 7 days</p>
        <p>Safety stock = max(0, 1,000 − 490) = 510 units</p>
        <p>Reorder point = 490 + 510 = 1,000 units</p>
      </div>

      <h2
        id="safety-stock-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={SAFETY_STOCK_FAQS} />
      </div>
    </article>
  );
}
