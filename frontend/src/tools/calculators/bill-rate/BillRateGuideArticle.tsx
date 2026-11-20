import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { BILL_RATE_FAQS } from './content';

export function BillRateGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-bill-rate"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is a Bill Rate?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A bill rate is the hourly amount you charge a client. This calculator starts from an
        employee or contractor annual salary, spreads that cost across annual capacity hours, then
        applies a pricing multiplier. It clearly separates internal salary cost from the
        client-facing bill rate and does not invent taxes, benefits, or utilization models.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use This Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter annual salary and choose its currency.</li>
        <li>
          Confirm capacity in hours per year (default 2,080 = 40 hours/week × 52 weeks) and the
          pricing multiplier (default 4).
        </li>
        <li>Read the bill rate per hour; change its currency to re-express the same charge.</li>
      </ol>

      <h2
        id="bill-rate-formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Bill Rate Formulas
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Base Hourly Cost = Annual Salary / Capacity</p>
        <p>Bill Rate = Base Hourly Cost × Multiplier</p>
        <p>Bill Rate = (Annual Salary × Multiplier) / Capacity</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Calculations keep full precision and round only for display. Capacity must be greater than
        zero. Invalid or non-finite inputs produce no result.
      </p>

      <h2
        id="capacity-and-multiplier"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Capacity and Multiplier
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Capacity is the annual billable-hours assumption under your model — not automatically
        adjusted for vacations or utilization. The multiplier is user-defined overhead and margin
        uplift; change it to match your firm&apos;s pricing policy rather than treating the default
        as a legal or tax rate.
      </p>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Annual salary 1,040,000 · capacity 2,080 · multiplier 4 → base hourly cost 500 · bill rate
        2,000 per hour (same currency as salary before any display FX).
      </p>

      <h2
        id="bill-rate-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion faqs={[...BILL_RATE_FAQS]} />
      </div>
    </article>
  );
}
