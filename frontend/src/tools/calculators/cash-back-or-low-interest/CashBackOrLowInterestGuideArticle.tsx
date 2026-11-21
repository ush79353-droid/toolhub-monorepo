import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { CASH_BACK_OR_LOW_INTEREST_FAQS } from './content';

export function CashBackOrLowInterestGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-cash-back-or-low-interest"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is a Cash Back or Low Interest Calculator?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Auto buyers are often asked to choose between a cash rebate financed at a higher APR and
        a promotional low interest rate without the rebate. This calculator builds both loan
        scenarios with the same price, term, down payment, trade-in, sales tax, and fees, then
 compares total economic cost; not monthly payment alone.
      </p>

      <h2
        id="how-the-comparison-works"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How the Comparison Works
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>salesTax = autoPrice × salesTax% / 100</p>
        <p>cashBack loan = autoPrice − down − tradeIn − cashBack [+ tax + fees if financed]</p>
        <p>low-rate loan = autoPrice − down − tradeIn [+ tax + fees if financed]</p>
        <p>r = APR / 1200 · n = months · Payment = P × r / (1 − (1+r)^(-n)); if r = 0, P / n</p>
        <p>totalCost = price + interest + tax + fees − cashBack (cashBack scenario only)</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Sales tax and fee procedures vary by US jurisdiction. Enter the rate that applies to your
        purchase. The state menu lists verified state names only; it does not invent local tax
        rates.
      </p>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>
          $50,000 auto · $1,000 cash back at 5% · 2% low rate · 60 months · $10,000 down · $0
          trade-in · 7% tax · $2,000 fees (upfront)
        </p>
        <p>
          Cash back loan $39,000 → ≈ $735.98 / mo · interest ≈ $5,158.69 · total cost ≈ $59,658.69
        </p>
        <p>
          Low rate loan $40,000 → ≈ $701.11 / mo · interest ≈ $2,066.62 · total cost ≈ $57,566.62
        </p>
        <p>Low interest wins: interest savings ≈ $3,092 exceed the $1,000 rebate.</p>
      </div>

      <h2
        id="cash-back-or-low-interest-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...CASH_BACK_OR_LOW_INTEREST_FAQS]} />
      </div>
    </article>
  );
}
