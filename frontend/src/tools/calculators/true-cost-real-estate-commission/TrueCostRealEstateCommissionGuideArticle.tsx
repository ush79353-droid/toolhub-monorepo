import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { TRUE_COST_RE_COMMISSION_FAQS } from './content';

export function TrueCostRealEstateCommissionGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-true-cost-commission"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is the True Cost of Real Estate Commission?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Real estate commissions are usually a percent of the sale price and are often baked into
        what the buyer pays. When the purchase is financed, a share of that commission rides inside
        the mortgage and accrues interest for years. This calculator separates the buyer-only
        apparent fee, the full cash commission, and the real long-term cost including interest on
        the financed share.
      </p>

      <h2
        id="true-cost-commission-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Formulas
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Loan amount = Property price − Down payment</p>
        <p className="mt-2">Apparent commission = Property price × Buyer’s commission %</p>
        <p className="mt-2">
          Commission amount = Property price × (Seller’s % + Buyer’s %)
        </p>
        <p className="mt-2">
          Loan commission = Commission amount × Loan amount ÷ Property price
        </p>
        <p className="mt-2">
          Monthly payment = amortizing payment on loan amount (r = rate/12)
        </p>
        <p className="mt-2">
          Monthly commission = amortizing payment on loan commission
        </p>
        <p className="mt-2">
          Real commission cost = (Commission − loan commission) + monthly commission × n
        </p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>
          Property = 300,000 PKR · Down = 60,000 · Seller 6% · Buyer 0% · 30y · 7.83%/yr
        </p>
        <p>Loan = 240,000 · Commission amount = 18,000 · Loan commission = 14,400</p>
        <p>
          Monthly ≈ 1,732.68 · Monthly commission ≈ 103.96 · Real commission cost ≈ 41,025.81
        </p>
      </div>

      <h2
        id="true-cost-commission-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...TRUE_COST_RE_COMMISSION_FAQS]} />
      </div>
    </article>
  );
}
