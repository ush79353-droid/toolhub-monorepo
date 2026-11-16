import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { LAND_LOAN_FAQS } from './content';

export function LandLoanGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-land-loan"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is a Land Loan?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A land loan finances vacant or raw land. This calculator estimates the financed
        principal after a down payment, then computes scheduled payments, total interest, and
        the periodic rate for a fixed nominal APR and chosen payment frequency.
      </p>

      <h2
        id="land-loan-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Land Loan Formulas
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Down Payment = Land Value × (Down Payment % / 100)</p>
        <p className="mt-2">Loan Value = Land Value − Down Payment</p>
        <p className="mt-2">N = (12 × Years + Months) × f / 12 (monthly: 12 × Years + Months)</p>
        <p className="mt-2">r = APR / (100 × f)</p>
        <p className="mt-2">Payment = P × r / (1 − (1 + r)^(−N)) · if r = 0: Payment = P / N</p>
        <p className="mt-2">Total Payment = Payment × N</p>
        <p className="mt-2">Total Interest = Total Payment − Loan Value</p>
        <p className="mt-2">Periodic Interest Rate (%) = APR / f</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Land value = 100,000 · Down payment = 10% · Term = 5 years · APR = 6% · Monthly</p>
        <p>Down payment = 10,000 · Loan value = 90,000 · N = 60 · Periodic rate = 0.5%</p>
        <p>Periodic payment ≈ 1,739.59 · Total payment ≈ 104,375.40 · Interest ≈ 14,375.40</p>
      </div>

      <h2
        id="land-loan-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...LAND_LOAN_FAQS]} />
      </div>
    </article>
  );
}
