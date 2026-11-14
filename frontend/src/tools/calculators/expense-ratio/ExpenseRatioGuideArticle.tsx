import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { EXPENSE_RATIO_FAQS } from './content';

export function ExpenseRatioGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-expense-ratio"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Expense Ratio?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        An expense ratio is the yearly fee a fund charges as a percentage of assets under
        management. Even a small fee compounds over time and reduces ending wealth compared with
        the same investment before fees.
      </p>

      <h2
        id="expense-ratio-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How This Calculator Works
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Gross FV = P(1+r)^n + PMT × [((1+r)^n − 1) / r] (end-of-year contributions)</p>
        <p>Each year (net path): balance × (1+r) → deduct fee = balance × e → add PMT</p>
        <p>Total ETF cost = Σ annual fees; Net FV = ending balance after fees</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 space-y-1 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Initial = 10,000; yearly = 1,000; duration = 10 yrs; return = 8%; expense = 0.5%</p>
        <p>Each year grows at 8%, then pays 0.5% of the post-return balance, then adds 1,000</p>
        <p>Gross FV ignores fees; Total ETF cost sums fees; Net FV is the fee-adjusted balance</p>
      </div>

      <h2
        id="expense-ratio-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...EXPENSE_RATIO_FAQS]} />
      </div>
    </article>
  );
}
