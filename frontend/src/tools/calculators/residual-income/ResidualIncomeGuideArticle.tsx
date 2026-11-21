import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { RI_FAQS } from './content';

export function ResidualIncomeGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Residual Income?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        In corporate finance, residual income is net income remaining after
        deducting a charge for the return shareholders require on invested
        equity. It captures the opportunity cost of equity capital. A firm can
        report positive accounting profit while still posting negative residual
        income if earnings fall short of that required return. This tool focuses
        on the corporate residual-income concept used in performance analysis
 and equity valuation; not personal disposable income.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Residual Income Formula
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Equity Charge = Equity Capital × (Cost of Equity % ÷ 100)</p>
        <p>Residual Income (RI) = Net Income − Equity Charge</p>
        <p>NI (net income · EC) equity capital · r%; cost of equity</p>
      </div>

      <h2
        id="how-to-calculate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Residual Income
      </h2>
      <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Determine equity capital (book equity used for the charge).</li>
        <li>Determine the cost of equity as a percent.</li>
        <li>Calculate the equity charge.</li>
        <li>Determine net income for the period.</li>
        <li>Subtract the equity charge from net income.</li>
        <li>Interpret positive, zero, or negative residual income.</li>
      </ol>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Company Alpha · NI 17,000,000 · EC 500,000,000 · r 12%</p>
        <p>Equity charge = 500,000,000 × 0.12 = 60,000,000</p>
        <p>RI = 17,000,000 − 60,000,000 = −43,000,000</p>
      </div>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Positive example · EC 800,000 · r 10% · NI 140,000</p>
        <p>Equity charge = 80,000 · RI = 60,000</p>
      </div>

      <h2
        id="why-important"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Why Is Residual Income Important?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Residual income highlights whether earnings covered the shareholders’
        required return, supports comparisons over time, and feeds residual-
 income valuation frameworks. It complements (rather than replaces) 
        accounting profit analysis.
      </p>

      <h2
        id="vs-net-income"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Residual Income vs. Net Income
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <strong>Net income</strong> is accounting profit after recognized
        expenses, interest, and taxes. <strong>Residual income</strong> starts
        from that profit and subtracts the equity capital charge. Positive net
        income with a large equity base and material cost of equity can still
        produce negative residual income, as in the Company Alpha example.
      </p>

      <h2
        id="valuation"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Residual Income and Equity Valuation
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>V₀ = B₀ + Σ RI_t / (1+r)^t</p>
        <p>V₀ equity value · B₀ beginning book equity · RI_t residual income</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This calculator computes a single-period residual income amount. It does
        not forecast multi-period RI or produce a complete equity valuation
        without those additional assumptions.
      </p>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations of Residual Income
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Highly sensitive to the chosen cost of equity.</li>
        <li>Depends on accounting net income and book equity measurement.</li>
        <li>Accounting policy differences hinder comparisons.</li>
        <li>One period does not equal long-term value creation.</li>
        <li>Forecast-based valuation models inherit forecast uncertainty.</li>
      </ul>

      <h2
        id="ri-faq"
        className="mt-10 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion items={[...RI_FAQS]} />
      </div>
    </article>
  );
}
