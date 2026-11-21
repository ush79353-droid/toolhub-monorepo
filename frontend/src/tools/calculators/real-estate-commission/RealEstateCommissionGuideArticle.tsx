import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { REAL_ESTATE_COMMISSION_FAQS } from './content';

export function RealEstateCommissionGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-real-estate-commission"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Real Estate Commission?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Real estate commission is the fee paid to a brokerage or agent for facilitating a
        property sale. It is usually expressed as a percent of the sale (house) price. This
        calculator estimates that fee and the amount the owner keeps after deducting commission
 only; not taxes, closing costs, or other fees.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use This Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter the house (sale) price and choose its currency.</li>
        <li>Enter the commission rate as a percent (0–100). Zero commission is allowed.</li>
        <li>
          Read the commission amount and owner receives fields. Change their currencies to
          re-express the same results without changing the percent.
        </li>
      </ol>

      <h2
        id="real-estate-commission-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Commission Formulas
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Commission Amount = House Price × Commission Rate / 100</p>
        <p>Owner Receives = House Price − Commission Amount</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Calculations keep full precision and round only for display. Invalid or non-finite
        inputs produce no result.
      </p>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>House price = 10,000,000 PKR</p>
        <p>Commission rate = 2%</p>
        <p>Commission amount = 10,000,000 × 2 / 100 = 200,000 PKR</p>
        <p>Owner receives = 10,000,000 − 200,000 = 9,800,000 PKR</p>
      </div>

      <h2
        id="real-estate-commission-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...REAL_ESTATE_COMMISSION_FAQS]} />
      </div>
    </article>
  );
}
