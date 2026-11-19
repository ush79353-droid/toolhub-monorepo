import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import {
  COLLEGE_COST_HREF,
  COMPOUND_INTEREST_HREF,
  SAVINGS_GOAL_HREF,
  TRUMP_ACCOUNTS_FAQS,
} from './content';

export function TrumpAccountsGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-a-trump-account"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What is a Trump Account?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Trump Accounts are discussed as tax-advantaged investment accounts designed
        for eligible children. The idea is to give families a dedicated place to set
        aside money that can grow through contributions and investment returns over
        many years, with parents or guardians typically involved in funding and
        oversight.
      </p>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Account rules, eligibility, any government contributions, contribution
        limits, investment restrictions, and withdrawal provisions depend on
        applicable legislation and official guidance. This page uses illustrative
        math only — it does not establish legal eligibility or tax treatment.
      </p>
      <div className="mt-4 rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-sm leading-relaxed text-sky-950/90">
        Withdrawals before the applicable eligibility age may be restricted or
        subject to tax consequences and penalties. Always review the current
        account rules before making withdrawal decisions.
      </div>

      <h2
        id="how-to-use-trump-accounts-calculator"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to use Trump Accounts Calculator
      </h2>
      <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter the child&apos;s current starting age (0–17).</li>
        <li>Enter the starting account balance.</li>
        <li>Enter the expected annual contribution.</li>
        <li>Select an investment return scenario (optimistic, conservative, or pessimistic).</li>
        <li>Choose the target age for the projection (default 18).</li>
        <li>Optionally enable inflation adjustment and set an inflation rate.</li>
        <li>Review the projected final balance, total contributions, and investment growth.</li>
        <li>Compare contributions with growth on the pie chart.</li>
      </ol>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The calculator compounds the starting balance annually and treats contributions
        as end-of-year deposits (ordinary annuity). Results are estimates — actual
        returns may differ. Explore related tools like the{' '}
        <Link
          href={COMPOUND_INTEREST_HREF}
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Compound Interest Calculator
        </Link>
        ,{' '}
        <Link
          href={SAVINGS_GOAL_HREF}
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Savings Goal Calculator
        </Link>
        , or{' '}
        <Link
          href={COLLEGE_COST_HREF}
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          College Cost Calculator
        </Link>
        .
      </p>
      <div className="mt-4 rounded-xl border border-amber-200/80 bg-amber-50/70 px-3.5 py-3 text-sm leading-relaxed text-amber-950/90">
        Scenario rates (10%, 6%, 4%) are configurable assumptions for illustration.
        They are not promises of investment performance.
      </div>

      <h2
        id="example-calculation"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Example calculation: what the numbers really say
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Illustrative inputs: starting age 0, starting balance $1,000, annual
        contribution $5,000, 6% return, project to age 18, inflation 2.5%.
      </p>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          Years: <span className="font-mono">N = 18 − 0 = 18</span>
        </li>
        <li>
          Starting balance growth:{' '}
          <span className="font-mono">FV_initial = 1000 × (1.06)¹⁸</span>
        </li>
        <li>
          Contributions:{' '}
          <span className="font-mono">
            FV_contrib = 5000 × ((1.06)¹⁸ − 1) / 0.06
          </span>
        </li>
        <li>
          Total contributions:{' '}
          <span className="font-mono">1000 + 5000 × 18 = $91,000</span>
        </li>
        <li>
          Final balance ≈ <strong>$157,382.60</strong>; investment growth ≈{' '}
          <strong>$66,382.60</strong>
        </li>
        <li>
          Inflation-adjusted purchasing power ≈{' '}
          <strong>$100,908.36</strong> at 2.5% inflation
        </li>
      </ul>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This is a mathematical projection only — not a guaranteed account benefit or
        investment return.
      </p>

      <h2
        id="trump-vs-529-vs-brokerage"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Trump Account vs. 529 plan vs. brokerage account
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        High-level comparison for orientation. Verify Trump Account provisions against
        current official legislation and IRS guidance. Do not treat this table as tax
        or legal advice.
      </p>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="px-3 py-2 font-semibold text-accent">Account type</th>
              <th className="px-3 py-2 font-semibold text-accent">Purpose</th>
              <th className="px-3 py-2 font-semibold text-accent">Tax treatment</th>
              <th className="px-3 py-2 font-semibold text-accent">Contribution rules</th>
              <th className="px-3 py-2 font-semibold text-accent">Withdrawal rules</th>
              <th className="px-3 py-2 font-semibold text-accent">Investment flexibility</th>
            </tr>
          </thead>
          <tbody className="text-foreground/90">
            <tr className="border-b border-border">
              <td className="px-3 py-2 font-medium">Trump Account</td>
              <td className="px-3 py-2">Child-focused long-term savings (as defined by statute)</td>
              <td className="px-3 py-2">Depends on enacted rules — confirm officially</td>
              <td className="px-3 py-2">Limits and eligible contributors per current guidance</td>
              <td className="px-3 py-2">May restrict early withdrawals; check penalties/tax</td>
              <td className="px-3 py-2">May be limited to approved investments</td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-3 py-2 font-medium">529 Plan</td>
              <td className="px-3 py-2">Education savings (qualified expenses)</td>
              <td className="px-3 py-2">Often tax-advantaged for qualified education use</td>
              <td className="px-3 py-2">Plan and federal gift-tax rules apply</td>
              <td className="px-3 py-2">Qualified education withdrawals preferred</td>
              <td className="px-3 py-2">Plan investment menus; limited control</td>
            </tr>
            <tr>
              <td className="px-3 py-2 font-medium">Ordinary brokerage</td>
              <td className="px-3 py-2">General investing / taxable account</td>
              <td className="px-3 py-2">Taxable dividends/gains under ordinary rules</td>
              <td className="px-3 py-2">No education-specific contribution caps</td>
              <td className="px-3 py-2">Flexible; taxes may apply on sales</td>
              <td className="px-3 py-2">Broad investment choice</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2
        id="trump-accounts-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently asked questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion faqs={[...TRUMP_ACCOUNTS_FAQS]} />
      </div>
    </article>
  );
}
