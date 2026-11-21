import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { CURRENCY_FAQS } from './content';

export function CurrencyGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-currency-calculator"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What This Calculator Does
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Convert an amount from one currency to another using Omega’s live stored
        exchange-rate snapshot. Choose From and To, optionally limit the lists to
        popular currencies, then press Calculate for a timestamped result with both
        quote directions.
      </p>

      <h2
        id="currency-formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Formulas
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>converted = amount × rates[to] / rates[from]</p>
        <p>rate(from→to) = rates[to] / rates[from]</p>
        <p>rate(to→from) = 1 / rate(from→to)</p>
        <p>Same currency: converted = amount (no rate required)</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Amount 100 · From USD · To EUR · rates EUR=0.85 (USD base)</p>
        <p>converted = 100 × 0.85 / 1 = 85 EUR</p>
        <p>1 USD = 0.85 EUR · 1 EUR ≈ 1.176471 USD</p>
      </div>

      <h2
        id="currency-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...CURRENCY_FAQS]} />
      </div>
    </article>
  );
}
