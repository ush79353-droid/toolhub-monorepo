import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { JENSENS_ALPHA_FAQS } from './content';

export function JensensAlphaGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-jensens-alpha"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Jensen&apos;s Alpha?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Jensen&apos;s alpha compares a portfolio&apos;s actual return to the return CAPM predicts
        for its beta. A positive alpha means the portfolio beat that risk-adjusted benchmark; a
        negative alpha means it lagged.
      </p>

      <h2
        id="jensens-alpha-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Jensen&apos;s Alpha Formula
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Portfolio Return (%) = ((Ending − Beginning) ÷ Beginning) × 100</p>
        <p>Expected Return (%) = Risk-Free Rate + Beta × (Market Return − Risk-Free Rate)</p>
        <p>Jensen&apos;s Alpha (%) = Portfolio Return − Expected Return</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 space-y-1 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Beginning = 10,000; Ending = 11,500 → Portfolio return = 15%</p>
        <p>Risk-free = 4%; Beta = 1.2; Market = 11%</p>
        <p>Expected return = 4 + 1.2 × (11 − 4) = 12.4%</p>
        <p>Jensen&apos;s alpha = 15 − 12.4 = +2.6%</p>
      </div>

      <h2
        id="jensens-alpha-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...JENSENS_ALPHA_FAQS]} />
      </div>
    </article>
  );
}
