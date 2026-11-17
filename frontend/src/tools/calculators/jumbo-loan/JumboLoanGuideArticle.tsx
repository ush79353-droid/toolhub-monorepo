import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { JUMBO_LOAN_FAQS } from './content';

export function JumboLoanGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-jumbo-loan"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is a Jumbo Loan?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A jumbo loan finances a home purchase above conforming loan limits. This calculator
        estimates the financed principal after a down payment, then computes the fixed monthly
        principal-and-interest payment and an estimated payoff date from the first payment day.
      </p>

      <h2
        id="jumbo-loan-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Jumbo Loan Formulas
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Down Payment = Property Price × (Down Payment % / 100)</p>
        <p className="mt-2">Jumbo Loan Amount = Property Price − Down Payment</p>
        <p className="mt-2">n = Years × 12 + Months</p>
        <p className="mt-2">r = Annual Interest Rate / 1200</p>
        <p className="mt-2">
          Monthly Payment = P × r / (1 − (1 + r)^(−n)) · if r = 0: Monthly Payment = P / n
        </p>
        <p className="mt-2">Payoff Date ≈ First Day + n months</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Property price = 750,000 · Down payment = 20% · Term = 30 years · APR = 6.5%</p>
        <p>Down payment = 150,000 · Loan amount = 600,000 · n = 360 · r = 0.0054167…</p>
        <p>Monthly payment ≈ 3,792.41</p>
      </div>

      <h2
        id="jumbo-loan-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...JUMBO_LOAN_FAQS]} />
      </div>
    </article>
  );
}
