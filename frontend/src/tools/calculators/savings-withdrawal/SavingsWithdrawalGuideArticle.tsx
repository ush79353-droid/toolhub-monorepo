import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { SAVINGS_WITHDRAWAL_FAQS } from './content';

export function SavingsWithdrawalGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-savings-withdrawal"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is a Savings Withdrawal Plan?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A savings withdrawal plan estimates how long a balance can support regular withdrawals while
        still earning interest. This calculator answers the verified question “how long will my money
        last?” using your opening balance, first withdrawal date, withdrawal amount, and annual
        interest rate.
      </p>

      <h2
        id="savings-withdrawal-method"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Long Will Money Last?
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Monthly rate r = (Annual rate / 100) / 12</p>
        <p className="mt-2">Each period: balance ← balance × (1 + r), then withdraw</p>
        <p className="mt-2">Final period may withdraw only the remaining balance</p>
        <p className="mt-2">Duration months = number of withdrawals (years + leftover months)</p>
        <p className="mt-2">Last withdrawal date = first withdrawal date + (n − 1) months</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>
          Balance = 100,000 PKR · Withdrawal = 500 PKR / month · Annual rate = 2% · First withdrawal
          = Nov 18, 2026
        </p>
        <p className="mt-1">
          Result ≈ 20 years and 4 months · 244 withdrawals · Total withdrawn ≈ 121,740.97 PKR ·
          Interest earned ≈ 21,740.97 PKR · Last withdrawal ≈ Feb 18, 2047
        </p>
      </div>

      <h2
        id="savings-withdrawal-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...SAVINGS_WITHDRAWAL_FAQS]} />
      </div>
    </article>
  );
}
