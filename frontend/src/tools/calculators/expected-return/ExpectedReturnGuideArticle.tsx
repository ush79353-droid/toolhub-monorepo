import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { EXPECTED_RETURN_FAQS } from './content';

export function ExpectedReturnGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-expected-return"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Expected Return?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Expected return estimates the average return of an asset across possible scenarios, weighted
        by how likely each scenario is. This calculator compares two stocks under the same scenario
        probabilities.
      </p>

      <h2
        id="expected-return-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Expected Return Formula
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Expected Return A (%) = Σ [(Probability_i ÷ 100) × Stock A Return_i]</p>
        <p>Expected Return B (%) = Σ [(Probability_i ÷ 100) × Stock B Return_i]</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 space-y-1 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Scenario 1: Prob 60%, Stock A 10%, Stock B 6%</p>
        <p>Scenario 2: Prob 40%, Stock A −5%, Stock B 12%</p>
        <p>Expected Return A = 0.6×10 + 0.4×(−5) = 4%</p>
        <p>Expected Return B = 0.6×6 + 0.4×12 = 8.4%</p>
      </div>

      <h2
        id="expected-return-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...EXPECTED_RETURN_FAQS]} />
      </div>
    </article>
  );
}
