import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { SAVINGS_PLAN_FAQS } from './content';

export function SavingsPlanGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-a-savings-plan"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is a Savings Plan?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A savings plan is a schedule of recurring deposits toward a balance goal. You choose how
        often you save (daily, weekly, monthly, and similar), how many periods to plan for, and
        whether each deposit stays fixed or grows by a fixed amount each period. This calculator
        tracks principal only — it does not apply interest.
      </p>

      <h2
        id="savings-plan-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Savings Plan Formula
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Total = n × A + G × n × (n − 1) / 2</p>
        <p className="mt-2 text-xs text-muted-foreground">
          n = number of periods · A = starting deposit · G = increase each period · Total =
          final principal balance
        </p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Period k contributes A + (k − 1) × G. Summing those deposits yields the closed form above.
        Chart and table balances use the same running total so the final bar matches the summary.
      </p>

      <h2
        id="fixed-vs-target-modes"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Fixed Deposit vs Target Balance
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <strong className="font-semibold text-accent">Fixed or growing deposit</strong> takes A
        and G and projects the final balance.{" "}
        <strong className="font-semibold text-accent">Given final balance</strong> takes a target T
        and G, then solves A = (T − G × n × (n − 1) / 2) / n. Negative solved deposits mean the
        goal cannot be reached with that growth schedule.
      </p>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Weekly plan · 52 weeks · put aside 100 PKR · increase 0 PKR</p>
        <p>Total = 52 × 100 + 0 × 52 × 51 / 2 = 5,200 PKR</p>
        <p className="mt-2">
          With G = 10 PKR: Total = 52 × 100 + 10 × 52 × 51 / 2 = 5,200 + 13,260 = 18,460 PKR
        </p>
        <p className="mt-2">
          Target mode for 5,200 PKR with G = 0 → required starting deposit A = 100 PKR
        </p>
      </div>

      <h2
        id="savings-plan-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...SAVINGS_PLAN_FAQS]} />
      </div>
    </article>
  );
}
