import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { CASH_FLOW_TO_DEBT_RATIO_FAQS } from './content';

export function CashFlowToDebtRatioGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-cash-flow-to-debt-ratio"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Cash Flow to Debt Ratio?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Cash flow to debt compares annual operating cash flow with a total debt balance. Higher
        percentages mean more cash flow coverage of debt. The reciprocal debt-to-cash-flow multiple
        shows how many years of current OCF would be needed to cover the debt stock (when OCF is
        positive).
      </p>

      <h2
        id="cash-flow-to-debt-ratio-formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Formulas
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Cash Flow to Debt Ratio (%) = Operating Cash Flow / Total Debt × 100</p>
        <p>Debt to Cash Flow Ratio = Total Debt / Operating Cash Flow</p>
        <p>Total Debt (components) = Short-term Debt + Long-term Debt</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Operating cash flow = 50,000 · Total debt = 200,000</p>
        <p>Cash flow to debt = 50,000 / 200,000 × 100 = 25%</p>
        <p>Debt to cash flow = 200,000 / 50,000 = 4x</p>
      </div>

      <h2
        id="cash-flow-to-debt-ratio-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...CASH_FLOW_TO_DEBT_RATIO_FAQS]} />
      </div>
    </article>
  );
}
