import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { FIFTY_THIRTY_TWENTY_FAQS } from './content';

export function FiftyThirtyTwentyGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2 id="what-is-rule" className="text-xl font-bold tracking-tight text-accent sm:text-2xl">
        What is the 50/30/20 rule? How to make a budget
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The 50/30/20 budgeting rule is a simple framework that divides after-tax income into three
        buckets: 50% necessities, 30% wants, and 20% savings. It supports monthly income planning,
        clear category targets, and consistent tracking. Use it as a starting point — location,
        household size, debt, and goals may require different splits.
      </p>

      <h2
        id="what-are-necessities"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What are necessities?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Necessities are expenses required to maintain basic living standards: housing (rent or
        mortgage), groceries, utilities, transportation, basic healthcare, insurance, essential
        communication, and minimum debt payments. Basic groceries are needs; restaurant meals are
        usually wants. Basic commuting is a need; luxury vehicle upgrades are usually wants.
      </p>

      <h2
        id="what-are-wants"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What are wants?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Wants are discretionary expenses that improve lifestyle but are not essential: dining out,
        entertainment, vacations, shopping, hobbies, streaming, premium memberships, and
        non-essential electronics. Controlling wants does not mean eliminating every enjoyable
        purchase — it means keeping lifestyle spending intentional.
      </p>

      <h2
        id="what-counts-as-savings"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What counts as savings?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Savings fund future security and goals: emergency reserves, retirement contributions,
        investments, education funds, future purchases, extra debt payments, and long-term
        independence goals. Consistent automatic transfers help this bucket stick. Building an
        emergency fund is often the first priority.
      </p>

      <h2
        id="how-calculator-works"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How does the 50/30/20 rule calculator work?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Enter monthly after-tax income. The calculator applies:
      </p>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Needs = Income × 0.50</p>
        <p className="mt-2">Wants = Income × 0.30</p>
        <p className="mt-2">Savings = Income × 0.20</p>
      </div>
      <p className="text-sm leading-relaxed text-foreground/90 sm:text-base">
        Amounts are rounded in currency units so the three categories still add up to your income.
        Annual figures multiply each monthly allocation by 12.
      </p>

      <h2
        id="budgeting-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        An example of the 50/30/20 budgeting rule
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Monthly after-tax income = $4,500</p>
        <p className="mt-2">Necessities: 4,500 × 0.50 = $2,250</p>
        <p>Wants: 4,500 × 0.30 = $1,350</p>
        <p>Savings: 4,500 × 0.20 = $900</p>
        <p className="mt-2">Annual income = $54,000</p>
        <p>Annual necessities = $27,000 · wants = $16,200 · savings = $10,800</p>
      </div>

      <h2 id="how-to-adjust" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to adjust the 50/30/20 rule
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Treat the rule as a guideline. High housing costs, low income, high-interest debt, family
        responsibilities, medical expenses, short-term goals, or aggressive retirement saving may
        require different percentages. Some households need more than 50% for necessities; others
        can save more than 20%.
      </p>

      <h2
        id="budgeting-tips"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Tips for following the 50/30/20 rule
      </h2>
      <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Track monthly spending.</li>
        <li>Separate needs from wants deliberately.</li>
        <li>Automate savings transfers.</li>
        <li>Build an emergency fund.</li>
        <li>Review subscriptions and recurring wants.</li>
        <li>Avoid unnecessary high-interest debt.</li>
        <li>Monitor budget performance each month.</li>
        <li>Adjust allocations when income changes.</li>
        <li>Review goals regularly.</li>
        <li>Use budgeting tools for consistency.</li>
      </ol>

      <h2
        id="related-calculators"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related calculators
      </h2>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm sm:text-base">
        <li>
          <Link href="/tools/business-budget-calculator" className="text-primary hover:underline">
            Business Budget Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/savings-calculator" className="text-primary hover:underline">
            Savings Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/savings-goal-calculator" className="text-primary hover:underline">
            Savings Goal Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/salary-calculator" className="text-primary hover:underline">
            Salary Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/compound-interest-calculator" className="text-primary hover:underline">
            Compound Interest Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/debt-calculator" className="text-primary hover:underline">
            Debt Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/702010-rule-money-calculator"
            className="text-primary hover:underline"
          >
            70/20/10 Rule Calculator
          </Link>
        </li>
      </ul>

      <h2 id="budget-faq" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Frequently asked questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...FIFTY_THIRTY_TWENTY_FAQS]} />
      </div>
    </article>
  );
}
