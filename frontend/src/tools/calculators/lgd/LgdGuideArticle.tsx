import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { LGD_FAQS } from './content';

export function LgdGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        LGD Calculator – Loss Given Default
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Use this LGD Calculator to estimate the portion of a financial exposure
        that may not be recovered after borrower default. Enter a recovery rate
        or loss severity, add exposure at default, and see monetary loss given
        default plus estimated recovery. Advanced mode adds reverse solves and
 optional Probability of Default for Expected Loss; clearly separated
        from LGD amount. Currency labels are denomination only.
      </p>

      <h2
        id="definition"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is Loss Given Default (LGD)?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Loss Given Default measures how severe a loss is if default occurs. Banks
        and analysts track LGD as a percentage (loss severity) and as a monetary
        amount (EAD × LGD rate). Recoveries from collateral, guarantees, or
        workouts reduce loss severity. Percentage LGD is not the same as the
        currency LGD amount, and neither equals Expected Loss unless PD is
        applied.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        LGD Formula – How to Calculate Loss Given Default
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>LGD_rate = 1 − RR</p>
        <p>LGD_amount = EAD × LGD_rate</p>
        <p>Recovery_amount = EAD × RR</p>
        <p>EL = PD × LGD_rate × EAD</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Convert UI percentages to decimals before multiplying (80% → 0.80). In
        the basic model, recovery rate and loss severity sum to 100%.
      </p>

      <h2
        id="recovery-rate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is Recovery Rate?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
 Recovery rate is the share of exposure recovered after default; 
        collateral proceeds, repayments, guarantees, or restructuring outcomes.
        Simplified models may omit recovery timing and costs; those frictions
        matter in practice and in fuller credit-risk methodologies.
      </p>

      <h2
        id="loss-severity"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is Loss Severity?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Loss severity is the unrecovered share. With RR = 80%, severity = 20%.
        Edit either rate field; the other updates from the last-edited source so
        calculations stay consistent without circular loops.
      </p>

      <h2
        id="step-by-step"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate LGD Step by Step
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Exposure (EAD) = PKR 100,000.</li>
        <li>Recovery rate = 80% → loss severity = 20% = 0.20.</li>
        <li>LGD amount = 100,000 × 0.20 = PKR 20,000.</li>
        <li>Recovery amount = 100,000 × 0.80 = PKR 80,000.</li>
      </ol>

      <h2
        id="example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        LGD Calculation Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Secured loan: EAD $250,000 · net recovery $175,000 · unrecovered
        $75,000. LGD rate = 75,000 / 250,000 = 30%. Collateral can raise
        recoveries, but valuation, liquidation costs, and seniority still shape
 outcomes; secured does not always mean low LGD.
      </p>

      <h2
        id="importance"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Why Is Calculating LGD Important?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        LGD supports credit risk management, portfolio analysis, lending and
        pricing decisions, capital planning, stress testing, monitoring, and loss
        forecasting. It complements PD and EAD rather than replacing them.
      </p>

      <h2
        id="vs-pd"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        LGD vs. Probability of Default (PD)
      </h2>
      <div className="my-4 overflow-x-auto rounded-xl border border-border">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-muted/40 text-accent">
            <tr>
              <th className="px-3 py-2 font-semibold">Measure</th>
              <th className="px-3 py-2 font-semibold">Question answered</th>
            </tr>
          </thead>
          <tbody className="text-foreground/90">
            <tr className="border-t border-border">
              <td className="px-3 py-2">PD</td>
              <td className="px-3 py-2">How likely is default?</td>
            </tr>
            <tr className="border-t border-border">
              <td className="px-3 py-2">LGD</td>
              <td className="px-3 py-2">
                How much is lost if default occurs?
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2
        id="vs-ead"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        LGD vs. Exposure at Default (EAD)
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        EAD is the size of the exposure; LGD rate is the severity applied to that
        exposure. Monetary LGD scales with EAD for a given severity.
      </p>

      <h2
        id="expected-loss"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Expected Loss Formula – PD × LGD × EAD
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Example: PD 5%, LGD 20%, EAD PKR 100,000 → EL = 0.05 × 0.20 × 100,000 =
        PKR 1,000. LGD amount remains PKR 20,000. Never present EL and LGD amount
        as equivalent.
      </p>

      <h2
        id="factors"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Factors Affect Loss Given Default?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Collateral quality and valuation, debt seniority, security interests,
        borrower condition, economic environment, recovery expenses, legal
        process, recovery delays, and facility type all influence realized and
        estimated LGD.
      </p>

      <h2
        id="secured"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        LGD for Secured vs. Unsecured Loans
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Secured facilities often show lower average LGD when collateral is
        effective, but overcollateralization, volatile asset values, and weak
        enforcement can still produce high severity. Unsecured loans can have
        high LGD without being “always 100%.”
      </p>

      <h2
        id="banking"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        LGD in Banking and Credit Risk Models
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Internal models, capital planning, loan-loss estimation, Basel
        frameworks, IFRS 9 ECL, and scenario analysis all use LGD concepts.
        Regulatory and accounting LGD methodologies add requirements this
        educational calculator does not replicate.
      </p>

      <h2
        id="advantages"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Advantages of Using an LGD Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Faster arithmetic, consistent percentage conversions, transparent
        formulas, scenario comparison, and clear teaching of RR vs severity vs
        monetary LGD vs expected loss.
      </p>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations of LGD Calculations
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Recovery estimates are uncertain.</li>
        <li>Collateral values and legal costs vary.</li>
        <li>Timing of recoveries is ignored in the basic model.</li>
        <li>Realized LGD can differ from predicted LGD.</li>
        <li>Not a complete regulatory capital or IFRS 9 model.</li>
      </ul>

      <h2
        id="related"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related Calculators
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Explore{' '}
        <Link
          href="/tools/credit-spread-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Credit Spread
        </Link>
        ,{' '}
        <Link
          href="/tools/debt-to-asset-ratio-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Debt to Asset
        </Link>
        ,{' '}
        <Link
          href="/tools/debt-to-equity-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Debt to Equity
        </Link>
        ,{' '}
        <Link
          href="/tools/interest-coverage-ratio-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Interest Coverage
        </Link>
        ,{' '}
        <Link
          href="/tools/debt-service-coverage-ratio-calculator-dscr"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          DSCR
        </Link>
        ,{' '}
        <Link
          href="/tools/ltv-calculator-loan-to-value"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Loan-to-Value
        </Link>
        ,{' '}
        <Link
          href="/tools/loan-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Loan Calculator
        </Link>
        , and{' '}
        <Link
          href="/tools/bond-ytm-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Bond YTM
        </Link>
        .
      </p>

      <h2
        id="lgd-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion items={[...LGD_FAQS]} />
      </div>
    </article>
  );
}
