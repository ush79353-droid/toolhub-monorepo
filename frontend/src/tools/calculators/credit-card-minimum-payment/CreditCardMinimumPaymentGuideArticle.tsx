import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { CREDIT_CARD_MINIMUM_PAYMENT_FAQS } from './content';

export function CreditCardMinimumPaymentGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-credit-card-minimum-payment"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What This Calculator Does
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The Credit Card Minimum Payment Calculator projects payoff duration, an
        estimated final repayment date from your due date, total paid, and
        interest when you repay only the minimum (flat percentage or percentage
        plus interest), optionally topped up by a monthly fixed payment. Money
        fields support independent currencies with real FX normalization.
      </p>

      <h2
        id="credit-card-minimum-payment-formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Formulas
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>
          Default interest (Daily 360) = Balance × ((1 + APR/360)^30 − 1)
        </p>
        <p className="mt-2">
          Monthly path: Balance × APR / 12 · Daily 365: Balance × ((1 +
          APR/365)^(365/12) − 1)
        </p>
        <p className="mt-2">
          Flat % minimum = max(Floor, Balance × %)
        </p>
        <p className="mt-2">
          % + interest minimum = max(Floor, Balance × % + Interest)
        </p>
        <p className="mt-2">
          Scheduled payment = Minimum + Monthly fixed (add-on, not replacement)
        </p>
        <p className="mt-2">
          New Balance = Balance + Interest − min(Payment, Balance + Interest)
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
 Educational model; not average-daily-balance statement interest.
        </p>
      </div>

      <h2
        id="credit-card-minimum-payment-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>
          Statement balance = 1,500 PKR · Due = 11/18/2026 · APR = 18% · Min =
          25 PKR · Min % = 3 · Flat percentage · Fixed add-on = 0 · Daily (360)
        </p>
        <p className="mt-1">
          Payoff ≈ 7 years 2 months on 01/18/2034 · Total paid ≈ 2,510.83 PKR ·
          Interest ≈ 1,010.83 PKR
        </p>
      </div>

      <h2
        id="credit-card-minimum-payment-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...CREDIT_CARD_MINIMUM_PAYMENT_FAQS]} />
      </div>
    </article>
  );
}
