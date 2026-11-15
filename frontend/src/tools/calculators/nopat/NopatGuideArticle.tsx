import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { NOPAT_FAQS } from './content';

export function NopatGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2 id="what-is-nopat" className="text-xl font-bold tracking-tight text-accent sm:text-2xl">
        What Is NOPAT?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Net operating profit after tax (NOPAT) measures operating profitability after tax without
        financing effects. It is commonly used with economic value added (EVA) and free cash flow
        analysis.
      </p>

      <h2 id="nopat-formulas" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Formulas
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Simple: NOPAT = Operating Profit × (1 − Tax Rate / 100)</p>
        <p>
          Precise: NOPAT = (Net Income + Non-operating Income Loss − Non-operating Income Gain +
          Interest Expense + Tax) × (1 − Tax Rate / 100)
        </p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Operating profit = PKR 500,000</p>
        <p>Tax rate = 30%</p>
        <p>NOPAT = 500,000 × (1 − 0.30) = PKR 350,000</p>
      </div>

      <h2 id="nopat-faq" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...NOPAT_FAQS]} />
      </div>
    </article>
  );
}
