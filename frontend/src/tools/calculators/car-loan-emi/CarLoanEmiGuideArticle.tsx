import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { CAR_LOAN_EMI_FAQS } from './content';

export function CarLoanEmiGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-car-loan-emi"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is a Car Loan EMI?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A car loan EMI (equated monthly installment) is the fixed monthly principal-and-interest
        payment on an auto loan. This calculator first estimates how much you need to finance after
        cash on hand, trade-in credit, and sales tax, then computes the monthly payment and total
        interest over the chosen term.
      </p>

      <h2
        id="car-loan-emi-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Car Loan EMI Formulas
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Sales Tax Amount = Car Price × Sales Tax % / 100</p>
        <p className="mt-2">
          Loan Amount = Car Price + Sales Tax Amount − Money You Have − Trade-in Value
        </p>
        <p className="mt-2">n = Years × 12 + Months</p>
        <p className="mt-2">r = Annual Interest Rate / 1200</p>
        <p className="mt-2">
          Monthly Payment = P × r / (1 − (1 + r)^(−n)) · if r = 0: Monthly Payment = P / n
        </p>
        <p className="mt-2">Total Interest = Monthly Payment × n − P</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>
          Car price = 2,000,000 · Money you have = 400,000 · Trade-in = 100,000 · Sales tax = 0% ·
          Term = 5 years · APR = 12%
        </p>
        <p>Loan amount = 1,500,000 · n = 60 · r = 0.01</p>
        <p>Monthly payment ≈ 33,366.67 · Total interest ≈ 502,000.29</p>
      </div>

      <h2
        id="car-loan-emi-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...CAR_LOAN_EMI_FAQS]} />
      </div>
    </article>
  );
}
