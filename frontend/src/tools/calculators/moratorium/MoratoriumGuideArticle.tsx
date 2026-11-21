import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { MORATORIUM_FAQS } from './content';

export function MoratoriumGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Moratorium Calculator – Calculate EMI After Loan Moratorium
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This Moratorium Calculator estimates how temporarily postponing EMI
        principal payments affects outstanding balance, accrued interest,
        revised installments, maturity date, and lifetime interest cost. It
        supports capitalized interest and interest-only moratoriums plus three
 common restructuring plans. Results are educational models, not lender
        quotes.
      </p>

      <h2
        id="what-is-moratorium"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is a Moratorium Period?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A moratorium is a contractual pause or reduction of scheduled loan
        payments for a defined time. It improves short-term cash flow but usually
        does not erase interest obligations.
      </p>

      <h2
        id="what-is-calculator"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is a Loan Moratorium Calculator?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        It applies amortizing-loan math before, during, and after the deferment
        window so you can compare original and revised EMIs, tenures, and total
        interest.
      </p>

      <h2
        id="how-it-works"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Does a Loan Moratorium Work?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Payments (or principal portions) stop or shrink for m months. Interest
        typically continues. Afterward, the lender may raise EMI, extend tenure,
 or both. Forgiveness would cancel debt, this tool models deferment, not
        write-off.
      </p>

      <h2
        id="interest"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Moratorium Interest
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>r = monthly equivalent of nominal annual rate</p>
        <p>Capitalized: B_m = P(1+r)^m · I = B_m − P</p>
        <p>Interest-only: pay P×r each month · principal stays P</p>
      </div>

      <h2
        id="capitalized"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is Capitalized Interest?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Accrued interest added to principal. Future EMIs then amortize a larger
        balance, which can raise monthly payments or extend tenure.
      </p>

      <h2
        id="types"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Types of Loan Moratorium
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Full deferment (no payments, often capitalizing interest) versus
        interest-only deferment (principal frozen while interest is settled
        monthly). Hybrid lender products exist; map them to the closest option
        here.
      </p>

      <h2
        id="emi-impact"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Does a Moratorium Affect EMI?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Keeping the original maturity after capitalization usually raises EMI.
        Extending the term can moderate the payment increase. Keeping the same
        EMI generally lengthens repayment and may be impossible if EMI no longer
        covers interest.
      </p>

      <h2
        id="vs-restructuring"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Loan Moratorium vs. Loan Restructuring
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A moratorium is a temporary payment pause. Restructuring redesigns the
        repayment path afterward (EMI, tenure, or both). This calculator combines
        both steps.
      </p>

      <h2
        id="emi-after"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate EMI After Moratorium
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Compute post-moratorium balance B_m, choose remaining periods n_r, then
        EMI = B_m r (1+r)^n_r / ((1+r)^n_r − 1). For same-EMI tenure solving use
        n = −ln(1 − B_m r / EMI) / ln(1+r).
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use the Moratorium Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Choose tenure or EMI estimation mode and enter loan inputs.</li>
        <li>Set balance date, rate, and optional compounding.</li>
        <li>Choose interest treatment and repayment plan.</li>
        <li>Set moratorium start and duration.</li>
        <li>Compare summary metrics, chart, and full schedule.</li>
      </ol>

      <h2
        id="pros-cons"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Advantages and Disadvantages of a Loan Moratorium
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Advantages: temporary relief and flexibility. Disadvantages: higher
        lifetime interest, possible EMI jump, longer debt, and potential credit
        or contractual consequences depending on how the pause is reported.
      </p>

      <h2
        id="example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Loan Moratorium Calculation Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        ₹300,000 at 8% for 10 years with a 12-month capitalized moratorium
        starting at the balance date: balance grows by about one year of compound
        interest, then EMI is recalculated over the remaining months to the
 original maturity under the same-term plan, typically raising the monthly
        payment and total interest versus no deferment.
      </p>

      <h2
        id="related"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related Calculators
      </h2>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm sm:text-base">
        <li>
          <Link
            href="/tools/emi-calculator-equated-monthly-installment"
            className="text-primary"
          >
            EMI Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/loan-calculator" className="text-primary">
            Loan Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/compound-interest-calculator"
            className="text-primary"
          >
            Compound Interest Calculator
          </Link>
        </li>
      </ul>

      <h2
        id="moratorium-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...MORATORIUM_FAQS]} />
      </div>
    </article>
  );
}
