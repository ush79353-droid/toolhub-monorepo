import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { RPE_FAQS } from './content';

export function RevenuePerEmployeeGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2 id="what-is-rpe" className="text-xl font-bold tracking-tight text-accent sm:text-2xl">
        What Is Revenue Per Employee?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Revenue per employee shows how much revenue the business generates for each person on the
        payroll. It is a quick productivity check, not a full profitability analysis.
      </p>

      <h2 id="rpe-formula" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Formula
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Revenue Per Employee = Total Revenue / Number of Employees</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Revenue = PKR 5,000,000</p>
        <p>Number of employee = 25</p>
        <p>Revenue per employee = 5,000,000 / 25 = PKR 200,000</p>
      </div>

      <h2 id="rpe-faq" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...RPE_FAQS]} />
      </div>
    </article>
  );
}
