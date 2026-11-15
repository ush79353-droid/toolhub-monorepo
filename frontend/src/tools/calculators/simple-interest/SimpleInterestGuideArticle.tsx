import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { SIMPLE_INTEREST_FAQS } from './content';

export function SimpleInterestGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-simple-interest"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Simple Interest?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Simple interest charges or earns a fixed rate on the original principal for the length of
        the term. Unlike compound interest, prior interest is never added back into the principal.
      </p>

      <h2
        id="simple-interest-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Simple Interest Formula
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>t = Years + Months ÷ 12</p>
        <p>I = P × (r ÷ 100) × t</p>
        <p>A = P + I</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 space-y-1 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Principal = 100,000; Rate = 10%/yr; Term = 2 years, 6 months</p>
        <p>t = 2 + 6 ÷ 12 = 2.5</p>
        <p>Total interest = 100,000 × 0.10 × 2.5 = 25,000</p>
        <p>Final balance = 100,000 + 25,000 = 125,000</p>
      </div>

      <h2
        id="simple-interest-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...SIMPLE_INTEREST_FAQS]} />
      </div>
    </article>
  );
}
