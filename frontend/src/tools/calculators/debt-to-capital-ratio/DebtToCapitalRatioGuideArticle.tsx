import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { DEBT_TO_CAPITAL_RATIO_FAQS } from './content';

export function DebtToCapitalRatioGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-debt-to-capital-ratio"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Debt-to-Capital Ratio?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The debt-to-capital ratio compares interest-bearing debt with total capital (debt plus
        shareholder’s equity). Analysts use it as a quick leverage check of how much of the
        capital structure is financed with debt. It is a simple ratio, not a complete credit
        model, and does not replace reading the financial statements.
      </p>

      <h2
        id="debt-to-capital-ratio-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Debt-to-Capital Ratio Formula
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>
          Debt to Capital Ratio = Interest Bearing Debt ÷ (Interest Bearing Debt +
          Shareholder’s Equity)
        </p>
        <p className="mt-2">Debt + Equity ≠ 0</p>
        <p className="mt-2">
          When currencies differ, convert equity into the debt currency, then divide.
        </p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Interest bearing debt = 400,000 · Shareholder’s equity = 600,000</p>
        <p>Total capital = 1,000,000</p>
        <p>Debt to capital ratio = 400,000 ÷ 1,000,000 = 0.40</p>
      </div>

      <h2
        id="debt-to-capital-ratio-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...DEBT_TO_CAPITAL_RATIO_FAQS]} />
      </div>
    </article>
  );
}
