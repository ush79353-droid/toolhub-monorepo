import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { OPTIMAL_HEDGE_RATIO_FAQS } from './content';

export function OptimalHedgeRatioGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-optimal-hedge-ratio"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is the Optimal Hedge Ratio?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The optimal (minimum-variance) hedge ratio estimates how large a futures position
        should be relative to a spot exposure so that portfolio variance is minimized, given
        the correlation between spot and futures price changes and their standard deviations.
      </p>

      <h2
        id="optimal-hedge-ratio-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Optimal Hedge Ratio Formula
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>h* = ρ × (σs / σf)</p>
        <p className="mt-2">
          ρ = correlation · σs = spot std. dev. · σf = futures std. dev.
        </p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Spot std. dev. σs = 12</p>
        <p>Futures std. dev. σf = 15</p>
        <p>Correlation ρ = 0.8</p>
        <p>h* = 0.8 × (12 / 15) = 0.64</p>
      </div>

      <h2
        id="optimal-hedge-ratio-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...OPTIMAL_HEDGE_RATIO_FAQS]} />
      </div>
    </article>
  );
}
