import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { REVENUE_FAQS } from './content';

export function RevenueGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-revenue-calculator"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is This Calculator?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The Revenue Calculator solves the relationship between unit price, quantity sold, and total
        revenue. Enter any two values and leave the third blank to solve for price, quantity, or
        total revenue.
      </p>

      <h2
        id="revenue-formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Formulas
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Total Revenue = Price × Quantity</p>
        <p>Price = Total Revenue ÷ Quantity</p>
        <p>Quantity = Total Revenue ÷ Price</p>
      </div>
      <p className="text-sm leading-relaxed text-foreground/90 sm:text-base">
        Money fields are normalized into the price currency before multiplication or division.
        Quantity is a count and is never FX-converted.
      </p>

      <h2
        id="revenue-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Price 100 PKR × Quantity 25 → Total revenue 2,500 PKR</p>
        <p>Solving for quantity with total 2,500 and price 100 returns 25</p>
      </div>

      <h2
        id="revenue-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...REVENUE_FAQS]} />
      </div>
    </article>
  );
}
