import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { DEBT_TO_EQUITY_FAQS } from './content';

export function DebtToEquityGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-debt-to-equity"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is the Debt to Equity Ratio?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The debt to equity (D/E) ratio compares total liabilities with stockholders&apos; equity.
        Analysts use it as a quick leverage check: how much the firm owes relative to residual
        ownership claims. This tool follows the total-liabilities definition of D and does not
        silently substitute interest-bearing debt only.
      </p>

      <h2
        id="debt-to-equity-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Debt to Equity Formula
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Debt to Equity Ratio = Total Liabilities ÷ Stockholders&apos; Equity</p>
        <p className="mt-2">Stockholders&apos; Equity ≠ 0</p>
        <p className="mt-2">
          When currencies differ, convert equity into the liabilities currency, then divide.
        </p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Total liabilities = 150,000 · Stockholders&apos; equity = 100,000</p>
        <p>Debt to equity ratio = 150,000 ÷ 100,000 = 1.50</p>
        <p>
          Zero equity is rejected. Negative equity can produce a negative ratio when liabilities
          are positive.
        </p>
      </div>

      <h2
        id="debt-to-equity-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...DEBT_TO_EQUITY_FAQS]} />
      </div>
    </article>
  );
}
