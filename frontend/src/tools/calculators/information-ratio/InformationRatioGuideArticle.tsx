import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { INFORMATION_RATIO_FAQS } from './content';

export function InformationRatioGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-information-ratio"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Information Ratio?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Information ratio compares a portfolio&apos;s excess return over a benchmark to the
        tracking error of that active return. Higher values generally mean more excess return per
        unit of active risk.
      </p>

      <h2
        id="information-ratio-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Information Ratio Formula
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Portfolio Return (%) = ((Ending − Beginning) ÷ Beginning) × 100</p>
        <p>Information Ratio = (Portfolio Return − Benchmark Return) ÷ Tracking Error</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 space-y-1 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Beginning = 100,000; Ending = 112,000 → Portfolio return = 12%</p>
        <p>Benchmark = 8%; Tracking error = 5%</p>
        <p>Information ratio = (12 − 8) ÷ 5 = 0.80</p>
      </div>

      <h2
        id="information-ratio-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...INFORMATION_RATIO_FAQS]} />
      </div>
    </article>
  );
}
