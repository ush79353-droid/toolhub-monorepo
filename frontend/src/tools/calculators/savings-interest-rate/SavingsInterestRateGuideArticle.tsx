import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { SAVINGS_INTEREST_RATE_FAQS } from './content';

export function SavingsInterestRateGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-savings-interest-rate"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What This Calculator Does
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Solve for the annual nominal savings interest rate needed to reach a target balance from your
        starting savings, planned deposits, compounding method, and time horizon. Results also show
        total money deposited and a yearly principal / interest / balance chart.
      </p>

      <h2
        id="how-we-calculate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How We Calculate
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        For a candidate annual nominal rate r, the future value uses a closed-form annuity with the
        effective rate per deposit period. Bisection finds the rate whose projected ending balance
        matches your savings goal. At 0% interest the ending balance is starting savings plus all
        deposits.
      </p>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>i = (1 + r / m)^(m / f) − 1</p>
        <p>End: FV = P(1+i)^n + PMT × [((1+i)^n − 1) / i]</p>
        <p>Begin: FV = P(1+i)^n + PMT × [((1+i)^n − 1) / i] × (1+i)</p>
        <p>Zero rate: FV = P + PMT × n</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Savings goal = PKR 100,000</p>
        <p>Initial balance = PKR 0</p>
        <p>Length = 30 years · Compounding = Monthly</p>
        <p>Deposit = PKR 100 monthly at end of period</p>
        <p>Required annual interest rate ≈ 5.976%</p>
        <p>Total deposited = PKR 36,000</p>
      </div>

      <h2
        id="savings-interest-rate-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...SAVINGS_INTEREST_RATE_FAQS]} />
      </div>
    </article>
  );
}
