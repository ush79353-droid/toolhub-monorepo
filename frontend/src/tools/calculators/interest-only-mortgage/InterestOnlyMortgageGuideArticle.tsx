import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { INTEREST_ONLY_MORTGAGE_FAQS } from './content';

export function InterestOnlyMortgageGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-interest-only-mortgage"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is an Interest-Only Mortgage?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        An interest-only mortgage charges payments that cover interest for a set period. The
        principal does not decline during that window. After the interest-only period ends, the
        remaining balance is typically repaid as a lump sum or through higher principal-and-interest
        payments. This calculator estimates the periodic interest payment and, optionally, total
        interest over the interest-only period.
      </p>

      <h2
        id="interest-only-payment-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Interest-Only Payment Formula
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Periodic payment = Loan × (Annual rate / 100) / periods per year</p>
        <p className="mt-2">Daily ÷ 365 · Monthly ÷ 12 · Quarterly ÷ 4 · Yearly ÷ 1</p>
        <p className="mt-2">
          Total IO interest = Loan × (Annual rate / 100) × years (years + months/12)
        </p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Loan amount = 350,000</p>
        <p>Annual interest rate = 4%</p>
        <p>Payment frequency = Monthly</p>
        <p>Monthly payment = 350,000 × 0.04 / 12 = 1,166.67</p>
        <p>Interest-only period = 10 years → total interest = 350,000 × 0.04 × 10 = 140,000</p>
        <p>Remaining principal after the IO period = 350,000</p>
      </div>

      <h2
        id="interest-only-mortgage-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...INTEREST_ONLY_MORTGAGE_FAQS]} />
      </div>
    </article>
  );
}
