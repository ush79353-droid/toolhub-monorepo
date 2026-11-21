import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { DISCRETIONARY_INCOME_FAQS } from './content';

export function DiscretionaryIncomeGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Discretionary Income Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Discretionary income means different things in different contexts. This
        calculator estimates student-loan discretionary income from AGI, family
        size, state (HHS poverty region), and a named repayment calculation
 standard; or, separately, budgeting discretionary income as take-home
        pay minus necessary expenses. The two results are not interchangeable.
      </p>

      <h2
        id="what-is"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is Discretionary Income?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        In everyday budgeting, discretionary income is what remains after
        necessary living costs. For many federal income-driven repayment (IDR)
        formulas, discretionary income is the amount by which applicable AGI
        exceeds a multiple of the federal poverty guideline for the household.
      </p>

      <h2
        id="vs-disposable"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Discretionary Income vs. Disposable Income
      </h2>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[28rem] border-collapse text-left text-sm text-foreground/90">
          <thead>
            <tr className="border-b border-border text-accent">
              <th className="py-2 pr-3 font-semibold">Term</th>
              <th className="py-2 font-semibold">Meaning</th>
            </tr>
          </thead>
          <tbody className="align-top">
            <tr className="border-b border-border/70">
              <td className="py-2 pr-3 font-medium">Disposable income</td>
              <td className="py-2">Income remaining after applicable taxes</td>
            </tr>
            <tr className="border-b border-border/70">
              <td className="py-2 pr-3 font-medium">Budgeting discretionary</td>
              <td className="py-2">Take-home − necessary expenses</td>
            </tr>
            <tr>
              <td className="py-2 pr-3 font-medium">Student-loan DI</td>
              <td className="py-2">max(0, AGI − k × poverty guideline)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2
        id="how-calculated"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Is Discretionary Income Calculated?
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Student loan: DI = max(0, AGI − kP)</p>
        <p>Budgeting: DI = TakeHome − NecessaryExpenses</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Because the inputs differ, the same household can show a large
 student-loan DI and a small (or negative) budgeting DI, or the reverse.
      </p>

      <h2
        id="student-loans"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Discretionary Income and Student Loans
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Income-driven repayment ties payments to discretionary income using
        plan-specific protection multipliers (for example 150% or 100% of the
        poverty guideline) and assessment rates (for example 10% or 15% of DI).
        Family size, marital/filing status, AGI treatment, and plan eligibility
        matter. This tool labels each standard and does not claim every plan is
        open to new applicants.
      </p>

      <h2
        id="agi"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is Adjusted Gross Income?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        AGI appears on your federal return after certain adjustments. It is not
        the same as gross wages or monthly take-home pay. IDR formulas typically
        start from AGI (or a related measure under program rules).
      </p>

      <h2
        id="fpl"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Are Federal Poverty Guidelines?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        HHS publishes annual poverty guidelines by household size. Alaska and
        Hawaii have separate tables. This calculator embeds verified Federal
        Register figures for supported years and links the source on each
        result.
      </p>

      <h2
        id="marital"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Does Marital Status Affect Discretionary Income?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Single borrowers typically count themselves plus dependents. Married
        filing jointly usually combines AGI and includes the spouse in family
        size. Married filing separately may exclude spouse income and spouse
        from family size under some standards, while other standards still count
 spouse income; this tool follows the selected standard’s coded rules.
      </p>

      <h2
        id="how-to-student"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Discretionary Income for Student Loans
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Illustrative math only (not an official poverty figure): AGI $60,000 ·
        hypothetical P $20,000 · k = 1.5.
      </p>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Protected = 20,000 × 1.5 = 30,000</p>
        <p>DI = 60,000 − 30,000 = 30,000</p>
        <p>Monthly DI = 30,000 / 12 = 2,500</p>
        <p>If r = 10%: payment ≈ (30,000 × 0.10) / 12 = 250</p>
      </div>

      <h2
        id="how-to-budget"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Discretionary Income for Budgeting
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Example: take-home $5,000 · necessary expenses $3,600 → DI = $1,400.
        Separate essentials from optional spending; reducing optional costs
        raises budgeting DI but does not change the student-loan threshold
        formula.
      </p>

      <h2
        id="increase"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Increase Discretionary Income
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Raise take-home pay or reduce necessary costs (budgeting)</li>
        <li>Review recurring bills and debt minimums</li>
        <li>
 For student loans, DI follows AGI, family size, and the plan formula; 
          not your grocery list
        </li>
      </ul>

      <h2
        id="mistakes"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Common Mistakes When Calculating Discretionary Income
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Confusing gross income or take-home pay with AGI</li>
        <li>Using an outdated poverty guideline year</li>
        <li>Wrong household size or filing-status assumptions</li>
        <li>Applying the wrong protection multiplier or assessment rate</li>
        <li>Treating disposable income as student-loan DI</li>
      </ul>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations of the Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Federal student-loan rules and plan availability change. Estimated
        payments omit many servicer-specific caps and eligibility checks.
        Poverty figures are limited to verified years embedded in the tool.
        Always confirm with official Department of Education and HHS sources.
      </p>

      <h2
        id="related"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related Calculators
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <Link
            href="/tools/adjusted-gross-income-agi-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Adjusted Gross Income (AGI) Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/student-loan-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Student Loan Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/student-loan-payment-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Student Loan Payment Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/budget-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Budget Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/annual-income-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Annual Income Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/wage-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Wage Calculator
          </Link>
        </li>
      </ul>

      <h2
        id="discretionary-income-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...DISCRETIONARY_INCOME_FAQS]} />
      </div>
    </article>
  );
}
