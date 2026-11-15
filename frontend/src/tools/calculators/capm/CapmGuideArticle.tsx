import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { CAPM_FAQS } from './content';

export function CapmGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2 id="what-is-capm" className="text-xl font-bold tracking-tight text-accent sm:text-2xl">
        What Is CAPM?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The Capital Asset Pricing Model (CAPM) links an asset&apos;s expected return to its
        systematic risk (beta) relative to the market. It starts from the risk-free rate and adds
        a risk premium proportional to beta.
      </p>

      <h2
        id="capm-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        CAPM Formula
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Market Risk Premium (%) = Rm − Rf</p>
        <p className="mt-2">Asset Risk Premium (%) = Beta × (Rm − Rf)</p>
        <p className="mt-2">Expected Return R (%) = Rf + Beta × (Rm − Rf)</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Risk-free rate (Rf) = 4%</p>
        <p>Broad market return (Rm) = 12%</p>
        <p>Beta = 1.2</p>
        <p>Asset risk premium = 1.2 × (12 − 4) = 9.6%</p>
        <p>Expected return (R) = 4 + 9.6 = 13.6%</p>
      </div>

      <h2 id="capm-faq" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...CAPM_FAQS]} />
      </div>
    </article>
  );
}
