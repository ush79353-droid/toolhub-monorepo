import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { ROCE_FAQS } from './content';

export function RoceGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2 id="what-is-roce" className="text-xl font-bold tracking-tight text-accent sm:text-2xl">
        What Is ROCE?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Return on capital employed (ROCE) measures how efficiently a company generates operating
        profit from the capital tied up in the business. Higher ROCE generally means capital is
        being used more productively.
      </p>

      <h2
        id="roce-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        ROCE Formula
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Capital Employed (assets) = Total Assets − Current Liabilities</p>
        <p className="mt-2">
          Capital Employed (equity) = Total Equity + Non-current Liabilities
        </p>
        <p className="mt-2">ROCE (%) = (EBIT / Capital Employed) × 100</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>EBIT = PKR 200,000</p>
        <p>Total assets = PKR 1,500,000</p>
        <p>Current liabilities = PKR 500,000</p>
        <p>Capital employed = 1,500,000 − 500,000 = PKR 1,000,000</p>
        <p>ROCE = (200,000 / 1,000,000) × 100 = 20%</p>
      </div>

      <h2 id="roce-faq" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...ROCE_FAQS]} />
      </div>
    </article>
  );
}
