import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { COST_OF_EQUITY_FAQS } from './content';

export function CostOfEquityGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-cost-of-equity"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Cost of Equity?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Cost of equity is the return shareholders require for holding a company&apos;s stock. For
        firms that pay dividends, the Dividend Growth Model links that required return to the
        expected dividend, the current share price, and expected dividend growth.
      </p>

      <h2
        id="cost-of-equity-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Dividend Growth Formula
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Cost of Equity = (D₁ / P₀) + g</p>
        <p>D₁ = expected dividend per share next year</p>
        <p>P₀ = current share price</p>
        <p>g = dividend growth rate (decimal)</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Expected dividend per share (D₁) = PKR 5</p>
        <p>Current share price (P₀) = PKR 100</p>
        <p>Dividend growth rate (g) = 4%</p>
        <p>Cost of equity = (5 / 100) + 0.04 = 0.09 = 9%</p>
      </div>

      <h2
        id="cost-of-equity-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...COST_OF_EQUITY_FAQS]} />
      </div>
    </article>
  );
}
