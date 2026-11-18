import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { DDM_FAQS } from './content';

export function DividendDiscountModelGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2 id="what-is-ddm" className="text-xl font-bold tracking-tight text-accent sm:text-2xl">
        What Is the Dividend Discount Model?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The Dividend Discount Model prices a stock as the present value of expected future
        dividends. This calculator uses the constant-growth Gordon Growth Model with growth from
        ROE and payout, CAPM cost of equity, and next-year dividend from the current dividend.
      </p>

      <h2
        id="ddm-formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        DDM Formulas
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>g = ROE × (1 − payout)</p>
        <p>D₁ = D₀ × (1 + g)</p>
        <p>Ke = Rf + β × MRP</p>
        <p>P₀ = D₁ / (Ke − g)</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Payout 40%, ROE 15% → g = 9%</p>
        <p>D₀ = 5 → D₁ = 5.45</p>
        <p>Rf 4%, MRP 6%, β 1.2 → Ke = 11.2%</p>
        <p>P₀ = 5.45 / (0.112 − 0.09) ≈ 247.73</p>
      </div>

      <h2 id="ddm-faq" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...DDM_FAQS]} />
      </div>
    </article>
  );
}
