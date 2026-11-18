import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { CREDIT_CARD_PAYOFF_FAQS } from './content';

export function CreditCardPayoffGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-credit-card-payoff"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What This Calculator Does
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The Credit Card Payoff Calculator estimates how long it takes to pay off
        a credit card when you enter the outstanding balance, APR, and a fixed
        monthly payment. It reports payoff time in years, months, and days plus
        the total amount paid. Money fields support independent currencies with
        real FX normalization.
      </p>

      <h2
        id="credit-card-payoff-formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Formulas
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>monthlyRate = APR / 100 / 12</p>
        <p className="mt-2">
          Each month: interest = balance × monthlyRate · newBalance = balance +
          interest − payment
        </p>
        <p className="mt-2">
          If payment ≤ interest → debt never pays off
        </p>
        <p className="mt-2">
          APR = 0%: months = balance / payment · days from fractional month × 30
        </p>
        <p className="mt-2">
          Final partial month: days ≈ round((finalPayment / monthlyPayment) ×
          30)
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          Educational model — not issuer average-daily-balance statement
          interest.
        </p>
      </div>

      <h2
        id="credit-card-payoff-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>
          Balance = 2,000 PKR · APR = 18% · Monthly payment = 100 PKR
        </p>
        <p className="mt-1">
          Paid off after ≈ 1 year 11 months 29 days · Total paid ≈ 2,395.65 PKR
        </p>
      </div>

      <h2
        id="credit-card-payoff-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...CREDIT_CARD_PAYOFF_FAQS]} />
      </div>
    </article>
  );
}
