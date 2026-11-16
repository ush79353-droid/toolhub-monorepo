import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { PAYDAY_LOAN_FAQS } from './content';

export function PaydayLoanGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-payday-loan-apr"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Payday Loan APR?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Payday loans often quote a short-term finance charge. Simple annualized APR scales that
        charge to a 365-day year so you can compare the cost with other credit products. This
        calculator does not model compounding, rollovers, or jurisdiction caps.
      </p>

      <h2
        id="payday-loan-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Formulas
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>APR (%) = (F / P) × (365 / d) × 100</p>
        <p>F from APR = P × (APR / 100) × (d / 365)</p>
        <p>APR amount = F × (365 / d)</p>
        <p>Monthly fee = P × (q / 100)</p>
        <p>Total debt = P + F + monthly fee</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Loan amount (P) = PKR 1,000</p>
        <p>Finance charge (F) = PKR 150</p>
        <p>Loan term (d) = 14 days</p>
        <p>Monthly fee percent (q) = 0%</p>
        <p>APR = (150 / 1,000) × (365 / 14) × 100 ≈ 391.0714%</p>
        <p>APR amount = 150 × (365 / 14) ≈ 3,910.71</p>
        <p>Total debt = 1,000 + 150 + 0 = 1,150</p>
      </div>

      <h2
        id="payday-loan-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...PAYDAY_LOAN_FAQS]} />
      </div>
    </article>
  );
}
