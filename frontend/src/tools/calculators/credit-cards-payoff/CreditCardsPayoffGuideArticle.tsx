import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { CREDIT_CARDS_PAYOFF_FAQS } from './content';

export function CreditCardsPayoffGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-credit-cards-payoff"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is This Calculator?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Create a cost-efficient payback schedule for multiple credit cards using the Debt
        Avalanche method. Enter one monthly budget plus each card&apos;s name, balance,
        minimum payment, and APR. Blank rows are ignored. Money amounts are shown in USD.
      </p>

      <h2
        id="avalanche-method"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Debt Avalanche Method
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Monthly interest = balance × (APR / 100 / 12)</p>
        <p>Pay the minimum on every active card (capped at remaining balance)</p>
        <p>Apply leftover budget to the highest-APR card</p>
        <p>When a card reaches zero, roll its payment capacity to the next-highest APR</p>
        <p>Never exceed the monthly budget; cap the final payment at balance + interest</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Budget $500 · Card 1 $4,600 @ 18.99% / min $100</p>
        <p>Card 2 $3,900 @ 19.99% / min $90 · Card 3 $6,000 @ 15.99% / min $120</p>
        <p>
          Avalanche order starts with Card 2 (highest APR), then Card 1, then Card 3. Surplus
          after minimums goes to the current focus card each month.
        </p>
      </div>

      <h2
        id="credit-cards-payoff-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...CREDIT_CARDS_PAYOFF_FAQS]} />
      </div>
    </article>
  );
}
