import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { REALTOR_COMMISSION_VAT_FAQS } from './content';

export function RealtorCommissionVatGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-realtor-commission-vat"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Realtor Commission with VAT?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This calculator estimates a VAT-exclusive realtor fee on a house price: the
        commission rate applies to the price first, then VAT applies only to that net
        commission. Commission gross is net plus VAT; the owner receives the house price
        minus commission gross.
      </p>

      <h2
        id="realtor-commission-vat-formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Formulas
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Net Commission = House Price × Commission Rate / 100</p>
        <p className="mt-2">VAT Amount = Net Commission × VAT Rate / 100</p>
        <p className="mt-2">Commission Gross = Net Commission + VAT Amount</p>
        <p className="mt-2">Owner Receives = House Price − Commission Gross</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>House price = 250,000 PKR · Commission = 3% · VAT = 20%</p>
        <p>Net commission = 250,000 × 0.03 = 7,500 PKR</p>
        <p>VAT amount = 7,500 × 0.20 = 1,500 PKR</p>
        <p>Commission gross = 7,500 + 1,500 = 9,000 PKR</p>
        <p>Owner receives = 250,000 − 9,000 = 241,000 PKR</p>
      </div>

      <h2
        id="realtor-commission-vat-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...REALTOR_COMMISSION_VAT_FAQS]} />
      </div>
    </article>
  );
}
