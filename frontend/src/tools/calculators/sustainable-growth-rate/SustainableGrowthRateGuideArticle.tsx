import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { SGR_FAQS } from './content';

export function SustainableGrowthRateGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is the Sustainable Growth Rate?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The sustainable growth rate (SGR) estimates how quickly a company can
        grow while keeping its existing financial policies and capital structure,
        without issuing new equity. It links profitability (ROE), retained
        earnings, dividends, and financing assumptions into a single planning
        metric. Theoretical SGR often differs from actual revenue growth when
        firms raise capital, change payouts, or face different market conditions.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Sustainable Growth Rate Formula
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>SGR = ROE × b</p>
        <p>ROE = NI / E</p>
        <p>b = (NI − D) / NI</p>
        <p>SGR% = (ROE% × retention%) / 100</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Retained earnings fund internally supported growth. Some models measure
        growth relative to beginning versus ending equity or treat external
        financing differently — label assumptions clearly when comparing results.
      </p>

      <h2
        id="how-it-works"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Does the Sustainable Growth Rate Calculator Work?
      </h2>
      <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter net income and dividends → retained earnings and retention.</li>
        <li>Enter shareholders&apos; equity → ROE.</li>
        <li>Multiply ROE × retention (as decimals) for SGR.</li>
      </ol>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>NI 2,000,000 · Dividends 1,000,000 → retention 50%</p>
        <p>Equity 10,000,000 → ROE 20%</p>
        <p>SGR = 0.50 × 0.20 = 10.00%</p>
      </div>

      <h2
        id="retention"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is the Retention Ratio?
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Retention Ratio = 1 − Dividend Payout Ratio</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Retention shows the share of earnings kept for reinvestment after
        dividends. Higher retention supports higher SGR for a given ROE, with
        trade-offs for cash distributions. See the{' '}
        <Link
          href="/tools/retention-ratio-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Retention Ratio Calculator
        </Link>{' '}
        and{' '}
        <Link
          href="/tools/dividend-payout-ratio-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Dividend Payout Ratio Calculator
        </Link>
        .
      </p>

      <h2
        id="roe"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is Return on Equity?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        ROE measures net income relative to shareholders&apos; equity. Leverage,
        margins, and asset use all affect ROE. Average equity can better match
        period income when the balance sheet changes. Unusually high ROE warrants
        checking leverage and one-time items. Related:{' '}
        <Link
          href="/tools/return-on-equity-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Return on Equity Calculator
        </Link>
        .
      </p>

      <h2
        id="sgr-vs-igr"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Sustainable Growth Rate vs. Internal Growth Rate
      </h2>
      <div className="my-4 overflow-x-auto">
        <table className="w-full min-w-[22rem] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="py-2 pr-3 font-semibold text-accent">Feature</th>
              <th className="py-2 pr-3 font-semibold text-accent">SGR</th>
              <th className="py-2 font-semibold text-accent">Internal Growth</th>
            </tr>
          </thead>
          <tbody className="text-foreground/90">
            <tr className="border-b border-border">
              <td className="py-2 pr-3">Profitability base</td>
              <td className="py-2 pr-3">ROE</td>
              <td className="py-2">Often ROA</td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-2 pr-3">Retention</td>
              <td className="py-2 pr-3">Used</td>
              <td className="py-2">Used</td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-2 pr-3">New debt</td>
              <td className="py-2 pr-3">May scale with equity</td>
              <td className="py-2">Typically excluded</td>
            </tr>
            <tr>
              <td className="py-2 pr-3">New equity</td>
              <td className="py-2 pr-3">Excluded in standard model</td>
              <td className="py-2">Excluded</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Do not treat internal growth rate and SGR as identical. Related asset
        profitability:{' '}
        <Link
          href="/tools/return-on-assets-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Return on Assets Calculator
        </Link>
        .
      </p>

      <h2
        id="good-sgr"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is a Good Sustainable Growth Rate?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Industry, maturity, business model, reinvestment needs, profitability,
        cost of capital, opportunities, and risk all shape what SGR is
        appropriate. Avoid universal thresholds. Align growth plans with funding
        capacity and financial risk tolerance.
      </p>

      <h2
        id="exceeds"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Happens When Actual Growth Exceeds SGR?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Growing faster than SGR may require additional debt, equity issuance,
        lower dividends, higher profitability, better asset efficiency, working
        capital improvements, or a slower growth target. Exceeding SGR is not
        automatically bad — it signals a financing or operations gap to close.
      </p>

      <h2
        id="improve"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Can a Company Improve Its Sustainable Growth Rate?
      </h2>
      <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Improve operating profitability sustainably.</li>
        <li>Manage dividend policy thoughtfully.</li>
        <li>Reinvest retained earnings productively.</li>
        <li>Strengthen ROE without reckless leverage.</li>
        <li>Manage working capital carefully.</li>
        <li>Allocate capital with discipline.</li>
        <li>Avoid excessive financial leverage solely to inflate ROE.</li>
      </ol>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations of the Sustainable Growth Rate Model
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Constant ROE and payout assumptions, stable debt-to-equity, accounting
        differences, negative earnings or equity, unrealistic projections,
        business cycles, inflation, and lumpy capital needs all limit the model.
        SGR is a planning framework, not a prediction.
      </p>

      <h2
        id="examples"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Practical Examples
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>
          A (mature): NI 800k · Div 400k · Equity 4M → b 50% · ROE 20% → SGR 10%
        </p>
        <p>
          B (high reinvestment): NI 600k · Div 60k · Equity 3M → b 90% · ROE 20%
          → SGR 18%
        </p>
        <p>
          C (excess dividends): NI 100k · Div 150k · Equity 1M → b −50% · ROE
          10% → SGR −5%
        </p>
      </div>

      <h2
        id="related"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related Calculators
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <Link
            href="/tools/retention-ratio-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Retention Ratio Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/return-on-equity-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Return on Equity Calculator
          </Link>
        </li>
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
            href="/tools/roic-calculator-return-on-invested-capital"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            ROIC Calculator
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
            href="/tools/earnings-per-share-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Earnings per Share Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/dividend-payout-ratio-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Dividend Payout Ratio Calculator
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
      </ul>

      <h2
        id="sgr-faq"
        className="mt-10 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion items={[...SGR_FAQS]} />
      </div>
    </article>
  );
}
