import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { CONTINUOUS_COMPOUND_INTEREST_FAQS } from './content';

export function ContinuousCompoundInterestGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-continuous-compound"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Continuous Compounding?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Continuous compounding assumes interest is earned every instant. The balance grows as an
        exponential of the rate and time, which is the theoretical limit of compounding more and more
        frequently.
      </p>

      <h2
        id="continuous-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Formula
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Final Balance = P × e^(r × t)</p>
        <p className="mt-2">Compound Interest = Final Balance − Total Deposits</p>
        <p className="mt-2">t = Years + Months / 12</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Initial balance = PKR 1,000</p>
        <p>Interest rate = 4%</p>
        <p>Term = 20 years</p>
        <p>Additional deposits = Never</p>
        <p className="mt-2">Final balance = 1,000 × e^(0.04 × 20) = PKR 2,225.54</p>
        <p>Compound interest = 2,225.54 − 1,000 = PKR 1,225.54</p>
      </div>

      <h2
        id="continuous-compound-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...CONTINUOUS_COMPOUND_INTEREST_FAQS]} />
      </div>
    </article>
  );
}
