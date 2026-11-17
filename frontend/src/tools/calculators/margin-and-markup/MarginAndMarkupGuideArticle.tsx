import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { MARGIN_AND_MARKUP_FAQS } from './content';

export function MarginAndMarkupGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-margin-and-markup"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Are Margin and Markup?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Cost is what you spend to produce or buy an item. Revenue is the selling price. Profit is
        revenue minus cost. Margin expresses that profit as a share of revenue; markup expresses
        it as a share of cost. This calculator keeps those four values in sync and can compare two
        pricing scenarios against the same cost.
      </p>

      <h2
        id="how-to-use-markup-and-margin"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use the Markup and Margin Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter cost (optional currency). Leave blank only if you want margin ↔ markup sync.</li>
        <li>Edit margin, markup, revenue, or profit — the other fields update from that driver.</li>
        <li>
          Optionally check “Compare two markups and margins” for a second shared-cost scenario
          (for example 35% vs 40% margin).
        </li>
      </ol>

      <h2 id="formulas" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Formulas
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Profit = Revenue − Cost</p>
        <p>Margin (%) = Profit / Revenue × 100</p>
        <p>Markup (%) = Profit / Cost × 100</p>
        <p>Revenue = Cost / (1 − Margin/100)</p>
        <p>Revenue = Cost × (1 + Markup/100)</p>
        <p>Markup = 1/(1 − Margin) − 1 (percent form)</p>
      </div>

      <h2
        id="margin-and-markup-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...MARGIN_AND_MARKUP_FAQS]} />
      </div>
    </article>
  );
}
