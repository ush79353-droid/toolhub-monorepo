import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { SAVINGS_GOAL_FAQS } from './content';

export function SavingsGoalGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-savings-goal"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What This Calculator Does
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The Savings Goal Calculator solves for the recurring deposit you need to
        reach a target balance by a chosen age or after a set number of years. It
        compounds starting savings, supports beginning or end-of-period deposits,
        optional deposit growth, and an inflation-adjusted nominal target. Goal and
        starting savings can use independent currencies.
      </p>

      <h2
        id="savings-goal-formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Formulas
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Years = Target Age − Current Age (or Years Until Goal)</p>
        <p className="mt-2">
          Nominal Target = Goal × (1 + Inflation)^Years
        </p>
        <p className="mt-2">
          i = (1 + r/m)^(m/k) − 1
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          r = annual nominal rate · m = compounding periods/year · k =
          contributions/year
        </p>
        <p className="mt-2">
          Starting FV = Starting × (1 + i)^n
        </p>
        <p className="mt-2">
          Gap = Nominal Target − Starting FV
        </p>
        <p className="mt-2">
          Growing annuity factor (end): ((1+i)^n − (1+g)^n) / (i − g)
        </p>
        <p className="mt-2">
          Beginning of period: factor × (1 + i)
        </p>
        <p className="mt-2">
          Required PMT = Gap / factor
        </p>
        <p className="mt-2">
          Total Return = Final Balance − Starting − Total Contributions
        </p>
      </div>

      <h2
        id="savings-goal-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>
          Goal = 1,000,000 PKR · Ages 32 → 65 (33 years) · Starting = 0 · Rate =
          4% monthly · Monthly deposits at end · No inflation or growth
        </p>
        <p className="mt-1">
          Required monthly contribution ≈ 1,218.67 PKR · Total contributions ≈
          482,594.94 PKR · Total return ≈ 517,405.06 PKR
        </p>
      </div>

      <h2
        id="savings-goal-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...SAVINGS_GOAL_FAQS]} />
      </div>
    </article>
  );
}
