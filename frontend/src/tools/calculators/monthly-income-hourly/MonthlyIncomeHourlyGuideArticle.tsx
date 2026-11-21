import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { MONTHLY_INCOME_HOURLY_FAQS } from './content';

export function MonthlyIncomeHourlyGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-monthly-income-hourly-calculator"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is a Monthly Income Hourly Calculator?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This calculator converts monthly income into an equivalent hourly rate
        using your hours per week and a 52-week year (or reverses from hourly to
        monthly). Taxes, overtime, and unpaid leave are not included.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use This Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Confirm hours per week (default 40).</li>
        <li>Enter monthly income — or hourly income — and choose currencies.</li>
        <li>Read the derived counterpart field under Your income.</li>
      </ol>

      <h2
        id="conversion-formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Conversion Formulas
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Annual Hours = Hours Per Week × 52</p>
        <p>Hourly = (Monthly × 12) ÷ Annual Hours</p>
        <p>Monthly = Hourly × Annual Hours ÷ 12</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Monthly = 100,000 PKR · Hours/week = 40</p>
        <p>Annual hours = 2,080</p>
        <p>Hourly ≈ 576.92 PKR</p>
      </div>

      <h2
        id="monthly-income-hourly-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion faqs={[...MONTHLY_INCOME_HOURLY_FAQS]} />
      </div>
    </article>
  );
}
