import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { RENT_OR_BUY_FAQS } from './content';

export function RentOrBuyGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-rent-or-buy"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Rent vs Buy?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Compare the net cost of renting versus buying over a staying period. Renting keeps your
        cash in a deposit account while you pay rent; buying uses that cash as a down payment,
        finances the rest with a fixed-rate mortgage, pays ownership fees, and credits sale
        proceeds (after appreciation and commissions) at the end.
      </p>

      <h2
        id="rent-or-buy-formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Costs Are Compared
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Total rent = rent payments + agent + other − deposit interest</p>
        <p>
          Total buy = down payment + buying commission + mortgage payments + other fees + selling
          commission + mortgage left − future property value
        </p>
        <p>Periodic rent/buy cost = total cost ÷ staying months (then shown /wk|/mo|/yr)</p>
      </div>
      <p className="text-sm leading-relaxed text-foreground/90 sm:text-base">
        Mortgage payments use standard fixed-rate amortization. Other fees are an annual
        percentage of the purchase price over the staying years. Utilities are omitted on both
        sides. No extra tax, maintenance, or investment-return assumptions beyond the screenshot
        fields.
      </p>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Stay 5 years · cash 50,000 · rent 2,000/mo · deposit 2%</p>
        <p>Property 300,000 · mortgage 5% / 30y · buy 4% · sell 7% · fees 2.3% · appreciation 2%</p>
        <p>Compare total rent cost vs total buy cost (and monthly equivalents) over 60 months.</p>
      </div>

      <h2
        id="rent-or-buy-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...RENT_OR_BUY_FAQS]} />
      </div>
    </article>
  );
}
