import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { MARGIN_CALL_FAQS } from './content';

export function MarginCallGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-margin-call-calculator"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is a Margin Call Calculator?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A margin call calculator estimates futures point value, position profit or loss, required
        margins, account equity, and whether equity has fallen below the maintenance-margin
        threshold. Tick value and margin requirements are user inputs — the tool does not invent
        live market prices or exchange margin schedules.
      </p>

      <h2
        id="margin-call-formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Formulas
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Point Value = Tick Value × Ticks Per Point</p>
        <p>Points = Selling Price − Buying Price</p>
        <p>Long P/L = Points × Point Value × Contracts</p>
        <p>Short P/L = − Long P/L</p>
        <p>Total Initial Margin = Initial Margin Per Contract × Contracts</p>
        <p>Total Maintenance Margin = Maintenance Margin Per Contract × Contracts</p>
        <p>Account Equity = Initial Deposit + Active P/L</p>
        <p>Margin Call when Equity &lt; Total Maintenance Margin</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>E-Mini S&P 500 · tick value 3,459.70 · 4 ticks/point → point value 13,838.80</p>
        <p>
          Long · buy 5,000 / sell 5,010 · 2 contracts → points 10 · P/L = 10 × 13,838.80 × 2 =
          276,776.00
        </p>
        <p>
          Deposit 500,000 · initial margin 50,000 · maintenance 40,000 per contract → total
          maintenance 80,000 · equity 776,776 → no margin call
        </p>
      </div>

      <h2 id="margin-call-faq" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...MARGIN_CALL_FAQS]} />
      </div>
    </article>
  );
}
