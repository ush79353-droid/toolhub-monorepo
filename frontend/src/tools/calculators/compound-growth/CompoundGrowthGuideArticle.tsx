import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { COMPOUND_GROWTH_FAQS } from './content';

export function CompoundGrowthGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-compound-growth"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Compound Growth?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Compound growth is interest earned on both the original deposit and prior interest. Recurring
        contributions can be added at the start or end of each period and may grow over time.
      </p>

      <h2
        id="compound-growth-formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Formulas
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Without contributions: Final Balance = P × (1 + r/n)^(n×t)</p>
        <p>With contributions: period-by-period balance with deposits at beginning or end of period</p>
        <p>Compounded Growth = Final Balance − Total Deposits</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 space-y-1 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Initial deposit = 1,000; rate = 8%; term = 20 years; compound monthly</p>
        <p>Additional = 50 monthly at beginning of period</p>
        <p>Total additional deposits = 12,000</p>
        <p>Final balance ≈ 34,574.16; compounded growth ≈ 21,574.16</p>
        <p>(Uses nominal period rate r/n — standard compound-interest convention.)</p>
      </div>

      <h2
        id="compound-growth-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...COMPOUND_GROWTH_FAQS]} />
      </div>
    </article>
  );
}
