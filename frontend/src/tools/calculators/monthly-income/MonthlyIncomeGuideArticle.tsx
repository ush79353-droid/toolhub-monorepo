import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { MONTHLY_INCOME_FAQS } from './content';

export function MonthlyIncomeGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-monthly-income"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Monthly Income Conversion?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Monthly income conversion turns hourly, daily, weekly, or yearly earnings
        into an equivalent monthly amount using your working hours and days.
      </p>
      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use This Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter hourly, daily, weekly, or yearly earnings (last edited wins).</li>
        <li>
          Optionally check “Adjust number of hours and days” to change the 8 / 5 /
          52 defaults.
        </li>
        <li>Read monthly income; change its currency to re-express the amount.</li>
      </ol>
      <h2
        id="conversion-formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Conversion Formulas
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>H = hours/day · D = days/week · W = weeks/year</p>
        <p>From hourly: Yearly = Hourly × H × D × W · Monthly = Yearly ÷ 12</p>
        <p>From daily: Yearly = Daily × D × W · Monthly = Yearly ÷ 12</p>
        <p>From weekly: Yearly = Weekly × W · Monthly = Yearly ÷ 12</p>
        <p>From yearly: Monthly = Yearly ÷ 12</p>
      </div>
      <h2
        id="schedule-assumptions"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Schedule Assumptions
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Defaults are 8 hours/day, 5 days/week, and 52 weeks/year. Taxes and
        overtime are not included.
      </p>
      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Hourly = 500 PKR · 8h · 5d · 52w</p>
        <p>Yearly = 500 × 8 × 5 × 52 = 1,040,000</p>
        <p>Monthly = 1,040,000 ÷ 12 ≈ 86,666.67</p>
      </div>
      <h2
        id="monthly-income-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...MONTHLY_INCOME_FAQS]} />
      </div>
    </article>
  );
}
