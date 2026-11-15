import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { MONEY_FACTOR_FAQS } from './content';

export function MoneyFactorGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-money-factor"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is a Money Factor?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The money factor is commonly used in automobile leasing instead of a quoted APR. The
        familiar 2400 conversion turns a money factor into an approximate equivalent annual
        interest rate, and the reverse turns an APR into a money factor.
      </p>

      <h2
        id="money-factor-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Money Factor Formula
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Money Factor = Annual Interest Rate (%) ÷ 2400</p>
        <p>Annual Interest Rate (%) = Money Factor × 2400</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 space-y-1 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Interest rate 6% → money factor = 6 ÷ 2400 = 0.0025</p>
        <p>Money factor 0.003 → interest rate = 0.003 × 2400 = 7.2%</p>
      </div>

      <h2
        id="money-factor-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...MONEY_FACTOR_FAQS]} />
      </div>
    </article>
  );
}
