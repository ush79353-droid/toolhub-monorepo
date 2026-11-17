import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { NET_DEBT_FAQS } from './content';

export function NetDebtGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-net-debt"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Net Debt?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Net debt measures interest-bearing and related obligations after subtracting cash and cash
        equivalents. This calculator follows the screenshot line items for cash, short-term debt,
        and long-term debt, then reports net debt with real FX conversion across independent
        currencies.
      </p>

      <h2
        id="net-debt-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Net Debt Formulas
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Cash &amp; Cash Equivalents = Cash + Cash Equivalents</p>
        <p className="mt-2">
          Short-term Debt = Accounts Payable + Current LTD + Current Leases + Other ST
        </p>
        <p className="mt-2">
          Long-term Debt = Non-current LTD + Non-current Leases + Other LT
        </p>
        <p className="mt-2">
          Net Debt = Short-term Debt + Long-term Debt − Cash &amp; Cash Equivalents
        </p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Cash 50,000 + equivalents 10,000 → cash total 60,000</p>
        <p>Short-term items sum to 40,000 · Long-term items sum to 100,000</p>
        <p>Net debt = 40,000 + 100,000 − 60,000 = 80,000</p>
      </div>

      <h2
        id="net-debt-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...NET_DEBT_FAQS]} />
      </div>
    </article>
  );
}
