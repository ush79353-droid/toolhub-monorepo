import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { EPF_FAQS } from './content';

export function EpfGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        EPF Calculator – Employees&apos; Provident Fund
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This EPF Calculator estimates Indian Employees&apos; Provident Fund
        contributions, the employer split between EPF and EPS, interest
        accumulation under a clear monthly/yearly convention, and a projected
        maturity balance through your chosen retirement age. Results are
 educational estimates; statutory rates, wage ceilings, and interest
        rates can change, and your employer or EPFO membership status may differ.
      </p>

      <h2
        id="what-is-epf"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is EPF?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Employees&apos; Provident Fund is a defined-contribution retirement savings
        arrangement linked to employment. Eligible wages are usually based on
        basic salary plus dearness allowance. Contributions build an account
        balance that earns interest and can be withdrawn or settled under EPFO
        rules.
      </p>

      <h2
        id="how-epf-works"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Does EPF Work?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Each month, the employee contributes a percentage of EPF wages into the
        provident fund. The employer also contributes a percentage of wages. For
        many members, part of the employer contribution funds the Employees&apos;
        Pension Scheme (EPS), and only the remainder is credited to EPF. Interest
        is calculated on eligible EPF balances and credited according to EPFO
        accounting cycles.
      </p>

      <h2
        id="contribution-rate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is the EPF Contribution Rate?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A widely used educational default is 12% employee and 12% employer of EPF
        wages. Some establishments or wage bands use different rates. Treat the
        defaults in this tool as editable simulation inputs, not a substitute for
        your wage slip or EPFO circulars.
      </p>

      <h2
        id="employee-vs-employer"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Employee vs. Employer EPF Contributions
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The employee contribution typically goes entirely to EPF (plus optional
        VPF). The employer&apos;s headline contribution rate is not always fully
        deposited into EPF when EPS applies. Separating those pieces is essential
        for realistic maturity estimates.
      </p>

      <h2
        id="what-is-eps"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is EPS?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The Employees&apos; Pension Scheme is funded mainly from a portion of the
        employer contribution (commonly modeled as 8.33% of a pensionable wage
        base, often subject to a monthly wage ceiling such as ₹15,000). EPS builds
        pension entitlement; those amounts are not treated as EPF principal that
        compounds inside the provident fund corpus in this calculator.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        EPF Calculation Formula
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>EPFSalary = Basic + DA</p>
        <p>EmployeeEPF = EPFSalary × EmployeeRate / 100</p>
        <p>EmployerTotal = EPFSalary × EmployerRate / 100</p>
        <p>EPS = min(EPFSalary, Ceiling) × 8.33 / 100 (if EPS-eligible)</p>
        <p>EmployerEPF = EmployerTotal − EPS</p>
        <p>MonthlyEPFDeposit = EmployeeEPF + EmployerEPF (+ VPF)</p>
      </div>

      <h2
        id="how-to-calculate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate EPF Contributions
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Example: Basic ₹15,000, DA ₹0, employee 12%, employer 12%, EPS-eligible
        with a ₹15,000 ceiling. Employee EPF = ₹1,800. Employer total = ₹1,800.
        EPS ≈ ₹1,249.50 (8.33% of ₹15,000). Employer EPF ≈ ₹550.50. Total monthly
        EPF deposit ≈ ₹2,350.50. EPS remains outside the EPF balance.
      </p>

      <h2
        id="interest"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Is EPF Interest Calculated?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This projection credits monthly deposits at month-end, accrues interest on
        the end-of-month EPF balance at annualRate ÷ 12, and credits accrued
        interest every 12 months (and at the end of the horizon). That is an
        explicit educational convention aligned with monthly running balances and
 annual credits; not a guarantee of EPFO&apos;s exact ledger for every
        financial year boundary or contribution posting date.
      </p>

      <h2
        id="maturity"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate EPF Maturity Amount
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Maturity ≈ opening EPF balance + all future employee EPF deposits +
        employer EPF deposits (+ VPF) + interest credited. The calculator
        simulates month by month so salary growth and the EPS split stay
        consistent across the horizon.
      </p>

      <h2
        id="salary-growth"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Salary Increases Affect EPF
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        When you assume annual salary growth, basic and DA are increased once per
        projection year. Higher wages raise monthly contributions, which then earn
 interest for longer remaining periods: a powerful compounding path for
        younger workers.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use the EPF Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter age, retirement age, basic salary, and DA.</li>
        <li>Set contribution rates, interest assumption, and opening balance.</li>
        <li>Toggle EPS eligibility and edit the wage ceiling if needed.</li>
        <li>Optionally add VPF or compare an alternate scenario.</li>
        <li>Review maturity, interest, chart, and yearly schedule (CSV export).</li>
      </ol>

      <h2
        id="epf-vs-ppf"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        EPF vs. PPF
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        EPF is employment-linked and includes employer money. PPF is a personal
        public provident fund with its own contribution limits and lock-in.
        Comparing them requires matching contribution capacity, liquidity, and tax
 rules; not just headline interest rates.
      </p>

      <h2
        id="epf-vs-eps"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        EPF vs. EPS
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        EPF is a withdrawable corpus (subject to rules). EPS is a pension scheme.
        Mixing EPS cashflows into EPF maturity overstates the provident fund
        balance. This calculator keeps EPS totals visible but separate.
      </p>

      <h2
        id="withdrawal"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        EPF Withdrawal Rules
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Withdrawals and advances depend on service length, reason codes, and
        current EPFO regulations. For authoritative steps, use the official EPFO /
        UMANG member services rather than any third-party estimate.
      </p>

      <h2
        id="taxation"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        EPF Taxation
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Tax outcomes depend on contribution amounts, timing of withdrawal, and
        Income Tax provisions that change over time. This tool does not compute tax
        liability. Verify thresholds and exemptions from current government sources
        or a qualified advisor.
      </p>

      <h2
        id="benefits"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Benefits and Limitations of EPF
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Benefits include disciplined savings, employer contributions, and
        long-term compounding. Limitations include liquidity constraints,
        dependence on employment coverage, changing statutory parameters, and the
        fact that EPS value is not a simple cash balance. Projections inherit
        uncertainty about future wages and interest rates.
      </p>

      <h2
        id="related"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related Calculators
      </h2>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm sm:text-base">
        <li>
          <Link href="/tools/gratuity-calculator" className="text-primary">
            Gratuity Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/sip-calculator" className="text-primary">
            SIP Calculator
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
        <li>
          <Link
            href="/tools/emi-calculator-equated-monthly-installment"
            className="text-primary"
          >
            EMI Calculator
          </Link>
        </li>
      </ul>

      <h2
        id="epf-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion faqs={[...EPF_FAQS]} />
      </div>
    </article>
  );
}
