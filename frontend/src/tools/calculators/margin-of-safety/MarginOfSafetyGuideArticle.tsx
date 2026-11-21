import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { MARGIN_OF_SAFETY_FAQS } from './content';

export function MarginOfSafetyGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-margin-of-safety"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Margin of Safety?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Margin of safety shows how much sales can fall before the business reaches
        breakeven. Enter current (estimated) sales and breakeven sales to get the
 cushion in money, as a ratio, as a percentage, and when a selling price per
 unit is available; in units.
      </p>

      <h2
        id="margin-of-safety-formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Margin of Safety Formulas
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Margin of Safety = Current Sales − Breakeven Sales</p>
        <p className="mt-2">Margin of Safety Ratio = Margin of Safety ÷ Current Sales</p>
        <p className="mt-2">Margin of Safety (%) = Ratio × 100</p>
        <p className="mt-2">
          Margin of Safety (Units) = Margin of Safety ÷ Selling Price per Unit
        </p>
        <p className="mt-2">
          Optional: Current Sales = Sales Volume × Selling Price per Unit
        </p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Current sales = 500,000 · Breakeven sales = 350,000 · Selling price = 50</p>
        <p>Margin of safety = 150,000</p>
        <p>Ratio = 0.30 · Percentage = 30.00% · Units = 3,000</p>
      </div>

      <h2
        id="margin-of-safety-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...MARGIN_OF_SAFETY_FAQS]} />
      </div>
    </article>
  );
}
