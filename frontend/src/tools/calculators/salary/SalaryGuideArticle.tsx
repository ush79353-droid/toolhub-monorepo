import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { SALARY_FAQS } from './content';

export function SalaryGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-salary-calculator"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is a Salary Calculator?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A salary calculator turns an hourly rate into equivalent daily, weekly,
        monthly, and annual pay using your hours per day and days per week. Enter
        the rate you know; the other periods follow from a 52-week year.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use This Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Confirm “I get paid” is Per hour (the verified mode).</li>
        <li>Enter pay per hour and choose its currency.</li>
        <li>Set hours per day (default 8) and days per week (default 5).</li>
        <li>
          Optionally note holidays and paid vacation days — they are not deducted
          from annual paid salary.
        </li>
        <li>
          Read hourly, daily, weekly, monthly, and annual equivalents; change a
          result currency to re-express that amount.
        </li>
      </ol>

      <h2
        id="salary-conversion-formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Salary Conversion Formulas
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Weekly Hours = Hours/Day × Days/Week</p>
        <p>Weekly Pay = Hourly × Weekly Hours</p>
        <p>Annual Scheduled Days = Days/Week × 52</p>
        <p>Annual = Hourly × Hours/Day × Annual Scheduled Days</p>
        <p>Monthly = Annual ÷ 12</p>
        <p>Daily = Hourly × Hours/Day</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Amounts keep full precision and round only for display. The year uses a
        clear 52-week convention for scheduled working days.
      </p>

      <h2
        id="leave-and-holidays"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Holidays and Paid Vacation
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Holidays and paid vacation are generally compensated for salaried or
        paid-leave arrangements. This tool does not subtract them from annual paid
        salary. Taxes, overtime, and unpaid leave are not included.
      </p>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Hourly = 500 PKR · Hours/day = 8 · Days/week = 5</p>
        <p>Weekly hours = 8 × 5 = 40</p>
        <p>Weekly = 500 × 40 = 20,000 PKR</p>
        <p>Annual scheduled days = 5 × 52 = 260</p>
        <p>Annual = 500 × 8 × 260 = 1,040,000 PKR</p>
        <p>Monthly = 1,040,000 ÷ 12 ≈ 86,666.67 PKR</p>
        <p>Daily = 500 × 8 = 4,000 PKR</p>
      </div>

      <h2
        id="salary-calculator-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...SALARY_FAQS]} />
      </div>
    </article>
  );
}
