import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { HOME_AFFORDABILITY_FAQS } from './content';

export function HomeAffordabilityGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="how-much-home"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        How Much Home Can I Afford?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Home affordability depends on more than income alone. Household gross
        income, existing monthly debts, down payment, mortgage rate, loan term,
        property taxes, homeowners insurance, HOA fees, and other ownership costs
        all shape a realistic purchase budget. A lender may approve a larger loan
        than a buyer is comfortable carrying month to month — this calculator
        helps compare a payment budget or DTI-based housing limit with those
        ownership expenses.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use Our Home Affordability Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          Choose <strong>Maximum housing payment</strong> or{' '}
          <strong>Household income &amp; DTI</strong>.
        </li>
        <li>
          In Loan specification, enter loan term and interest rate. In payment
          mode, also enter the total monthly housing budget (not P&amp;I alone).
        </li>
        <li>
          Open Additional information for down payment, tax rate, insurance, HOA,
          optional mortgage-insurance rate, and closing-cost estimates.
        </li>
        <li>
          In income mode, enter gross income, monthly debts, and adjust the
          illustrative front-end / back-end DTI limits if needed.
        </li>
        <li>
          Review the estimated home price, loan amount, and monthly housing
          breakdown. Reset to start over.
        </li>
      </ol>

      <h2
        id="how-to-calculate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Your House Affordability
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Convert annual income to monthly gross income (÷ 12).</li>
        <li>
          Compute front-end and back-end housing limits from DTI, or start from an
          explicit monthly housing budget.
        </li>
        <li>
          Subtract price-dependent and fixed housing expenses from that budget to
          leave room for principal and interest.
        </li>
        <li>
          Convert the remaining P&amp;I capacity into a maximum loan principal
          using the amortizing mortgage formula.
        </li>
        <li>Add down payment to estimate an affordable purchase price.</li>
      </ol>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>r = Annual Rate / (12 × 100)</p>
        <p>n = Term Years × 12</p>
        <p>M = L × [r(1+r)^n] / [(1+r)^n − 1]</p>
        <p>L = M × [1 − (1+r)^(-n)] / r</p>
        <p>Front-end limit = Monthly Income × Front DTI</p>
        <p>Back-end limit = (Monthly Income × Back DTI) − Monthly Debts</p>
      </div>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Example: income $120,000/yr → $10,000/mo · debts $800 · 28%/36%</p>
        <p>Front-end = $2,800 · Back-end = $2,800 · Housing budget = $2,800</p>
        <p>
          At 6% for 30 years with $50,000 down and no taxes/insurance, loan
          capacity for a $2,000 P&amp;I slice is about $333,583; home price ≈
          $383,583 when the full budget is available for P&amp;I.
        </p>
      </div>

      <h2
        id="mortgage-rates"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Mortgage Rates Affect Home Affordability
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Higher interest rates reduce the loan principal supported by the same
        monthly principal-and-interest payment. Example: $2,000/mo for 30 years
        supports roughly $333,583 at 6%, but a noticeably smaller principal at 8%
        with the same payment and term. Rate changes therefore move affordable
        purchase prices even when income and debts stay constant.
      </p>

      <h2
        id="budget-homeownership"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Budget for Homeownership
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Plan for mortgage payments, property taxes, insurance, HOA dues,
        maintenance, repairs, utilities, emergency savings, closing costs, and
        moving expenses. A monthly payment estimate is only one part of the true
        cost of owning a home.
      </p>

      <h2
        id="common-expenses"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Common Expenses to Consider When Buying a Home
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <strong>Down payment</strong> — equity contribution toward purchase
          price
        </li>
        <li>
          <strong>Closing costs</strong> — fees and prepaid items at settlement;
          separate from down payment
        </li>
        <li>
          <strong>Recurring housing costs</strong> — P&amp;I, taxes, insurance,
          HOA, possible mortgage insurance
        </li>
      </ul>

      <h2
        id="dti-limits"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Front-End vs. Back-End DTI
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <strong>Front-end DTI</strong> — monthly housing expenses ÷ gross
          monthly income
        </li>
        <li>
          <strong>Back-end DTI</strong> — housing plus other qualifying monthly
          debts ÷ gross monthly income
        </li>
      </ul>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The illustrative 28% / 36% pair is a common teaching guideline, not a
        universal underwriting rule. Programs and lenders may allow higher or
        lower ratios.
      </p>

      <h2
        id="down-payment"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Down Payment Affects Affordability
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A larger down payment generally reduces required loan size and monthly
        P&amp;I for a given price. Balance down payment against closing costs,
        emergency savings, and loan-to-value / mortgage-insurance considerations.
        Putting every liquid dollar into the down payment is not always advisable.
      </p>

      <h2
        id="vs-preapproval"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Home Affordability vs. Mortgage Preapproval
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This calculator produces an estimate from the assumptions you enter.
        Actual eligibility can depend on credit history, verified income,
        employment, assets and reserves, loan program, local rules, and
        underwriting requirements.
      </p>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations of Home Affordability Estimates
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The tool cannot predict future rate changes, income changes, tax or
        insurance increases, maintenance needs, or broader economic conditions.
        Results are for education and planning — not financial, tax, or lending
        advice.
      </p>

      <h2
        id="home-affordability-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...HOME_AFFORDABILITY_FAQS]} />
      </div>
    </article>
  );
}
