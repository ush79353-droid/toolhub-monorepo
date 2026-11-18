import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { AFTER_TAX_COST_OF_DEBT_FAQS } from './content';

export function AfterTaxCostOfDebtGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-after-tax-cost-of-debt"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is After-Tax Cost of Debt?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The before-tax cost of debt is the market interest rate (or yield to maturity) a company would
        pay to raise new debt. Because interest is often tax-deductible, analysts use the after-tax
        cost of debt: the before-tax rate reduced by the corporate tax shield. This calculator
        estimates that rate from net income, pre-tax income, and the before-tax cost of debt.
      </p>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The income-based “marginal corporate tax rate” here is an effective rate from the income
        statement. It is not necessarily the statutory marginal bracket in a tax schedule.
      </p>

      <h2
        id="after-tax-cost-of-debt-formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Formulas
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Marginal Tax Rate (%) = (1 − Net Income / Pre-tax Income) × 100</p>
        <p className="mt-2">
          After-tax Cost of Debt (%) = Cost of Debt (%) × (1 − Tax Rate (%) / 100)
        </p>
        <p className="mt-2">
          Incomes with different currencies are normalized into the net-income currency before the
          tax-rate ratio. Percentages are never FX-converted.
        </p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Net income = 800,000 · Pre-tax income = 1,000,000 · Cost of debt = 8%</p>
        <p>Tax rate = (1 − 800,000 / 1,000,000) × 100 = 20%</p>
        <p>After-tax cost of debt = 8% × (1 − 0.20) = 6.4%</p>
      </div>

      <h2
        id="after-tax-cost-of-debt-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...AFTER_TAX_COST_OF_DEBT_FAQS]} />
      </div>
    </article>
  );
}
