import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { PITI_FAQS } from './content';

export function PitiGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-piti"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is PITI?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        PITI stands for Principal, Interest, Taxes, and Insurance. Principal is
        the part of each payment that reduces the loan balance. Interest is the
        lender’s charge for the loan. Taxes are property taxes expressed as a
        monthly amount. Insurance is homeowners insurance on the same monthly
        basis. Together they approximate a fuller housing payment than
        principal and interest alone.
      </p>

      <h2
        id="why-matters"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Why Does PITI Matter?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Buyers and lenders use PITI-style figures for affordability, budgeting,
        and debt-to-income discussions. Property taxes and insurance can add
        hundreds per month. HOA fees, PMI, utilities, and maintenance may still
        sit outside PITI.
      </p>

      <h2
        id="how-to-calculate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate PITI
      </h2>
      <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Start with mortgage principal.</li>
        <li>Convert the annual rate to a monthly rate (÷ 12).</li>
        <li>Convert term years (and months) into total months n.</li>
        <li>Compute the amortizing principal-and-interest payment M.</li>
        <li>Divide annual property tax by 12.</li>
        <li>Divide annual homeowners insurance by 12.</li>
        <li>Add M + monthly tax + monthly insurance.</li>
      </ol>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>$200,000 · 30 years · 7% · tax $3,600 · insurance $1,200</p>
        <p>M ≈ $1,330.60 · tax $300 · insurance $100</p>
        <p>PITI ≈ $1,730.60 / month</p>
      </div>

      <h2
        id="how-calculator-works"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Does the PITI Mortgage Calculator Work?
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>PITI = Pr / (1 − (1+r)^−n) + T/12 + I/12</p>
        <p>r = annualRate / (100 × 12) · n = years×12 + months</p>
        <p>If r = 0: PITI = P/n + T/12 + I/12</p>
      </div>
      <p className="text-sm leading-relaxed text-foreground/90 sm:text-base">
        P is principal, r monthly rate, n payment count, T annual tax, and I
        annual insurance.
      </p>

      <h2
        id="vs-payment"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        PITI vs. Monthly Mortgage Payment
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Principal and interest alone understate cash needs when taxes and
        insurance are escrowed or paid separately. PITI is still not a full
        cost-of-ownership figure if HOA, utilities, or maintenance apply.
      </p>

      <h2
        id="taxes-effect"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Do Property Taxes Affect PITI?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Raising annual tax from $3,600 to $4,800 adds $100 per month to PITI
        when everything else is unchanged ($3,600/12 = $300; $4,800/12 = $400).
      </p>

      <h2
        id="insurance-effect"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Does Homeowners Insurance Affect PITI?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Higher annual premiums raise the monthly insurance leg (premium ÷ 12).
        Rates vary with location, coverage, deductible, and home characteristics.
      </p>

      <h2
        id="lower-piti"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Lower PITI
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Borrow less (larger down payment or lower price).</li>
        <li>Secure a lower interest rate when available.</li>
        <li>
          Lengthen the term to cut the monthly P&amp;I (usually raising total
          interest).
        </li>
        <li>Shop insurance and review tax assessments carefully.</li>
      </ul>

      <h2
        id="included"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is Included in PITI?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Included here: amortizing principal &amp; interest, annual property tax
        ÷ 12, and annual homeowners insurance ÷ 12. Not included: PMI, HOA,
        utilities, maintenance, or closing costs.
      </p>

      <h2
        id="dti"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        PITI and Debt-to-Income Ratio
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Lenders often compare housing obligations to income. Exact formulas and
        limits depend on the loan program. Use this tool for estimates, not as
        underwriting approval.
      </p>

      <h2
        id="piti-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion items={[...PITI_FAQS]} />
      </div>
    </article>
  );
}
