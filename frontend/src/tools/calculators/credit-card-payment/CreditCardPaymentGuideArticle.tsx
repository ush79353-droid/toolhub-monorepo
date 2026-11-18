import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { CREDIT_CARD_PAYMENT_FAQS } from './content';

export function CreditCardPaymentGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-credit-card-payment"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What This Calculator Does
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The Credit Card Payment Calculator finds the monthly payment needed to
        clear a credit card balance within a chosen payback term. It reports the
        required payment, estimated payoff date, total paid, and interest, using
        the same minimum-payment and compounding conventions as related credit
        card tools. Money fields support independent currencies with real FX
        normalization.
      </p>

      <h2
        id="credit-card-payment-formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Formulas
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>n = Years × 12 + Months</p>
        <p className="mt-2">
          Monthly period rate (Monthly) = APR / 12 · Daily 360 = (1 +
          APR/360)^30 − 1 · Daily 365 = (1 + APR/365)^(365/12) − 1
        </p>
        <p className="mt-2">
          Payment = Balance × r / (1 − (1+r)^(−n)) · when APR = 0%: Balance / n
        </p>
        <p className="mt-2">
          Schedule: Interest → payment (final installment adjusted) → new
          balance
        </p>
        <p className="mt-2">
          Card minimum = max(Floor, Balance × % [+ Interest]); required payment
          ≥ minimum
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          Educational model — not issuer average-daily-balance statement
          interest.
        </p>
      </div>

      <h2
        id="credit-card-payment-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>
          Balance = 1,000 PKR · Due = 11/18/2026 · APR = 18% · Payback = 1 yr 0
          mo · Daily (360) · Min 25 / 3% flat
        </p>
        <p className="mt-1">
          Monthly payment ≈ 91.74 PKR · 1 year 0 months on Oct 20, 2027 · Total
          ≈ 1,100.91 PKR · Interest ≈ 100.91 PKR
        </p>
      </div>

      <h2
        id="credit-card-payment-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...CREDIT_CARD_PAYMENT_FAQS]} />
      </div>
    </article>
  );
}
