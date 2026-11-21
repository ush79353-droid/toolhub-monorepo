import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { CREDIT_CARD_INTEREST_FAQS } from './content';

export function CreditCardInterestGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-credit-card-interest"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What This Calculator Does
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The Credit Card Interest Calculator projects payoff time, total paid, and
        interest for a revolving balance. Choose fixed monthly payments or
        issuer-style minimum payments (percentage with a floor, optionally plus
        interest), add an optional extra payment, and compare monthly versus
        daily compounding assumptions. Balance and payment fields support
        independent currencies.
      </p>

      <h2
        id="credit-card-interest-formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Formulas
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Monthly interest (default) = Balance × APR / 1200</p>
        <p className="mt-2">
          Daily path: compound Balance × (1 + APR/d)^days − Balance within the
          month (d = 365 or 360; days ≈ 365/12 or 30)
        </p>
        <p className="mt-2">Fixed payment = Fixed monthly + Additional</p>
        <p className="mt-2">
          Minimum = max(Floor, Balance × % [/100] [+ Interest]) + Additional
        </p>
        <p className="mt-2">
          New Balance = Balance + Interest − min(Payment, Balance + Interest)
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
 Educational model; not average-daily-balance statement interest.
        </p>
      </div>

      <h2
        id="credit-card-interest-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>
          Balance = 2,000 PKR · APR = 18% · Fixed = 100 PKR/month · Additional =
          0 · Monthly compounding
        </p>
        <p className="mt-1">
          Payoff ≈ 2 years 0 months · Total paid ≈ 2,395.65 PKR · Interest ≈
          395.65 PKR
        </p>
      </div>

      <h2
        id="credit-card-interest-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...CREDIT_CARD_INTEREST_FAQS]} />
      </div>
    </article>
  );
}
