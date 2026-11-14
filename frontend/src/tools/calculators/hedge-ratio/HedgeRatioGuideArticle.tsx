import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { HEDGE_RATIO_FAQS } from './content';

export function HedgeRatioGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-hedge-ratio"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Hedge Ratio?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Hedge ratio shows what share of a total exposure is offset by a hedge. Traders and risk
        managers use it to check underhedging, full coverage, or overhedging.
      </p>

      <h2
        id="hedge-ratio-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Hedge Ratio Formula
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Hedge Ratio (%) = (Value of Hedge Position ÷ Value of Total Exposure) × 100</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 space-y-1 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Total exposure = 500,000; Hedge position = 400,000</p>
        <p>Hedge ratio = (400,000 ÷ 500,000) × 100 = 80%</p>
      </div>

      <h2
        id="hedge-ratio-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...HEDGE_RATIO_FAQS]} />
      </div>
    </article>
  );
}
