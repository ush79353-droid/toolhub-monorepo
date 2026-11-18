import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { MARGIN_CALCULATOR_CLASSIC_FAQS } from './content';

export function MarginCalculatorClassicGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-margin-calculator-classic"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Margin Calculator Classic?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Margin Calculator Classic links cost, profit margin, revenue, and profit in both
        directions. Enter any driving value (with cost when needed) and the others update. Pin
        margin to hold the percentage while you change cost or selling price. This tool is
        separate from the general Margin Calculator and from Margin and Markup.
      </p>

      <h2
        id="margin-calculator-classic-formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Formulas
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Profit = Revenue − Cost</p>
        <p className="mt-2">Margin (%) = (Profit / Revenue) × 100</p>
        <p className="mt-2">Revenue = Cost / (1 − Margin/100)</p>
        <p className="mt-2">Revenue = Cost + Profit</p>
        <p className="mt-2">
          Mixed currencies normalize into the cost currency before solving. Margin % is never
          FX-converted.
        </p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Cost = 100 · Margin = 20% (pinned)</p>
        <p>Revenue = 100 / (1 − 0.20) = 125</p>
        <p>Profit = 125 − 100 = 25</p>
      </div>

      <h2
        id="margin-calculator-classic-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...MARGIN_CALCULATOR_CLASSIC_FAQS]} />
      </div>
    </article>
  );
}
