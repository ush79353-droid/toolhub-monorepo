import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { FIRE_FAQS } from './content';

export function FireGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <p className="text-sm leading-relaxed text-foreground/90 sm:text-base">
        FIRE — Financial Independence, Retire Early — is about building an investment portfolio that
        can cover living expenses so work becomes optional. This calculator estimates your FIRE
        number, how much to save each year, what savings rate that implies, and whether your plan
        reaches independence by a chosen age. Investment returns and inflation are planning
        assumptions, not guarantees.
      </p>

      <h2
        id="what-is-fire"
        className="mt-8 text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What is the FIRE early retirement movement?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The movement emphasizes high savings rates, lower lifestyle costs, diversified investing, and
        using portfolio withdrawals to fund living expenses. Financial independence does not always
        mean never working again — it means choosing how to spend time without relying on a paycheck.
      </p>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <strong className="font-medium text-accent">Lean FIRE</strong> — frugal spending, smaller
          portfolio.
        </li>
        <li>
          <strong className="font-medium text-accent">Traditional FIRE</strong> — mainstream expense
          levels, often illustrated with a 4% withdrawal.
        </li>
        <li>
          <strong className="font-medium text-accent">Fat FIRE</strong> — higher spending and a larger
          nest egg.
        </li>
        <li>
          <strong className="font-medium text-accent">Barista FIRE</strong> — partial independence with
          some earned income.
        </li>
        <li>
          <strong className="font-medium text-accent">Coast FIRE</strong> — savings already large enough
          that compounding alone may fund a later traditional retirement.
        </li>
      </ul>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Practical considerations include avoiding high-interest debt, keeping emergency reserves,
        diversifying investments, planning for healthcare, and using realistic return assumptions.
      </p>

      <h2
        id="fire-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to calculate your FIRE number — FIRE formula
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The traditional FIRE number divides annual retirement expenses by a safe withdrawal rate. With
        a 4% rate:
      </p>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>FIRE Number = Annual Expenses / 0.04</p>
        <p className="mt-2">FIRE Number = Annual Expenses × 25</p>
        <p className="mt-2">Example: $40,000 / 0.04 = $1,000,000</p>
      </div>
      <p className="text-sm leading-relaxed text-foreground/90 sm:text-base">
        This calculator can inflate today’s expenses to retirement-year dollars before applying the
        4% rule, a custom withdrawal rate, or a retirement-duration present-value model. Taxes,
        fees, and market volatility can change real outcomes.
      </p>

      <h2
        id="fire-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        FIRE early retirement calculator: real-life example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Sample inputs: age 30, retire at 45, income $80,000, expenses $40,000, savings $10,000,
        return 5%, expense inflation 2.5%, life expectancy 85, 4% withdrawal.
      </p>
      <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Years until retirement = 45 − 30 = 15.</li>
        <li>Retirement duration = 85 − 45 = 40.</li>
        <li>
          Expenses at retirement = $40,000 × (1.025)¹⁵ ≈ $57,932.
        </li>
        <li>FIRE number ≈ $57,932 / 0.04 ≈ $1,448,298.</li>
        <li>Future value of $10,000 at 5% for 15 years ≈ $20,789.</li>
        <li>
          Required annual savings fills the gap between that future value and the FIRE number using
          the annuity formula.
        </li>
        <li>Required savings rate = annual savings ÷ $80,000.</li>
      </ol>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Load example in the calculator uses these inputs so on-screen results match the same engine.
      </p>

      <h2
        id="reach-faster"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to reach financial independence faster
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Increase the savings rate and cut non-essential spending.</li>
        <li>Grow income and invest consistently.</li>
        <li>Avoid high-interest debt and lifestyle inflation.</li>
        <li>Diversify, keep emergency reserves, and revisit targets as life changes.</li>
      </ul>

      <h2
        id="understanding-results"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Understanding your FIRE results
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The FIRE number is capital needed at retirement. Projected savings shows where your plan
        lands if contributions and returns match assumptions. Required annual/monthly savings and
        the savings-rate percentage describe the contribution path. Status labels summarize whether
        the plan looks funded, on track, tight, or unrealistic under current inputs.
      </p>

      <h2
        id="related-calculators"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related calculators
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
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
          <Link href="/tools/compound-interest-calculator" className="text-primary hover:underline">
            Compound Interest Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/investment-calculator" className="text-primary hover:underline">
            Investment Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/business-budget-calculator" className="text-primary hover:underline">
            Business Budget Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/emergency-fund-calculator" className="text-primary hover:underline">
            Emergency Fund Calculator
          </Link>
        </li>
      </ul>

      <h2
        id="fire-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently asked questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion faqs={[...FIRE_FAQS]} />
      </div>
    </article>
  );
}
