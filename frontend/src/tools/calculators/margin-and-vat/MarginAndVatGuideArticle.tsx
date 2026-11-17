import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { MARGIN_VAT_FAQS } from './content';

export function MarginAndVatGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-margin-vat"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Margin and VAT?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This calculator links purchase cost, selling price, profit, margin, markup, and VAT. Edit any
        field; related values recalculate from the last-edited source. Pin margin or markup when you
        want cost-plus pricing to follow that percentage.
      </p>

      <h2
        id="margin-vat-formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Formulas
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Gross cost = Net cost × (1 + VAT/100)</p>
        <p>Gross selling price = Net selling price × (1 + VAT/100)</p>
        <p>Profit = Net selling price − Net cost</p>
        <p>Margin (%) = Profit / Net selling price × 100</p>
        <p>Markup (%) = Profit / Net cost × 100</p>
        <p>Net selling price = Net cost / (1 − Margin/100)</p>
        <p>Net selling price = Net cost × (1 + Markup/100)</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Net cost 100 · VAT 20% → Gross cost 120</p>
        <p>Margin 20% → Net price 125 · Gross price 150 · Profit 25 · Markup 25%</p>
        <p>Markup 25% with the same cost → same net price 125 and margin 20%</p>
      </div>

      <h2 id="margin-vat-faq" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...MARGIN_VAT_FAQS]} />
      </div>
    </article>
  );
}
