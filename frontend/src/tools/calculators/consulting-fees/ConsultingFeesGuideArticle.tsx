import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { CONSULTING_FEES_FAQS } from './content';

export function ConsultingFeesGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-this-calculator-does"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What This Calculator Does
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The Consulting Fees Calculator estimates the daily and hourly rates you need to cover
        operating costs and hit a target income, based on how many days you can realistically bill
        in a year.
      </p>

      <h2 id="billable-days" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Billable Days
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Start from weekdays in the year, then subtract holidays, sick days, and non-client work
        days (marketing, admin, and similar). The remainder is your billable-day capacity.
      </p>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Billable Days = Weekdays − Holidays − Sick Days − Non-client Days</p>
      </div>

      <h2 id="rate-formulas" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Rate Formulas
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Annual Operating Costs = sum of expense fields</p>
        <p>Required Annual Revenue = Target Income + Annual Operating Costs</p>
        <p>Daily Billable Rate = Required Annual Revenue ÷ Billable Days</p>
        <p>Hourly Rate = Daily Billable Rate ÷ Working Hours per Day</p>
      </div>
      <p className="text-sm leading-relaxed text-foreground/90 sm:text-base">
        Average project value is optional context for typical engagement size and does not change
        these rates.
      </p>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>261 weekdays − 10 holidays − 5 sick − 46 non-client = 200 billable days</p>
        <p>Target income 100,000 + operating costs 20,000 = 120,000 required revenue</p>
        <p>Daily rate = 120,000 ÷ 200 = 600</p>
        <p>Hourly rate at 8 hrs/day = 600 ÷ 8 = 75</p>
      </div>

      <h2
        id="consulting-fees-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...CONSULTING_FEES_FAQS]} />
      </div>
    </article>
  );
}
