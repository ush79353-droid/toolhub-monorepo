import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { HOME_IMPROVEMENT_LOAN_FAQS } from './content';

export function HomeImprovementLoanGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-home-improvement-loan"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is a Home Improvement Loan?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A home improvement loan finances renovations or repairs with a fixed principal, term, and
        interest rate. Up-front application and home loan fees reduce the net cash you receive and
        raise the true yearly cost of borrowing. This calculator estimates the monthly payment,
        fee-adjusted APR, interest, fees, total payments, and an annual balances chart.
      </p>

      <h2
        id="home-improvement-loan-formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Payment and APR Formulas
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Application Fee = Loan Amount × Fee% / 100</p>
        <p className="mt-2">n = Years × 12 + Months · r = Annual Interest Rate / 1200</p>
        <p className="mt-2">
          Monthly Payment = P × r / (1 − (1+r)^(−n)) · zero rate → P / n
        </p>
        <p className="mt-2">
          Loan fees = Application fee + Home loan fees (each counted once)
        </p>
        <p className="mt-2">
          Net proceeds = P − Loan fees · APR: solve Net = Payment × (1−(1+i)^(−n)) / i · APR% = 12
          × i × 100
        </p>
        <p className="mt-2">
          Total interest from amortization · Total payments = Payment × n + Loan fees
        </p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Loan = 50,000 · Term = 5 years 0 months · Rate = 7.5% · Application fee = 0.4% (200)</p>
        <p>n = 60 · r = 0.00625 · Monthly payment ≈ 1,001.90</p>
        <p>Net proceeds = 49,800 → APR ≈ 7.669%</p>
        <p>Total interest ≈ 10,113.85 · Loan fees = 200 · Total payments ≈ 60,313.85</p>
      </div>

      <h2
        id="home-improvement-loan-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...HOME_IMPROVEMENT_LOAN_FAQS]} />
      </div>
    </article>
  );
}
