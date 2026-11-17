import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { INTEREST_PER_DAY_FAQS } from './content';

export function InterestPerDayGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-interest-per-day"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Interest Per Day?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Interest per day is the simple interest earned or charged on a loan balance for one day,
        using a 365-day year. This calculator reports both the money amount of daily interest and
        the equivalent daily interest rate as a percent.
      </p>

      <h2
        id="interest-per-day-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Interest Per Day Formulas
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Daily Interest Rate (%) = Annual Interest Rate (%) / 365</p>
        <p className="mt-2">
          Interest Per Day = Loan Balance × (Annual Interest Rate / 100) / 365
        </p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Loan balance = 100,000 PKR · Annual interest rate = 7.3%</p>
        <p>Daily rate = 7.3 / 365 = 0.02%</p>
        <p>Interest per day = 100,000 × 0.073 / 365 = 20 PKR</p>
      </div>

      <h2
        id="interest-per-day-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...INTEREST_PER_DAY_FAQS]} />
      </div>
    </article>
  );
}
