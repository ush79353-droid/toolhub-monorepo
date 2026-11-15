import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { TREYNOR_RATIO_FAQS } from './content';

export function TreynorRatioGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-treynor-ratio"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Treynor Ratio?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The Treynor ratio measures excess return per unit of systematic market risk (beta). It
        shows how much return above the risk-free rate a portfolio earned for each unit of
        market risk taken. The numerical value depends on whether returns are represented in
        percentage points or decimals; this calculator uses percentage points consistently and
        displays the ratio with a % unit.
      </p>

      <h2
        id="treynor-ratio-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Treynor Ratio Formula
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Portfolio Return (%) = ((Ending − Beginning) ÷ Beginning) × 100</p>
        <p>Treynor Ratio = (Portfolio Return − Risk-Free Rate) ÷ Portfolio Beta</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 space-y-1 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Beginning = PKR 10,000; Ending = PKR 11,500 → Portfolio return = 15%</p>
        <p>Risk-free rate = 4%; Portfolio beta = 1.2</p>
        <p>Treynor ratio = (15 − 4) ÷ 1.2 = 9.1667%</p>
      </div>

      <h2
        id="treynor-ratio-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...TREYNOR_RATIO_FAQS]} />
      </div>
    </article>
  );
}
