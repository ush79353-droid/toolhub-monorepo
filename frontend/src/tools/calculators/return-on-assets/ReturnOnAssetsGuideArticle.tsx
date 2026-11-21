import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { ROA_FAQS } from './content';

export function ReturnOnAssetsGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Return on Assets (ROA)?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Return on assets measures how efficiently a company converts its asset
        base into net income. Investors and analysts use ROA to gauge asset
        utilization and managerial efficiency, always in industry context. ROA
        is a profitability ratio based on accounting earnings — not a direct
        cash-flow measure.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Return on Assets Formula
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>ROA = (Net Income ÷ Total Assets) × 100</p>
        <p>Average Total Assets = (Beginning Assets + Ending Assets) ÷ 2</p>
        <p>ROA = (Net Income ÷ Average Total Assets) × 100</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Net income is period profit after expenses, interest, and taxes. Total
        assets (or average assets) form the denominator. Average assets can
        better represent resources used when the balance sheet changed during
        the period.
      </p>

      <h2
        id="how-to-calculate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Return on Assets
      </h2>
      <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Find net income from the income statement.</li>
        <li>Find total assets from the balance sheet.</li>
        <li>Decide whether to use period-end or average total assets.</li>
        <li>Divide net income by the selected asset amount.</li>
        <li>Multiply by 100 for a percentage.</li>
        <li>Interpret the result with industry and trend context.</li>
      </ol>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Net income 150,000 · Total assets 1,000,000</p>
        <p>ROA = (150,000 / 1,000,000) × 100 = 15.00%</p>
      </div>

      <h2
        id="good-roa"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is a Good Return on Assets?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        There is no universal “good” ROA. Asset-intensive manufacturers and
        utilities often post different typical levels than asset-light software
        or service firms. Also weigh company maturity, leverage, margins,
        economic conditions, and multi-period trends. Cross-industry ROA
        comparisons can mislead.
      </p>

      <h2
        id="interpret"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Interpret ROA
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Positive ROA — net income relative to assets is positive.</li>
        <li>Zero ROA — no net profit relative to the asset base.</li>
        <li>Negative ROA — a net loss relative to assets.</li>
        <li>
          Unusually high ROA — verify industry norms and accounting drivers
          (margins, asset base, one-time items).
        </li>
      </ul>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        ROA can change with profitability, asset purchases or disposals,
        depreciation, acquisitions, write-downs, and other balance-sheet moves.
      </p>

      <h2
        id="roa-vs-roe"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Return on Assets vs. Return on Equity
      </h2>
      <div className="my-4 overflow-x-auto">
        <table className="w-full min-w-[22rem] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="py-2 pr-3 font-semibold text-accent">Metric</th>
              <th className="py-2 pr-3 font-semibold text-accent">ROA</th>
              <th className="py-2 font-semibold text-accent">ROE</th>
            </tr>
          </thead>
          <tbody className="text-foreground/90">
            <tr className="border-b border-border">
              <td className="py-2 pr-3">Measures</td>
              <td className="py-2 pr-3">Profit relative to assets</td>
              <td className="py-2">Profit relative to equity</td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-2 pr-3">Formula</td>
              <td className="py-2 pr-3">NI / Assets</td>
              <td className="py-2">NI / Equity</td>
            </tr>
            <tr>
              <td className="py-2 pr-3">Leverage</td>
              <td className="py-2 pr-3">Indirect effect</td>
              <td className="py-2">Often strong effect</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Analyze ROA and ROE together: leverage can raise ROE even when asset
        profitability is unchanged.
      </p>

      <h2
        id="roa-vs-turnover"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        ROA vs. Asset Turnover
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>ROA ≈ Net Profit Margin × Asset Turnover</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This DuPont-style identity links profitability and asset use. Keep
        denominators and periods consistent when combining ratios. See the{' '}
        <Link
          href="/tools/dupont-analysis-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          DuPont Analysis Calculator
        </Link>{' '}
        and{' '}
        <Link
          href="/tools/total-asset-turnover-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Total Asset Turnover Calculator
        </Link>
        .
      </p>

      <h2
        id="advantages"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Advantages and Limitations of ROA
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Advantages include a simple view of asset profitability and a way to
        track efficiency over time. Limitations include accounting-method
        differences, historical-cost asset values, industry variation,
        nonrecurring income, write-downs, negative earnings, asset-mix changes,
        and ending-versus-average asset choices.
      </p>

      <h2
        id="example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Practical Example
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Company A: NI 150,000 · Assets 1,000,000 → ROA 15%</p>
        <p>Company B: NI 200,000 · Assets 2,000,000 → ROA 10%</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Company A earned more net income per unit of assets; Company B earned
        more absolute net income. ROA alone does not decide which firm is the
        better investment.
      </p>

      <h2
        id="roa-faq"
        className="mt-10 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion items={[...ROA_FAQS]} />
      </div>
    </article>
  );
}
