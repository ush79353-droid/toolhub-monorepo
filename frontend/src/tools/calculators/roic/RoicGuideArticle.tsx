import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { ROIC_FAQS } from './content';

export function RoicGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Return on Invested Capital?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Return on invested capital (ROIC) measures how efficiently a company
        generates after-tax operating profit from the capital invested in the
        business. Investors, owners, and analysts use ROIC to judge capital
 efficiency; not just accounting profit margins. Profits alone do not
        show how much debt and equity capital were required to earn them.
      </p>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Invested capital typically represents the financing tied to operating
        assets. This calculator uses a simplified equity-plus-debt definition so
        you can estimate ROIC quickly and compare scenarios.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        ROIC Formula
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>ROIC = (NOPAT ÷ Invested Capital) × 100</p>
        <p>NOPAT = EBIT × (1 − t)</p>
        <p>Invested Capital = Equity + Interest-Bearing Debt</p>
        <p>
          Average Invested Capital = (Beginning + Ending) ÷ 2
        </p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        NOPAT estimates after-tax operating profit before interest. The
        equity-plus-debt formula is simplified; detailed valuation may adjust
        for excess cash, leases, non-operating assets, and operating liabilities.
        Average invested capital can better match period NOPAT when the capital
        base changed during the year.
      </p>

      <h2
        id="how-to-calculate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate ROIC
      </h2>
      <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Find EBIT for the period.</li>
        <li>Choose an appropriate tax rate and compute NOPAT.</li>
        <li>Sum equity and interest-bearing debt (or use average capital).</li>
        <li>Divide NOPAT by invested capital and multiply by 100.</li>
        <li>Interpret against WACC, peers, and trends.</li>
      </ol>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>EBIT 500,000 · Tax 25% → NOPAT 375,000</p>
        <p>Equity 1,200,000 + Debt 800,000 → Invested Capital 2,000,000</p>
        <p>ROIC = (375,000 / 2,000,000) × 100 = 18.75%</p>
      </div>

      <h2
        id="good-roic"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is a Good ROIC?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Industry, capital intensity, business model, economic conditions, and
        sustainability all matter. A “good” ROIC is typically one that exceeds
 the company’s cost of capital over time; not a universal percentage
        threshold. Compare peers with similar capital structures and accounting
        definitions.
      </p>

      <h2
        id="roic-vs-roe"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        ROIC vs. ROE
      </h2>
      <div className="my-4 overflow-x-auto">
        <table className="w-full min-w-[22rem] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="py-2 pr-3 font-semibold text-accent">Feature</th>
              <th className="py-2 pr-3 font-semibold text-accent">ROIC</th>
              <th className="py-2 font-semibold text-accent">ROE</th>
            </tr>
          </thead>
          <tbody className="text-foreground/90">
            <tr className="border-b border-border">
              <td className="py-2 pr-3">Focus</td>
              <td className="py-2 pr-3">Operating return on capital</td>
              <td className="py-2">Profit relative to equity</td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-2 pr-3">Numerator</td>
              <td className="py-2 pr-3">NOPAT</td>
              <td className="py-2">Net income</td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-2 pr-3">Denominator</td>
              <td className="py-2 pr-3">Invested capital</td>
              <td className="py-2">Shareholders&apos; equity</td>
            </tr>
            <tr>
              <td className="py-2 pr-3">Debt</td>
              <td className="py-2 pr-3">Included in capital base</td>
              <td className="py-2">Affects ROE indirectly</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        See the{' '}
        <Link
          href="/tools/return-on-equity-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Return on Equity Calculator
        </Link>
        .
      </p>

      <h2
        id="roic-vs-roce"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        ROIC vs. ROCE
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Return on capital employed (ROCE) often uses EBIT (or similar) over
        capital employed, while ROIC typically uses NOPAT over invested capital.
        Definitions of both denominators vary by analyst. Use consistent
        definitions when comparing firms. Related:{' '}
        <Link
          href="/tools/return-on-capital-employed-calculator-roce"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          ROCE Calculator
        </Link>
        .
      </p>

      <h2
        id="roic-vs-roi"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        ROIC vs. ROI
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        ROI is a general label for return on a project, campaign, or investment
        with its own cost and payoff definitions. ROIC is a firm-level operating
        capital-efficiency ratio with a structured NOPAT and capital framework.
        They are not interchangeable labels.
      </p>

      <h2
        id="roic-vs-wacc"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        ROIC vs. WACC
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>ROIC Spread = ROIC − WACC</p>
        <p>Example: ROIC 18% − WACC 10% = 8 percentage points</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A positive spread suggests after-tax operating returns exceed the
        estimated financing cost under the assumptions used; a negative spread
 suggests the opposite. This calculator does not assume a WACC; supply
        your own estimate when comparing. Related value-creation tools include
        the{' '}
        <Link
          href="/tools/economic-value-added-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Economic Value Added Calculator
        </Link>
        .
      </p>

      <h2
        id="nopat"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is NOPAT?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Net operating profit after taxes estimates operating earnings after a
        normalized tax charge but before interest expense. Starting from EBIT
        keeps financing costs out of the numerator so ROIC focuses on operating
        performance. NOPAT differs from net income, which subtracts interest and
        may include non-operating items. For EBIT inputs see the{' '}
        <Link
          href="/tools/ebit-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          EBIT Calculator
        </Link>
        .
      </p>

      <h2
        id="invested-capital"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Invested Capital
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Simplified: equity + interest-bearing debt. Do not automatically treat
        all payables as debt. Advanced approaches may subtract excess cash, add
        capitalized leases, or use operating working capital plus fixed assets.
        Average beginning and ending capital when period matching matters.
        Consistency across periods and peers is essential.
      </p>

      <h2
        id="improve"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Companies Improve ROIC
      </h2>
      <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Improve operating margins sustainably.</li>
        <li>Increase asset productivity.</li>
        <li>Manage inventory and receivables carefully.</li>
        <li>Reduce unnecessary capital expenditures.</li>
        <li>Improve working capital efficiency.</li>
        <li>Allocate capital to projects that clear the cost of capital.</li>
        <li>Avoid investments that persistently earn below WACC.</li>
      </ol>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations of ROIC
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Accounting policy differences, invested-capital definition choices,
        goodwill and acquisitions, capital intensity, one-time profits, tax
        normalization, unusually low capital bases, lifecycle stage, and
        historical-cost asset values can all distort comparisons. ROIC is not a
        complete valuation method on its own.
      </p>

      <h2
        id="examples"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Practical ROIC Examples
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>
          A (manufacturing): EBIT 400k · tax 25% · equity 2.0M · debt 1.5M →
          NOPAT 300k · IC 3.5M → ROIC ≈ 8.57%
        </p>
        <p>
          B (software): EBIT 300k · tax 20% · equity 400k · debt 100k → NOPAT
          240k · IC 500k → ROIC 48.00%
        </p>
        <p>
          C (declining ops): EBIT −50k · tax 25% · equity 800k · debt 200k →
          NOPAT −37.5k · IC 1.0M → ROIC −3.75%
        </p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Asset-light models can post higher ROIC with less capital; capital-heavy
        manufacturers may earn lower ROIC with larger asset bases. Negative
        operating profit produces negative ROIC even when the capital base is
        healthy.
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
            href="/tools/dupont-analysis-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            DuPont Analysis Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/ebit-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            EBIT Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/ebitda-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            EBITDA Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/economic-value-added-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Economic Value Added Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/enterprise-value-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Enterprise Value Calculator
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
            href="/tools/net-operating-working-capital-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Net Operating Working Capital Calculator
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
      </ul>

      <h2
        id="roic-faq"
        className="mt-10 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion items={[...ROIC_FAQS]} />
      </div>
    </article>
  );
}
