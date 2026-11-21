import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { DREAM_COME_TRUE_FAQS } from './content';

export function DreamComeTrueGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2 id="intro-dream" className="text-xl font-bold tracking-tight text-accent sm:text-2xl">
        How long do I have to save to afford my dream?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Everyone has something they want to buy or achieve — a car, trip, device, home down payment,
        or business idea. Short-term goals need a different plan than multi-year ones. This
        calculator estimates how long it takes to reach a price tag using money you already have,
        what you can add each month, and an assumed annual interest rate compounded monthly. It
        helps you test whether a savings plan is realistic before you commit.
      </p>

      <h2 id="step-1" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Step 1: Get in the right mindset
      </h2>
      <h3 className="mt-4 text-base font-semibold text-accent">Set a realistic goal</h3>
      <p className="mt-2 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Name a clear target price and check affordability against other priorities. Unrealistic goals
        drain motivation; a specific, achievable number keeps the plan grounded.
      </p>
      <h3 className="mt-4 text-base font-semibold text-accent">Define the goal</h3>
      <p className="mt-2 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Be concrete — a car, house down payment, vacation, laptop, or business seed fund — so you
        know what “done” looks like.
      </p>
      <h3 className="mt-4 text-base font-semibold text-accent">Think about the future</h3>
      <p className="mt-2 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Consider income changes, other debts, and upcoming expenses before locking in a large monthly
        transfer.
      </p>
      <h3 className="mt-4 text-base font-semibold text-accent">Anticipate problems</h3>
      <p className="mt-2 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Emergencies, lower returns, inflation, and shifting priorities can slow progress. An
        emergency fund separate from the dream pot helps protect the plan.
      </p>

      <h2 id="step-2" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Step 2: Build your saving strategy
      </h2>
      <h3 className="mt-4 text-base font-semibold text-accent">How much will my dream cost?</h3>
      <p className="mt-2 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Include taxes, fees, maintenance, and likely price changes — not only the advertised sticker.
      </p>
      <h3 className="mt-4 text-base font-semibold text-accent">How much do I already have?</h3>
      <p className="mt-2 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Count dedicated cash and investments earmarked for the goal. Enter that total as initial
        savings.
      </p>
      <h3 className="mt-4 text-base font-semibold text-accent">How much can I save every month?</h3>
      <p className="mt-2 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Review essentials, debt payments, and discretionary spending so the contribution is
        sustainable. Try the{' '}
        <Link href="/tools/business-budget-calculator" className="text-primary hover:underline">
          Business Budget Calculator
        </Link>{' '}
        if you need help sizing a realistic monthly amount.
      </p>

      <h2 id="step-3" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Step 3: Put your savings to work
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Cash can sit in a savings account, certificates of deposit, bonds, mutual funds, or other
        investments. Higher expected returns usually mean more risk and volatility. Compare rates,
        diversify when investing, and remember:
      </p>
      <p className="mt-3 rounded-lg border border-border bg-muted/20 px-3 py-2 text-sm text-accent">
        Investment returns are not guaranteed. The interest rate entered into this calculator is an
        assumption, not a promise of future performance.
      </p>

      <h2 id="step-4" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Step 4: Find out how long you need to save
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        With end-of-month deposits and a constant monthly rate \(r\) (annual rate ÷ 12), the months
        \(T\) needed satisfy:
      </p>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>T = log((P·r + M) / (I·r + M)) / log(1 + r)</p>
        <p className="mt-2">If r = 0: T = (P − I) / M</p>
      </div>
      <p className="text-sm leading-relaxed text-foreground/90 sm:text-base">
        Here P is the dream price, I initial savings, and M the monthly contribution. The calculator
        rounds T up to the next whole month so the balance actually reaches the goal.
      </p>

      <h2 id="example-car" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Example: Saving for a new car
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Dream price $30,000 · Initial $5,000 · Monthly $500 · 4% annual. Monthly rate = 0.04/12.
        Solving the formula and rounding up gives <strong className="font-medium">45 months</strong>{' '}
        (3 years, 9 months). Load example in the calculator uses these inputs. At goal you will have
        deposited $22,500 in contributions plus interest on top of the $5,000 start — enough to clear
        the $30,000 target.
      </p>

      <h2 id="after-goal" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        I saved for my dream! What now?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Celebrate the win, then compare the pile of cash with today’s real purchase cost, leave room
        for extras, avoid impulse upgrades, rebuild an emergency cushion, and set the next goal.
        Consistent habits matter more than any single purchase.
      </p>

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
          <Link
            href="/tools/compound-interest-calculator"
            className="text-primary hover:underline"
          >
            Compound Interest Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/investment-calculator" className="text-primary hover:underline">
            Investment Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/interest-calculator" className="text-primary hover:underline">
            Interest Calculator
          </Link>
        </li>
      </ul>

      <h2
        id="dream-come-true-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently asked questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...DREAM_COME_TRUE_FAQS]} />
      </div>
    </article>
  );
}
