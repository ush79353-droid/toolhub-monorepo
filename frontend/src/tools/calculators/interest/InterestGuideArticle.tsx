import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { INTEREST_FAQS } from './content';

export function InterestGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-interest-calculator"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is an Interest Calculator?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        An interest calculator projects how an initial investment grows with compound interest,
        optional annual and monthly contributions, contribution timing, tax drag on the nominal
        rate, and an inflation adjustment for ending buying power. Interest on the initial
        balance and on contributions are tracked separately so principal is not double-counted.
      </p>

      <h2
        id="interest-formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Formulas
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>afterTax = nominal × (1 − tax/100)</p>
        <p>monthlyRate = (1 + afterTax/m)^(m/12) − 1</p>
        <p>Each month: apply beginning deposits → grow balances → apply end deposits</p>
        <p>totalPrincipal = initial + totalContributions</p>
        <p>totalInterest = endingBalance − totalPrincipal</p>
        <p>inflationAdjusted = endingBalance / (1 + inflation)^t</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>
          $20,000 initial · $5,000 annual contribution (beginning) · $0 monthly · 5% annually ·
          5 years · tax 0% · inflation 3%
        </p>
        <p>
          Ending balance ≈ $54,535.20 · principal $45,000 · contributions $25,000 · interest ≈
          $9,535.20 · inflation-adjusted ≈ $47,042.54
        </p>
      </div>

      <h2 id="interest-faq" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...INTEREST_FAQS]} />
      </div>
    </article>
  );
}
