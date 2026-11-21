import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { EMERGENCY_FUND_FAQS } from './content';

export function EmergencyFundGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-emergency-fund"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What is an emergency fund? Emergency fund definition
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        An emergency fund is money set aside to cover essential living costs when something
 unexpected happens; job loss, medical bills, urgent repairs, temporary income gaps, or
        family emergencies. Keeping that cash accessible and relatively low risk reduces pressure to
        rely only on high-interest credit. Size the fund from essential monthly expenses, not gross
        income.
      </p>

      <h2
        id="calculator-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        The emergency fund calculator and example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Meet Cindy. Her essential monthly expenses average $2,500, and she wants six months of
        coverage. Use the Budget Calculator to organize expense categories if needed, then apply the
        same three steps here.
      </p>
      <h3 className="mt-4 text-base font-semibold text-accent">
        Step 1: Determine monthly expenses
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Cindy adds housing, food, utilities, transportation, insurance, and other essentials. Her
        average monthly expenses are $2,500.
      </p>
      <h3 className="mt-4 text-base font-semibold text-accent">
        Step 2: Choose months of savings
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Based on her risk and responsibilities, Cindy chooses six months. Others may prefer three,
        nine, or twelve.
      </p>
      <h3 className="mt-4 text-base font-semibold text-accent">
        Step 3: Calculate the emergency fund
      </h3>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Emergency Fund = Monthly Expenses × Number of Months</p>
        <p className="mt-2">$2,500 × 6 = $15,000</p>
      </div>
      <p className="text-sm leading-relaxed text-foreground/90 sm:text-base">
        Cindy should aim for a $15,000 emergency fund. Load example in the calculator uses these
        figures.
      </p>

      <h2
        id="how-much-funding"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How much emergency funding should I have?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A widely used starting range is three to six months of essentials. None of these bands is
 mandatory; match coverage to your situation.
      </p>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
 <strong className="font-medium text-accent">About three months</strong>: more stable
          employment, predictable income, lower obligations, or strong backup support.
        </li>
        <li>
 <strong className="font-medium text-accent">About six months</strong>: dependents, higher
          fixed costs, variable income, or industry uncertainty.
        </li>
        <li>
 <strong className="font-medium text-accent">Nine to twelve+ months</strong>: freelancers,
          self-employed or commission workers, business owners, or households with larger
          responsibilities.
        </li>
      </ul>

      <h2
        id="related-calculators"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related calculators
      </h2>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm sm:text-base">
        <li>
          <Link href="/tools/savings-calculator" className="text-primary hover:underline">
            Savings Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/business-budget-calculator" className="text-primary hover:underline">
            Business Budget Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/savings-goal-calculator" className="text-primary hover:underline">
            Savings Goal Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/savings-plan-calculator" className="text-primary hover:underline">
            Savings Plan Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/dream-come-true-calculator" className="text-primary hover:underline">
            Dream Come True Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/savings-withdrawal-calculator"
            className="text-primary hover:underline"
          >
            Savings Withdrawal Calculator
          </Link>
        </li>
      </ul>

      <h2
        id="emergency-fund-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently asked questions
      </h2>
      <div className="my-3 overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[320px] text-left text-sm">
          <caption className="border-b border-border bg-muted/40 px-3 py-2 text-left text-xs font-medium text-accent">
            Example: $2,500 monthly expenses
          </caption>
          <thead className="bg-muted/60 text-xs text-muted-foreground">
            <tr>
              <th className="px-3 py-2 font-medium">Coverage</th>
              <th className="px-3 py-2 text-right font-medium">Required emergency fund</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-border">
              <td className="px-3 py-1.5">3 months</td>
              <td className="px-3 py-1.5 text-right tabular-nums">$7,500</td>
            </tr>
            <tr className="border-t border-border">
              <td className="px-3 py-1.5">4 months</td>
              <td className="px-3 py-1.5 text-right tabular-nums">$10,000</td>
            </tr>
            <tr className="border-t border-border">
              <td className="px-3 py-1.5">6 months</td>
              <td className="px-3 py-1.5 text-right tabular-nums">$15,000</td>
            </tr>
            <tr className="border-t border-border">
              <td className="px-3 py-1.5">9 months</td>
              <td className="px-3 py-1.5 text-right tabular-nums">$22,500</td>
            </tr>
            <tr className="border-t border-border">
              <td className="px-3 py-1.5">12 months</td>
              <td className="px-3 py-1.5 text-right tabular-nums">$30,000</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="mt-4">
        <FAQAccordion items={[...EMERGENCY_FUND_FAQS]} />
      </div>
    </article>
  );
}
