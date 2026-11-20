import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { HOUSE_AFFORDABILITY_FAQS } from './content';

export function HouseAffordabilityGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="how-much-house"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        How Much House Can I Afford?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Affordability depends on income, existing debts, mortgage rate and term,
        down payment, and ownership costs such as taxes, insurance, and HOA dues.
        A lender&apos;s maximum under a guideline can exceed what feels
        comfortable month to month — compare income-based DTI estimates with a
        fixed personal housing budget.
      </p>

      <h2
        id="front-end-ratio"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Front-End Ratio
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 font-mono text-xs text-accent sm:text-sm">
        Front-End DTI = Monthly Qualifying Housing Costs / Gross Monthly Income ×
        100
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Qualifying housing costs in this calculator include principal &amp;
        interest, property tax, homeowners insurance, and HOA under your
        assumptions. The illustrative conventional front-end guideline is 28%.
      </p>

      <h2
        id="back-end-ratio"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Back-End Ratio
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 font-mono text-xs text-accent sm:text-sm">
        Back-End DTI = (Housing Costs + Other Monthly Debts) / Gross Monthly
        Income × 100
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Existing debt obligations reduce the housing allowance under the
        back-end limit. The tighter of front-end and back-end caps usually binds.
      </p>

      <h2
        id="conventional-2836"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Conventional Loans and the 28/36 Rule
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The 28/36 pair is a common teaching guideline for conventional-style
        affordability estimates. Actual lenders may allow higher or lower ratios
        depending on credit, reserves, and overlays.
      </p>

      <h2
        id="fha-loans"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        FHA Loans
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        FHA-insured loans often differ from conventional loans in down payment,
        mortgage insurance, and underwriting flexibility. This tool&apos;s
        FHA-style profile uses illustrative DTI assumptions only and does not
        model mortgage insurance or issue an FHA determination.
      </p>

      <h2
        id="va-loans"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        VA Loans
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        VA loan evaluation can involve residual income and other requirements
        beyond DTI. The VA-style option here is a DTI-only illustrative estimate
        — not official VA underwriting — and does not assume mortgage insurance.
      </p>

      <h2
        id="custom-dti"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Custom Debt-to-Income Ratios
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Custom front-end and back-end limits let you explore risk tolerance and
        alternative underwriting assumptions. Different ratios produce different
        housing budgets and purchase-price estimates.
      </p>

      <h2
        id="unaffordability"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Unaffordability
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Reduce recurring debts</li>
        <li>Increase down payment</li>
        <li>Improve creditworthiness</li>
        <li>Compare mortgage terms and rates</li>
        <li>Consider lower-priced properties</li>
        <li>Build emergency savings</li>
        <li>Revisit total ownership expenses</li>
      </ul>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        No single step guarantees loan approval.
      </p>

      <h2
        id="fixed-vs-income"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Fixed Monthly Budget vs. Income-Based Affordability
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Income-based mode follows lender-style DTI assumptions from income and
        debts. Fixed-budget mode uses a monthly spending cap you choose and can
        include maintenance. A personal budget approach is often more
        conservative or better aligned with household cash flow.
      </p>

      <h2
        id="expenses-beyond"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Expenses Beyond the Mortgage
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Plan for property taxes, insurance, HOA fees, maintenance, repairs,
        utilities, closing costs, possible mortgage insurance, and special
        assessments. Principal and interest alone understate ownership costs.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use the House Affordability Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          In the income-based card, enter income, term, rate, debts, down
          payment, ownership costs, and a DTI profile — then Calculate.
        </li>
        <li>
          Review maximum house price, loan, payment breakdown, and DTI ratios.
        </li>
        <li>
          In the fixed-budget card, enter a monthly budget, mortgage terms, down
          payment, and ownership costs; choose whether fees count toward the
          budget — then Calculate.
        </li>
        <li>Clear each card independently, or reload both at once.</li>
      </ol>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        House Affordability Formula
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Monthly Income = Annual Income / 12</p>
        <p>Housing Budget = min(Income × Front DTI, Income × Back DTI − Debts)</p>
        <p>M = L × r / [1 − (1 + r)^(-n)]</p>
        <p>Find max Price so PI + Tax + Insurance + HOA ≤ Housing Budget</p>
      </div>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Results are estimates. Actual lender decisions can differ. This
        calculator is not a mortgage preapproval or program eligibility
        determination.
      </p>

      <h2
        id="house-affordability-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...HOUSE_AFFORDABILITY_FAQS]} />
      </div>
    </article>
  );
}
