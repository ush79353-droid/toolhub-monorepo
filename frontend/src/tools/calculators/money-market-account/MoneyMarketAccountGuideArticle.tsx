import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { MONEY_MARKET_FAQS } from './content';

export function MoneyMarketAccountGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-money-market-account"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is a Money Market Account?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A money market account is a deposit account that typically pays a variable interest rate.
        This calculator estimates ending balance from a starting amount, optional recurring
        deposits, an assumed annual return, and the investment length. It is a planning estimate,
        not a bank quote.
      </p>

      <h2
        id="money-market-formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Formulas
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>i = r / periods per year &nbsp;&nbsp; N = period count</p>
        <p>One-time: FV = P × (1 + i)^N</p>
        <p>SIP (end of period): FV = P × (1 + i)^N + C × [((1 + i)^N − 1) / i]</p>
        <p>Zero rate: FV = P + C × N</p>
        <p>Total deposit = P + C × N</p>
        <p>Total interest = FV − Total deposit</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Starting balance P = PKR 10,000</p>
        <p>Monthly investment C = PKR 1,000</p>
        <p>Annual return r = 6% → i = 0.5% per month</p>
        <p>Period N = 12 months</p>
        <p>Total deposit = 10,000 + 1,000 × 12 = PKR 22,000</p>
        <p>Future value ≈ PKR 22,952.34</p>
        <p>Total interest ≈ PKR 952.34</p>
      </div>

      <h2
        id="money-market-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...MONEY_MARKET_FAQS]} />
      </div>
    </article>
  );
}
