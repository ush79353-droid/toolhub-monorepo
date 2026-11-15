import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { SORTINO_RATIO_FAQS } from './content';

export function SortinoRatioGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-sortino-ratio"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Sortino Ratio?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The Sortino ratio focuses on harmful volatility: how much excess return you earn for each
        unit of downside deviation. Compare assets with the same risk-free rate to see which
        delivers better return per unit of downside risk.
      </p>

      <h2
        id="sortino-ratio-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Sortino Ratio Formula
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Sortino Ratio = (Ra − Rf) ÷ Downside Deviation</p>
        <p>Ra, Rf in %; downside deviation in percentage points; result is unitless</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 space-y-1 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Rf = 4%; Ra = 12%; downside deviation = 10</p>
        <p>Sortino = (12 − 4) ÷ 10 = 0.80</p>
      </div>

      <h2
        id="sortino-ratio-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...SORTINO_RATIO_FAQS]} />
      </div>
    </article>
  );
}
