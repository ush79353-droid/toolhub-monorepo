import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { EXPECTED_UTILITY_FAQS } from './content';

export function ExpectedUtilityGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-expected-utility"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Expected Utility?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Expected utility weighs each outcome by its probability. This calculator uses a risk-neutral
        linear utility assumption, U(x) = x, so expected utility equals expected monetary value for
        two events.
      </p>

      <h2 id="eu-formula" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Formula
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>U(x) = x (risk-neutral)</p>
        <p className="mt-2">Expected Utility = (P1 / 100 × V1) + (P2 / 100 × V2)</p>
        <p className="mt-2">P1 + P2 = 100</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Event 1: Probability 40%, Value PKR 1,000</p>
        <p>Event 2: Probability 60%, Value PKR 2,000</p>
        <p className="mt-2">Expected utility = 0.40 × 1,000 + 0.60 × 2,000 = PKR 1,600</p>
      </div>

      <h2 id="eu-faq" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...EXPECTED_UTILITY_FAQS]} />
      </div>
    </article>
  );
}
