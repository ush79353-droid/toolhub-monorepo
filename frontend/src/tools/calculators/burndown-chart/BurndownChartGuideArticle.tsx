import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { BURNDOWN_CHART_FAQS } from './content';

export function BurndownChartGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-a-burndown-chart"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is a Burndown Chart?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A burndown chart is a simple sprint tracking view: remaining story points on the vertical
        axis and working days on the horizontal axis. Teams use it to see whether completed work is
        keeping pace with a straight-line plan from the sprint backlog to zero.
      </p>

      <h2
        id="how-the-calculator-works"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How the Calculator Works
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Enter the sprint length in working days and the total story points in the backlog. Then log
        story points burned each day. The calculator sums those daily values, computes remaining
        work, and draws ideal and actual remaining lines. Day 0 is the starting backlog before any
        burn.
      </p>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Total burned = sum of daily story points burned</p>
        <p>Remaining = total story points − total burned</p>
        <p>Ideal on day N = total × (1 − N / duration)</p>
        <p>Actual on day N = total − cumulative burn through day N</p>
      </div>

      <h2
        id="ideal-vs-actual"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Ideal vs Actual Burndown
      </h2>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <strong>Ideal</strong> assumes even progress across every working day and always runs from
          Day 0 to the last day.
        </li>
        <li>
          <strong>Actual</strong> follows the burns you enter and stops at the last day you have
          logged, so future days are not treated as finished.
        </li>
      </ul>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A 10-day sprint starts with 100 story points. After three days the team burns 10, 10, and 10
        points:
      </p>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>1. Total burned = 10 + 10 + 10 = 30</p>
        <p>2. Remaining = 100 − 30 = 70</p>
        <p>3. Ideal on Day 3 = 100 × (1 − 3/10) = 70</p>
        <p>4. Actual on Day 3 = 70 (future days are not plotted yet)</p>
      </div>

      <h2 id="burndown-chart-faq" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...BURNDOWN_CHART_FAQS]} />
      </div>
    </article>
  );
}
