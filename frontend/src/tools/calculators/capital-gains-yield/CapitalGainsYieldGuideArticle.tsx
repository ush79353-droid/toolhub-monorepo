import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { CAPITAL_GAINS_YIELD_FAQS } from './content';

export function CapitalGainsYieldGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-capital-gains-yield"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Capital Gains Yield?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Capital gains yield measures how much an asset’s price has risen or fallen relative to what
        you paid. It ignores dividends and other income, focusing only on the price change.
      </p>

      <h2
        id="capital-gains-yield-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Capital Gains Yield Formula
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Capital Gains = Current Price − Bought Price</p>
        <p className="mt-2">Capital Gains Yield (%) = (Capital Gains / Bought Price) × 100</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Bought price = PKR 10,000</p>
        <p>Current price = PKR 12,500</p>
        <p>Capital gains = 12,500 − 10,000 = PKR 2,500</p>
        <p>Capital gains yield = (2,500 / 10,000) × 100 = 25%</p>
      </div>

      <h2
        id="capital-gains-yield-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...CAPITAL_GAINS_YIELD_FAQS]} />
      </div>
    </article>
  );
}
