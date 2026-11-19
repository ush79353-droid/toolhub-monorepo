import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { CAR_LEASE_FAQS } from './content';

export function CarLeaseGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-car-lease"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is a Car Lease Payment?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A car lease payment covers depreciation of the vehicle over the lease term plus a
        finance charge based on a money factor. This calculator uses the standard retail
        money-factor model with residual value from MSRP, fees financed into capitalized cost,
        and sales tax applied monthly to the base payment.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use This Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter MSRP and negotiated selling price with their currencies.</li>
        <li>Set lease term (months), sales tax %, residual factor %, and money factor.</li>
        <li>
          Optionally enter dealer fee, registration fee, down payment, trade-in, and other
          reductions.
        </li>
        <li>
          Read net capitalized cost, residual value, monthly depreciation, lease fee, base
          payment, sales tax, and total monthly payment. Change result currencies to re-express
          amounts without changing lease inputs.
        </li>
      </ol>

      <h2
        id="car-lease-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Money-Factor Lease Formulas
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Residual Value = MSRP × Residual Factor / 100</p>
        <p>
          Net Cap Cost = Negotiated Price + Dealer Fee + Registration Fee − Down Payment −
          Trade-in − Other Reductions
        </p>
        <p>Monthly Depreciation = (Net Cap Cost − Residual Value) / Lease Months</p>
        <p>Monthly Lease Fee = (Net Cap Cost + Residual Value) × Money Factor</p>
        <p>Monthly Base Payment = Monthly Depreciation + Monthly Lease Fee</p>
        <p>Monthly Sales Tax = Monthly Base Payment × Sales Tax / 100</p>
        <p>Monthly Lease Payment = Monthly Base Payment + Monthly Sales Tax</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Calculations keep full precision and round only for display. Invalid, negative, or
        non-finite payments produce no result instead of silently clamping.
      </p>

      <h2
        id="fees-and-tax"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Fees Financed &amp; Monthly Tax
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Dealer and registration fees are assumed financed into the capitalized cost. Down
        payment, trade-in, and other reductions are subtracted once when building net cap cost —
        they are not deducted again from the monthly payment. Sales tax is applied monthly to the
        base payment only; no extra lease penalties are invented.
      </p>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>MSRP = 50,000 · Negotiated = 48,000 · Term = 36 months</p>
        <p>Sales tax = 5% · Residual factor = 58% · Money factor = 0.001</p>
        <p>Fees and reductions = 0</p>
        <p>Residual = 50,000 × 58 / 100 = 29,000</p>
        <p>Net cap = 48,000</p>
        <p>Depreciation / mo = (48,000 − 29,000) / 36 ≈ 527.7778</p>
        <p>Lease fee / mo = (48,000 + 29,000) × 0.001 = 77</p>
        <p>Base = 527.7778 + 77 ≈ 604.7778</p>
        <p>Tax / mo ≈ 30.2389 · Payment ≈ 635.0167</p>
      </div>

      <h2
        id="car-lease-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion faqs={[...CAR_LEASE_FAQS]} />
      </div>
    </article>
  );
}
