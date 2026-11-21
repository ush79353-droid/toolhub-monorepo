import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { MORTGAGE_REFINANCE_FAQS } from './content';

export function MortgageRefinanceGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-mortgage-refinance"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Mortgage Refinancing?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Refinancing a mortgage replaces the remaining balance with a new loan, usually at
        a different rate or term. This calculator estimates how much of the original loan
 is still owed, then compares that remaining loan with the refinance; including
        points, closing costs, and cash taken out or paid in.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use This Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter the original mortgage amount, due date, term, rate, and compounding.</li>
        <li>Set the new loan’s first due date, term, rate, and compounding.</li>
        <li>Add mortgage points, refinancing costs, and cash in or cash out.</li>
        <li>
          Read the payment summary. Current figures are the remaining term. Break-even uses
          the monthly payment difference and the upfront cost.
        </li>
      </ol>

      <h2
        id="mortgage-refinance-formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Refinance Formulas
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Monthly rate (monthly compounding) = Annual rate / 12</p>
        <p>Monthly rate (n compounds/year) = (1 + Annual rate / n)^(n/12) − 1</p>
        <p>Monthly rate (continuous) = e^(Annual rate / 12) − 1</p>
        <p>Payment = Principal × Monthly rate / [1 − (1 + Monthly rate)^(−Months)]</p>
        <p>When rate = 0%: Payment = Principal / Months</p>
        <p>New principal = Remaining balance + Cash in/out (positive = cash out)</p>
        <p>Refinancing cost = New principal × Points% + Closing costs</p>
        <p>New total payments = New payment × New months + Refinancing cost</p>
        <p>Break-even months = Refinancing cost / Monthly payment savings</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The remaining balance is the original schedule after the whole months between the
        two due dates. Points and closing costs stay upfront. Cash out is extra principal;
        cash in reduces principal. Full precision is kept until display rounding.
      </p>

      <h2
        id="points-cash-notes"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Points, Costs, and Cash In/Out
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        One mortgage point is 1% of the new principal after cash in/out. That fee and the
        other refinancing costs are paid at closing, so they do not earn interest inside
        the new amortization. They are added to new total payments and to the break-even
        test. If the new payment is higher, monthly cash flow never recovers the upfront
        cost. Each loan’s total interest still uses its own term, so stretching the term
        can cut the payment while increasing interest.
      </p>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Original 300,000 · due 2021-09-02 · 30 years · 3.5% monthly.</p>
        <p>New due 2026-11-16 · 25 years · 2.5% monthly · 1 point · costs 1,500 · cash out 2,500.</p>
        <p>
          Remaining principal ≈ 267,965.01. New principal ≈ 270,465.01. Payments ≈ 1,347.13
          vs 1,213.35. Refinancing cost ≈ 4,204.65. Break-even is 32 months (2029-07-16).
        </p>
      </div>

      <h2
        id="mortgage-refinance-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-3">
        <FAQAccordion items={MORTGAGE_REFINANCE_FAQS} />
      </div>
    </article>
  );
}
