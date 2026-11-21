import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { EMI_FAQS } from './content';

export function EmiGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        EMI Calculator – Equated Monthly Installment
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This EMI Calculator estimates the fixed monthly payment on a reducing-balance
        loan from principal, nominal annual interest rate, and tenure. It also shows
        total interest, total payable, a principal-versus-interest chart, and an
        amortization schedule. Optional tools cover outstanding balance, extra
        payments, and a simple two-loan comparison. Currency labels are denomination
        only.
      </p>

      <h2
        id="what-is-emi"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is EMI?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        An equated monthly installment is a level monthly payment that covers interest
        due that month plus a portion of principal, so the loan reaches zero by the
        final installment under a fixed rate and term.
      </p>

      <h2
        id="stands-for"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Does EMI Stand For?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        EMI stands for Equated Monthly Installment — commonly used in personal,
        vehicle, and housing loan marketing.
      </p>

      <h2
        id="how-it-works"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Does an EMI Calculator Work?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Enter principal, annual rate, and term in years or months. The calculator
        converts the rate to a monthly decimal, computes EMI, then multiplies by the
        installment count for total payable and interest.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        EMI Formula
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>EMI = P × r(1+r)^n / ((1+r)^n − 1)</p>
        <p>r = R / 1200</p>
        <p>n = months (years × 12 when needed)</p>
        <p>If R = 0%: EMI = P / n</p>
      </div>

      <h2
        id="step-by-step"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate EMI Step by Step
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Example: P = PKR 500,000, R = 10%, tenure = 5 years → n = 60, r ≈ 0.008333.
        EMI ≈ PKR 10,623.52; total payable ≈ PKR 637,411; total interest ≈ PKR 137,411.
      </p>

      <h2
        id="monthly-rate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate the Monthly Interest Rate
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This tool treats the entered rate as a nominal annual rate with monthly
        accrual: r = R/1200. That is not the same as converting an effective annual
        yield.
      </p>

      <h2
        id="total-interest"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Total Interest on a Loan
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Total interest = (EMI × n) − principal, using the unrounded EMI for the
        product before display rounding.
      </p>

      <h2
        id="total-repayment"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate the Total Repayment Amount
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Total payable = EMI × number of installments, excluding fees unless you add
        them outside this calculator.
      </p>

      <h2
        id="amortization"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is an Amortization Schedule?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Each row shows interest on the opening balance, principal repaid, and the new
        balance. Early EMIs are interest-heavy; later EMIs repay more principal.
      </p>

      <h2
        id="principal-vs-interest"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Principal vs. Interest in EMI Payments
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The donut chart compares lifetime principal to lifetime interest. Month by
        month, the split shifts toward principal as the balance falls.
      </p>

      <h2
        id="tenure"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Loan Tenure Affects EMI
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Longer tenures lower monthly EMI but usually raise total interest. Shorter
        tenures raise EMI and cut total interest.
      </p>

      <h2
        id="rates"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Interest Rates Affect EMI
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Higher rates increase both EMI and cumulative interest for the same principal
        and term.
      </p>

      <h2
        id="fixed-vs-floating"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Fixed Interest Rate vs. Floating Interest Rate
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Fixed rates keep the contractual EMI stable. Floating rates can reset, changing
        EMI or tenure. This calculator models a fixed nominal rate only.
      </p>

      <h2
        id="emi-changes"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Can EMI Change During the Loan Term?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Yes — floating rates, restructuring, partial prepayment policies, or missed
        payments can change what you owe. Always check your loan agreement.
      </p>

      <h2
        id="extra-payments"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Extra Payments Reduce Loan Interest
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Extra amounts applied to principal after interest is charged shrink the balance
        sooner, cutting future interest and often the number of months to payoff.
      </p>

      <h2
        id="home-loans"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        EMI Calculator for Home Loans
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Enter the amount financed (price minus down payment), the mortgage rate, and
        term. Property taxes and insurance are typically separate from EMI.
      </p>

      <h2
        id="car-loans"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        EMI Calculator for Car Loans
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Use the financed vehicle amount and the lender’s rate and tenure. For a fuller
        auto quote with taxes and fees, see the{' '}
        <Link
          href="/tools/auto-loan-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Auto Loan Calculator
        </Link>
        .
      </p>

      <h2
        id="personal-loans"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        EMI Calculator for Personal Loans
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Personal loans often use shorter tenures and higher rates. Plug in the
        disbursed principal and quoted rate to estimate EMI and total interest.
      </p>

      <h2
        id="vs-simple"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        EMI vs. Simple Interest
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Simple interest may charge interest on the original principal for the whole
        term. EMI amortization charges interest on the declining balance each month.
      </p>

      <h2
        id="mistakes"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Common EMI Calculation Mistakes
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Using the annual rate as if it were the monthly rate.</li>
        <li>Forgetting to convert years to months.</li>
        <li>Confusing principal with total repayment.</li>
        <li>Ignoring fees and insurance.</li>
        <li>Assuming every product uses reducing-balance interest.</li>
        <li>Rounding EMI too early before computing totals.</li>
        <li>Treating fixed and floating loans as identical.</li>
      </ul>

      <h2
        id="related"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related Calculators
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <Link
          href="/tools/loan-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Loan
        </Link>
        {' · '}
        <Link
          href="/tools/auto-loan-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Auto Loan
        </Link>
        {' · '}
        <Link
          href="/tools/amortization-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Amortization
        </Link>
        {' · '}
        <Link
          href="/tools/repayment-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Repayment
        </Link>
        {' · '}
        <Link
          href="/tools/simple-interest-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Simple Interest
        </Link>
      </p>

      <h2
        id="emi-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion faqs={[...EMI_FAQS]} />
      </div>
    </article>
  );
}
