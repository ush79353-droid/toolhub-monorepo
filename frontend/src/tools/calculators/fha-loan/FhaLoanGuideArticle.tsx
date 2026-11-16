import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { FHA_LOAN_FAQS } from './content';
import { FHA_UPFRONT_MIP_RATE } from './types';

export function FhaLoanGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-fha-loan"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is an FHA Loan?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        An FHA loan is a mortgage insured by the Federal Housing Administration. This calculator
        estimates down payment, base loan, upfront and monthly MIP, monthly payments, and total
        payment cost under a simplified reference model.
      </p>

      <h2
        id="fha-loan-formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        FHA Loan Formulas
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Down payment = Home price × down %</p>
        <p>Base loan = Home price − down payment</p>
        <p>Upfront MIP = Base loan × {(FHA_UPFRONT_MIP_RATE * 100).toFixed(2)}%</p>
        <p>Monthly mortgage = amortizing payment on base loan</p>
        <p>Monthly MIP = Base loan × annual MIP / 12</p>
        <p>Total cost = (monthly mortgage + monthly MIP) × n</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Home 200,000 · down 10% · 30 years · 3% · annual MIP 0.85%</p>
        <p>Down 20,000 · base 180,000 · upfront MIP 3,150</p>
        <p>Monthly mortgage ≈ 758.89 · monthly MIP 127.50 · total monthly ≈ 886.39</p>
        <p>Total cost ≈ 319,099.41 · periodic rate 0.25% · 360 payments</p>
      </div>

      <h2 id="fha-loan-faq" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...FHA_LOAN_FAQS]} />
      </div>
    </article>
  );
}
