import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { MORTGAGE_UK_FAQS } from './content';

export function MortgageUkGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-uk-mortgage"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is a UK Mortgage Payment?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A UK-style repayment mortgage spreads the loan balance and interest over a fixed term with
        monthly compounding. This calculator also compares the interest-only payment and, when
        enabled, folds in annual taxes and insurance as monthly out-of-pocket costs.
      </p>

      <h2
        id="uk-mortgage-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Formulas
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Loan = Home Price × (1 − Deposit% / 100)</p>
        <p className="mt-2">r = Annual Interest Rate / 1200</p>
        <p className="mt-2">n = Loan Term × 12</p>
        <p className="mt-2">Interest-only = Loan × r</p>
        <p className="mt-2">Monthly Repayment = Loan × r / (1 − (1+r)^(−n))</p>
        <p className="mt-2">When r = 0: Monthly Repayment = Loan / n</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Home price = £500,000 · Deposit = 25% · Term = 25 years · Rate = 5%</p>
        <p>Loan = £375,000 · Interest only = £1,562.50 · Monthly repayment ≈ £2,192.21</p>
        <p>Taxes 1.2% → £500/mo · Home insurance £2,500/yr → ≈ £208.33/mo · Other £6,000/yr → £500/mo</p>
        <p>Total out-of-pocket ≈ £3,400.55/mo · Lifetime ≈ £1,020,163.80</p>
      </div>

      <h2
        id="mortgage-uk-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...MORTGAGE_UK_FAQS]} />
      </div>
    </article>
  );
}
