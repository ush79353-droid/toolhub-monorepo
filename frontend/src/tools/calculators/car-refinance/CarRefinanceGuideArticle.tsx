import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { CAR_REFINANCE_FAQS } from './content';

export function CarRefinanceGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-car-refinance"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Car Loan Refinancing?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
 Refinancing a car loan replaces your remaining auto balance with a new loan; 
        often at a different rate or term. This calculator compares the remaining
        amortization on your current loan with a proposed refinance so you can see
        monthly payment, total interest, and total payments side by side.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use This Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          Choose estimation by remaining loan term (default) or by monthly payment.
        </li>
        <li>Enter the balance left on the loan and the current interest rate.</li>
        <li>
          Set the new loan term and new interest rate. Optionally enter cash in/out
          and enable fees.
        </li>
        <li>
          Read the refinance summary table and the short savings / cost explanation.
        </li>
      </ol>

      <h2
        id="car-refinance-formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Refinance Formulas
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Monthly Rate = Annual Rate / 1200</p>
        <p>
          Monthly Payment = Principal × Monthly Rate / [1 − (1 + Monthly Rate)^(-Months)]
        </p>
        <p>When rate = 0%: Monthly Payment = Principal / Months</p>
        <p>Total Interest = Monthly Payment × Months − Principal</p>
        <p>Total Payments = Monthly Payment × Months (+ upfront fees on the new loan)</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        When estimating by monthly payment, the remaining term is solved from the
        balance, rate, and payment. The payment must exceed the first month’s interest
        or the loan will not amortize.
      </p>

      <h2
        id="cash-fees-notes"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Cash In/Out and Fees
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Positive cash out increases the new principal. Negative cash in reduces it.
        Financed fees are added to the new principal; upfront fees are added only to
        new-loan total payments. Money fields convert into the balance currency with
        stored FX rates; rates and terms never convert.
      </p>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Balance left = 32,000 PKR · remaining term = 6 yrs · current rate = 8.5%</p>
        <p>New term = 5 yrs · new rate = 4.5% · cash in/out = 0</p>
        <p>Current monthly payment ≈ 568.91 PKR · total interest ≈ 8,961.40 PKR</p>
        <p>New monthly payment ≈ 596.58 PKR · total interest ≈ 3,794.60 PKR</p>
        <p>
          Higher monthly payment, but lower total interest and lower total payments over
          the shorter remaining schedule.
        </p>
      </div>

      <h2
        id="car-refinance-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-3">
        <FAQAccordion faqs={[...CAR_REFINANCE_FAQS]} />
      </div>
    </article>
  );
}
