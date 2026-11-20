import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { PMI_FAQS } from './content';

export function PmiGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-pmi"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is PMI?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Private mortgage insurance (PMI) is insurance commonly associated with
        certain conventional residential mortgages when the borrower makes a
        smaller down payment or carries a higher loan-to-value (LTV) ratio. PMI
        primarily protects the lender against specified losses if the borrower
        defaults. It increases monthly housing costs and is distinct from
        homeowners insurance.
      </p>

      <h2
        id="how-much-is-pmi"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Much Is PMI?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Premiums depend on factors such as LTV, credit profile, loan amount,
        insurance coverage, mortgage characteristics, and insurer or lender
        requirements. There is no single universal PMI rate. Use this calculator
        with an assumed annual rate that you choose; label any example rate as
        illustrative, not a current market quote.
      </p>

      <h2
        id="what-is-pmi-rate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is the PMI Rate?
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        Annual PMI Rate (%) ≈ Annual PMI Premium / Applicable Loan Balance × 100
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Insurers may apply rates to original or outstanding balances under
        different schedules. This tool uses a simplified constant rate applied to
        the initial mortgage amount.
      </p>

      <h2
        id="how-to-calculate-pmi"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate PMI
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter the home purchase price.</li>
        <li>Enter the down payment as an amount or percentage.</li>
        <li>Calculate the mortgage amount (price − down payment).</li>
        <li>Calculate LTV = loan / price × 100.</li>
        <li>Enter an assumed annual PMI rate.</li>
        <li>Annual PMI = loan × rate / 100.</li>
        <li>Monthly PMI = annual PMI / 12.</li>
      </ol>

      <h2
        id="pmi-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        PMI Calculation Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Home price $350,000 · down payment $35,000 → loan $315,000 (90% LTV). At
        an illustrative 0.6% annual rate: annual PMI = $1,890; monthly PMI =
        $157.50. These are simplified estimates, not a lender quote.
      </p>

      <h2
        id="get-rid-of-pmi"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Get Rid of PMI
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        On many eligible conventional loans, borrowers may request cancellation
        or see automatic termination once scheduled LTV and payment conditions
        are met under applicable rules (for example, concepts in the U.S.
        Homeowners Protection Act). Refinancing or other product changes may also
        affect insurance. Exact eligibility depends on the loan. FHA MIP follows
        different rules. This calculator does not estimate a cancellation date.
      </p>

      <h2
        id="twenty-percent"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        PMI and the 20% Down Payment
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A 20% down payment corresponds to an 80% original LTV. Many conventional
        purchase loans avoid borrower-paid PMI at or below that threshold.
        Requirements still vary by lender and product. The calculator’s guidance
        treats LTV above 80% as “may be required” and LTV at or below 80% as
        “generally not required” under that simplified conventional assumption —
        while still computing premiums from any rate you enter.
      </p>

      <h2
        id="pmi-vs-fha"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        PMI vs. FHA Mortgage Insurance
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Conventional PMI and FHA mortgage insurance premiums are different
        products with different pricing and cancellation frameworks. Do not use
        this PMI estimate as an FHA MIP calculation.
      </p>

      <h2
        id="pros-cons"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Advantages and Disadvantages of PMI
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        PMI can help eligible buyers purchase with less than 20% down and reduce
        upfront cash needs. Trade-offs include higher monthly costs and
        potentially significant cumulative premiums, plus product-specific
        cancellation rules.
      </p>

      <h2
        id="pmi-vs-hoi"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        PMI vs. Homeowners Insurance
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Homeowners insurance generally covers certain property-related risks.
        PMI primarily protects the lender against specified default losses. Both
        may appear in a monthly housing payment but are not interchangeable.
      </p>

      <h2
        id="monthly-payment"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How PMI Affects Monthly Mortgage Payments
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        Total ≈ Principal &amp; Interest + PMI + Property Taxes + Homeowners
        Insurance (+ HOA if any)
      </div>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        PMI Calculator Limitations
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Actual premiums may differ from a constant original-loan-balance model.
        Cancellation and termination follow specific rules. Mortgage product
        matters. Currency selection only changes display denomination — it does
        not imply that U.S. PMI products exist for every market. This tool is not
        a lender approval, insurance quote, or legal advice.
      </p>

      <h2
        id="pmi-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion items={[...PMI_FAQS]} />
      </div>
    </article>
  );
}
