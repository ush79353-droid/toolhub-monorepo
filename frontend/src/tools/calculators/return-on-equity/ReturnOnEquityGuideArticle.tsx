import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { ROE_FAQS } from './content';

export function ReturnOnEquityGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Return on Equity?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Return on equity (ROE) measures how much net profit a company earns
        relative to shareholders&apos; equity. Investors use it to track
        accounting profitability of the equity base, compare peers in the same
        industry, and spot multi-year trends. ROE is not an investor&apos;s
        stock-market return; it is a ratio from financial statements. Pair it
 with other ratios (such as ROA, margins, and leverage) before drawing
        conclusions.
      </p>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Shareholders&apos; equity is the residual interest in assets after
        liabilities (Assets − Liabilities). Financial leverage can amplify ROE
        when borrowed capital earns more than its cost, and magnify losses when
        it does not.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Return on Equity Formula
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>ROE = (Net Income ÷ Shareholders&apos; Equity) × 100</p>
        <p>
          Average Equity = (Beginning Equity + Ending Equity) ÷ 2
        </p>
        <p>ROE = (Net Income ÷ Average Shareholders&apos; Equity) × 100</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Net profit (net income) usually comes from the income statement. Equity
        comes from the balance sheet. Use compatible reporting periods. For
        common-equity ROE, use net income available to common shareholders and
        corresponding common equity when preferred claims matter. Average equity
        can better match a period&apos;s income with equity used during that
        period.
      </p>

      <h2
        id="how-to-calculate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Return on Equity
      </h2>
      <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Determine net profit for the period.</li>
        <li>Find shareholders&apos; equity (or beginning and ending equity).</li>
        <li>Divide net profit by the selected equity amount.</li>
        <li>Multiply by 100 for a percentage.</li>
        <li>Interpret with industry, leverage, and trend context.</li>
      </ol>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Net profit 35,000 · Shareholders&apos; equity 450,000</p>
        <p>ROE = (35,000 / 450,000) × 100 ≈ 7.78%</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Find net income on the income statement and equity on the balance sheet
        (or statement of changes in equity). Do not divide by zero equity.
      </p>

      <h2
        id="good-roe"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is a Good Return on Equity?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        There is no universal “good” ROE. Industry averages, company history,
        profitability, debt financing, maturity, accounting policies, one-time
        items, and economic conditions all matter. Higher ROE is not
        automatically better: leverage, buybacks, and a thin equity base can
        inflate the ratio without improving underlying economics.
      </p>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Example: two firms earn the same net profit, but Firm B finances more
        with debt and holds less equity. Firm B can show a higher ROE even if
 asset profitability is similar; leverage, not only operations, drove
        the difference.
      </p>

      <h2
        id="roe-vs-roce"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Return on Equity vs. Return on Capital Employed
      </h2>
      <div className="my-4 overflow-x-auto">
        <table className="w-full min-w-[22rem] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="py-2 pr-3 font-semibold text-accent">Feature</th>
              <th className="py-2 pr-3 font-semibold text-accent">ROE</th>
              <th className="py-2 font-semibold text-accent">ROCE</th>
            </tr>
          </thead>
          <tbody className="text-foreground/90">
            <tr className="border-b border-border">
              <td className="py-2 pr-3">Full name</td>
              <td className="py-2 pr-3">Return on Equity</td>
              <td className="py-2">Return on Capital Employed</td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-2 pr-3">Focus</td>
              <td className="py-2 pr-3">Equity profitability</td>
              <td className="py-2">Capital employed profitability</td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-2 pr-3">Common numerator</td>
              <td className="py-2 pr-3">Net income</td>
              <td className="py-2">EBIT (definitions vary)</td>
            </tr>
            <tr>
              <td className="py-2 pr-3">Common denominator</td>
              <td className="py-2 pr-3">Shareholders&apos; equity</td>
              <td className="py-2">Capital employed</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        ROCE definitions vary with how capital employed is calculated. See the{' '}
        <Link
          href="/tools/return-on-capital-employed-calculator-roce"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Return on Capital Employed Calculator
        </Link>
        .
      </p>

      <h2
        id="roe-vs-roa"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Return on Equity vs. Return on Assets
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>ROE = (Net Income ÷ Equity) × 100</p>
        <p>ROA = (Net Income ÷ Total Assets) × 100</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        ROA uses the full asset base; ROE uses equity only. Leverage can push
        ROE above ROA when debt finances assets that earn more than their
        financing cost. Compare both with the{' '}
        <Link
          href="/tools/return-on-assets-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Return on Assets Calculator
        </Link>
        .
      </p>

      <h2
        id="leverage"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Financial Leverage Affects ROE
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Equity financing and debt financing change the equity multiplier in
        DuPont analysis. Borrowing can raise ROE when returns exceed financing
        costs, and deepen losses when they do not. A small equity base can
        produce an unusually high ROE. Negative equity makes conventional ROE
        interpretation unreliable.
      </p>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Firm A: NI 100,000 · Equity 1,000,000 → ROE 10%</p>
        <p>Firm B: NI 100,000 · Equity 250,000 → ROE 40%</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
 Same net income, different equity bases; Firm B&apos;s higher ROE may
        reflect leverage or a thinner equity cushion, not necessarily stronger
        operations. Related:{' '}
        <Link
          href="/tools/financial-leverage-ratio-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Financial Leverage Ratio
        </Link>{' '}
        and{' '}
        <Link
          href="/tools/debt-to-equity-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Debt-to-Equity
        </Link>
        .
      </p>

      <h2
        id="dupont"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        DuPont Analysis and ROE
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>
          ROE = Net Profit Margin × Asset Turnover × Equity Multiplier
        </p>
        <p>Net Profit Margin = Net Income / Revenue</p>
        <p>Asset Turnover = Revenue / Average Total Assets</p>
        <p>Equity Multiplier = Average Total Assets / Average Equity</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        DuPont separates profitability, asset efficiency, and leverage. Keep
        periods and definitions consistent. Explore the{' '}
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
        id="investors"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Investors Use ROE
      </h2>
      <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Compare ROE across businesses in the same industry.</li>
        <li>Examine changes over several years.</li>
        <li>Analyze ROE alongside ROA.</li>
        <li>Review debt and financial leverage.</li>
        <li>Examine profitability and cash flow.</li>
        <li>Consider valuation ratios before investment decisions.</li>
      </ol>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This guide does not recommend buying or selling securities. ROE is one
        accounting profitability signal among many.
      </p>

      <h2
        id="advantages"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Advantages and Limitations of ROE
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Advantages: an easy profitability ratio, useful for tracking performance
        and peer comparisons, and a clear link from earnings to equity.
        Limitations: leverage can distort the ratio; buybacks shrink equity;
        negative equity complicates interpretation; accounting differences limit
        comparisons; one-time income can inflate results; ROE does not measure
        cash flow directly; and ROE alone cannot establish investment
        attractiveness.
      </p>

      <h2
        id="examples"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        ROE Calculation Examples
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>A: NI 120,000 · Equity 600,000 → ROE 20.00%</p>
        <p>B: NI −25,000 · Equity 250,000 → ROE −10.00%</p>
        <p>C: NI 150,000 · Equity 100,000 → ROE 150.00% (inspect context)</p>
        <p>D: NI 50,000 · Equity −200,000 → ROE −25.00% (negative equity warning)</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Example A shows solid positive profitability relative to equity. Example
        B shows a net loss. Example C exceeds 100% and warrants checking equity
        size and leverage. Example D computes mathematically but should not be
        compared directly with conventional positive-equity ROE.
      </p>

      <h2
        id="related"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related Calculators
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <Link
            href="/tools/return-on-assets-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Return on Assets Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/dupont-analysis-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            DuPont Analysis Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/net-profit-margin-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Net Profit Margin Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/financial-leverage-ratio-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Financial Leverage Ratio Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/return-on-capital-employed-calculator-roce"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Return on Capital Employed Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/earnings-per-share-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Earnings per Share Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/total-asset-turnover-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Total Asset Turnover Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/debt-to-equity-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Debt-to-Equity Ratio Calculator
          </Link>
        </li>
      </ul>

      <h2
        id="roe-faq"
        className="mt-10 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion items={[...ROE_FAQS]} />
      </div>
    </article>
  );
}
