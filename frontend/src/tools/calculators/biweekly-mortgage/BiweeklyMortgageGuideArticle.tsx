import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { BIWEEKLY_MORTGAGE_FAQS } from './content';

export function BiweeklyMortgageGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-biweekly-mortgage"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is a Biweekly Mortgage?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A biweekly mortgage comparison shows how paying half of your normal monthly payment
        every two weeks can shorten the loan and cut interest versus a standard monthly
        schedule. This calculator builds both repayment schedules from the same principal,
        rate, compounding convention, points, fees, and optional extra principal.
      </p>

      <h2
        id="biweekly-mortgage-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How the Comparison Works
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Monthly rate (UK &amp; US): r = APR / 12 / 100</p>
        <p>Monthly payment M from standard amortization over n months</p>
        <p>Accelerated biweekly payment = M / 2 every 14 days (~26 / year)</p>
        <p>Biweekly rate from monthly compounding: (1 + r)^(12/26) − 1</p>
        <p>Closing costs = loan × points% + upfront fee (added once to totals)</p>
        <p>Payment difference ≈ biweekly × 26 / 12 − monthly</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Loan = PKR 150,000 · Term = 30 years · Rate = 6% · Monthly (UK &amp; US)</p>
        <p>Monthly payment ≈ PKR 899.33 · Total interest ≈ PKR 173,757.28</p>
        <p>Biweekly payment ≈ PKR 449.66 · Payoff ≈ 24 yrs 5 mos</p>
        <p>Biweekly interest ≈ PKR 136,048.89 · Interest saved ≈ PKR 37,708.40</p>
      </div>

      <h2
        id="biweekly-mortgage-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...BIWEEKLY_MORTGAGE_FAQS]} />
      </div>
    </article>
  );
}
