import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { TURNOVER_RATE_FAQS } from './content';

export function TurnoverRateGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-turnover-rate"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Turnover Rate?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Employee turnover rate measures how many people left your organization during a period,
        relative to the average size of the workforce. HR and finance teams use it to track
        retention, staffing cost, and hiring demand.
      </p>

      <h2
        id="turnover-rate-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Turnover Rate Formula
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Average Employees = (Starting Employees + Ending Employees) / 2</p>
        <p className="mt-2">
          Turnover Rate (%) = (Employees Who Left / Average Employees) × 100
        </p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Starting employees = 100</p>
        <p>Ending employees = 90</p>
        <p>Employees who left = 10</p>
        <p>Average employees = (100 + 90) / 2 = 95</p>
        <p>Turnover rate = (10 / 95) × 100 = 10.53%</p>
      </div>

      <h2
        id="turnover-rate-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...TURNOVER_RATE_FAQS]} />
      </div>
    </article>
  );
}
