import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { APY_FAQS } from './content';

export function ApyGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2 id="what-is-apy" className="text-xl font-bold tracking-tight text-accent sm:text-2xl">
        What Is APY?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Annual percentage yield (APY) converts a nominal APR into the effective yearly return after
        compounding. Use it to compare deposit products that compound at different frequencies.
      </p>

      <h2 id="apy-formula" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        APY Formula
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>APY = (1 + APR / n)^n − 1</p>
        <p className="mt-2">Final deposit = P × (1 + APR / n)^(n × t)</p>
        <p className="mt-2">n = compounds per year · t = term in years</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Initial deposit = PKR 10,000</p>
        <p>APR = 5% compounded monthly (n = 12)</p>
        <p>APY = (1 + 0.05/12)^12 − 1 ≈ 5.116%</p>
        <p>Term = 12 months → t = 1 year</p>
        <p>Final deposit ≈ PKR 10,511.62</p>
      </div>

      <h2 id="apy-faq" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...APY_FAQS]} />
      </div>
    </article>
  );
}
