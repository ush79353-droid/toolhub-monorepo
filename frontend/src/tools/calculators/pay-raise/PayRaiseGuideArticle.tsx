import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { PAY_RAISE_FAQS } from './content';

export function PayRaiseGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-pay-raise-calculator"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is a Pay Raise Calculator?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A pay raise calculator shows how a percentage or cash raise changes your
        hourly, weekly, monthly, and annual pay. Enter hours per week and current
        pay in any period, choose a raise, and read the synchronized after-raise
        amounts. Taxes, overtime, benefits, and multi-year compounding are not
        included.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use This Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Confirm hours per week (default 40; maximum 168).</li>
        <li>
          Enter any one before-raise amount (hourly, weekly, monthly, or annual)
          and its currency.
        </li>
        <li>
 Enter either a raise percentage or one monetary raise amount; not both
          as separate stacked raises.
        </li>
        <li>
          Read pay after raise. Change a field&apos;s currency to re-express that
          amount; hours and % never convert.
        </li>
      </ol>

      <h2
        id="pay-period-formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Pay Period Formulas
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Annual = Hourly × Hours Per Week × 52</p>
        <p>Weekly = Annual ÷ 52</p>
        <p>Monthly = Annual ÷ 12</p>
        <p>Hourly = Annual ÷ (Hours Per Week × 52)</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The same normalization applies to monetary raise amounts. Amounts keep
        full precision and round only for display.
      </p>

      <h2
        id="raise-formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Raise Formulas
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Annual Raise = Before Annual × (Percentage ÷ 100)</p>
        <p>Percentage = (Annual Raise ÷ Before Annual) × 100</p>
        <p>After Annual = Before Annual + Annual Raise</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        When before-raise annual pay is zero and the monetary raise is positive,
        the percentage increase is undefined. Raises must be zero or greater;
        this tool does not model pay cuts.
      </p>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Hourly pay 1,000 · 40 hours/week · 10% raise → weekly before 40,000 ·
        annual before 2,080,000 · annual raise 208,000 · annual after 2,288,000 ·
        hourly after 1,100 (same currency throughout).
      </p>

      <h2
        id="pay-raise-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion faqs={[...PAY_RAISE_FAQS]} />
      </div>
    </article>
  );
}
