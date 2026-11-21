import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { NJ_SALES_TAX_FAQS } from './content';

export function NewJerseySalesTaxGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-nj-sales-tax"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is New Jersey Sales Tax?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        New Jersey charges a single statewide sales and use tax on taxable retail sales. Per the New
        Jersey Division of Taxation rates page, the current general rate is{' '}
        <strong className="font-semibold text-accent">6.625%</strong> (in effect since January 1,
        2018). Official New Jersey ZIP codes fall in the range{' '}
        <strong className="font-semibold text-accent">07001–08989</strong>.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use This Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter the purchase amount in USD.</li>
        <li>Enter a five-digit New Jersey ZIP code.</li>
        <li>
          Review the applicable statewide rate, sales tax amount, and total including tax. Share,
          reload, or clear as needed.
        </li>
      </ol>

      <h2
        id="nj-sales-tax-formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Formulas
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Sales Tax = Purchase Amount × Applicable Rate / 100</p>
        <p>Total Amount = Purchase Amount + Sales Tax</p>
        <p>Applicable Rate = 6.625 (standard taxable purchase)</p>
      </div>

      <h2
        id="zip-and-uez"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        ZIP Codes and UEZ Limits
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A valid New Jersey ZIP confirms the location is in-state. It does not prove Urban Enterprise
        Zone (UEZ) seller certification or that a transaction qualifies for a reduced rate. This
        calculator therefore applies only the clearly labeled standard taxable-purchase rate and
        does not invent local surtaxes, special district rates, or product exemptions from the two
        screenshot fields.
      </p>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Purchase amount $100.00 · ZIP 07102</p>
        <p>Sales tax = 100 × 6.625 / 100 = $6.63 (rounded to cents)</p>
        <p>Total = 100 + 6.63 = $106.63</p>
      </div>

      <h2
        id="nj-sales-tax-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...NJ_SALES_TAX_FAQS]} />
      </div>
    </article>
  );
}
