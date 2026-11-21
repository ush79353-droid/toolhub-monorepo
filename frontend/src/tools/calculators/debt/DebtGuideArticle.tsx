import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { DEBT_FAQS } from './content';

export function DebtGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-debt-calculator"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is a Debt Calculator?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A debt calculator compares common repayment strategies for two or more balances. Enter
        each debt’s balance, annual rate, and scheduled payment, plus an optional consolidation
        rate and prepaid fee. The summary reports total debt, combined monthly payment, and a
        side-by-side table of APR, interest, and payoff time.
      </p>

      <h2
        id="debt-repayment-methods"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Debt Repayment Methods
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
 <strong>Minimum payment</strong>: pay each debt’s scheduled installment only.
        </li>
        <li>
 <strong>Snowball</strong>: keep the combined budget fixed and roll freed payments into
          the smallest remaining balance.
        </li>
        <li>
 <strong>Avalanche</strong>: keep the combined budget fixed and roll freed payments into
          the highest-rate balance.
        </li>
        <li>
 <strong>Consolidation</strong>: replace the debts with one loan at the consolidation
          rate, same combined payment, with the prepaid fee reflected in APR only once.
        </li>
      </ul>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Debt #1 = PKR 4,500 @ 6.2% with payment 120</p>
        <p>Debt #2 = PKR 12,000 @ 18.2% with payment 220</p>
        <p>Consolidation rate = 9.5%, prepaid fee = 200</p>
        <p>Total debt = 16,500 · Monthly payment = 340</p>
        <p>Min. payment ≈ 14.93%* · interest ≈ 14,178.03 · 117 months</p>
        <p>Snowball / Avalanche ≈ 16.35% · interest ≈ 10,695.50 · 80 months</p>
        <p>Consolidation ≈ 10.01% · interest ≈ 4,403.04 · 62 months</p>
      </div>

      <h2
        id="debt-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...DEBT_FAQS]} />
      </div>
    </article>
  );
}
