import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { WEEK_OVER_WEEK_FAQS } from './content';

export function WeekOverWeekGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-week-over-week"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Week-over-Week Growth?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Week-over-week growth compares a metric in one week with the same metric in the following
        week. Teams use it for traffic, revenue, active users, and other weekly KPIs.
      </p>

      <h2
        id="week-over-week-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Week-over-Week Formula
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>WoW % = ((Following − Initial) ÷ Initial) × 100</p>
        <p>Initial ≠ 0</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 space-y-1 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Initial week = 1,000; Following week = 1,200</p>
        <p>WoW % = ((1,200 − 1,000) ÷ 1,000) × 100 = +20%</p>
        <p>If following = 800 → −20%. If following = 500 and initial = 500 → 0%.</p>
      </div>

      <h2
        id="week-over-week-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...WEEK_OVER_WEEK_FAQS]} />
      </div>
    </article>
  );
}
