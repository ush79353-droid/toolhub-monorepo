import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { COGS_FAQS } from './content';

export function CostOfGoodsSoldGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2 id="what-is-cogs" className="text-xl font-bold tracking-tight text-accent sm:text-2xl">
        What Is COGS?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Cost of goods sold measures the inventory cost tied to units sold in a period. Merchants and
        manufacturers use it with revenue to understand gross profit.
      </p>

      <h2 id="cogs-formula" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        COGS Formula
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>COGS = Beginning Inventory + Purchases − Ending Inventory</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Beginning inventory = 50,000</p>
        <p>Purchases = 30,000</p>
        <p>Ending inventory = 20,000</p>
        <p>COGS = 50,000 + 30,000 − 20,000 = 60,000</p>
      </div>

      <h2 id="cogs-faq" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...COGS_FAQS]} />
      </div>
    </article>
  );
}
