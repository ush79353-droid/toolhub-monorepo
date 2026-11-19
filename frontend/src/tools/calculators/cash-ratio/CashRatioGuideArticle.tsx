import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { CASH_RATIO_FAQS } from './content';

export function CashRatioGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-cash-ratio"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Cash Ratio?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The cash ratio is a strict liquidity measure: how many times current liabilities could be
        covered using only cash and cash equivalents. It is more conservative than the quick or
        current ratio because inventory and receivables are excluded.
      </p>

      <h2
        id="cash-ratio-formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Formulas
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Cash Ratio = Cash and Cash Equivalents / Current Liabilities</p>
        <p>Result shown as a multiple (x), not a percentage</p>
        <p>Cash normalizes into the liabilities currency before dividing; the ratio is never FX-converted</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Cash and cash equivalents = 75,000 · Current liabilities = 100,000</p>
        <p>Cash ratio = 75,000 / 100,000 = 0.75x</p>
      </div>

      <h2
        id="cash-ratio-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...CASH_RATIO_FAQS]} />
      </div>
    </article>
  );
}
