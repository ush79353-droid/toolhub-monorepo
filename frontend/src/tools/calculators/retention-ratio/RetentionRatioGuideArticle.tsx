import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { RR_FAQS } from './content';

export function RetentionRatioGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="intro"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Introduction
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The Retention Ratio Calculator estimates how much of a company&apos;s
        net income is kept in the business after dividends. Investors, students,
        and analysts use it to compare dividend policy with reinvestment
        intensity. Enter net income and dividends paid to see period retained
        earnings and the retention (plowback) percentage.
      </p>

      <h2
        id="what-is"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is the Retention Ratio?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The retention ratio measures the fraction of earnings not paid out as
        dividends. Companies retain profits to fund growth, reduce debt, build
        reserves, or pursue other capital needs. A higher retention share means
        more earnings stay inside the firm; a lower share means more cash goes
        to shareholders as dividends. Period retained earnings here are not the
        same as the cumulative retained-earnings line on a balance sheet.
      </p>

      <h2
        id="how-to-calculate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Retention Ratio
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Retained Earnings (period) = Net Income − Dividends Paid</p>
        <p>Retention Ratio (%) = (Retained Earnings ÷ Net Income) × 100</p>
        <p>Retention Ratio (%) = (1 − Dividend Payout Ratio) × 100</p>
        <p>(payout as a decimal, e.g. 0.35 for 35%)</p>
      </div>
      <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Start with net income for the period: $1,000,000.</li>
        <li>Subtract dividends paid: $350,000.</li>
        <li>Period retained earnings = $650,000.</li>
        <li>Retention ratio = 650,000 ÷ 1,000,000 × 100 = 65%.</li>
      </ol>

      <h2
        id="interpretation"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Retention Ratio Interpretation
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <strong>High retention</strong> — more earnings reinvested; common in
          growth companies.
        </li>
        <li>
          <strong>Low retention</strong> — larger dividend share; common in
          mature cash-generative firms.
        </li>
        <li>
          <strong>100%</strong> — no dividends; all earnings retained.
        </li>
        <li>
          <strong>0%</strong> — all earnings paid as dividends.
        </li>
        <li>
          <strong>Negative</strong> — dividends exceed positive net income.
        </li>
      </ul>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A higher retention ratio is not automatically better. Reinvestment only
        creates value when projects earn adequate returns. Growth businesses and
        mature dividend payers can both follow rational policies with very
        different retention levels.
      </p>

      <h2
        id="vs-payout"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Retention Ratio vs. Dividend Payout Ratio
      </h2>
      <div className="my-4 overflow-x-auto">
        <table className="w-full min-w-[20rem] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="py-2 pr-3 font-semibold text-accent">Metric</th>
              <th className="py-2 font-semibold text-accent">Focus</th>
            </tr>
          </thead>
          <tbody className="text-foreground/90">
            <tr className="border-b border-border">
              <td className="py-2 pr-3">Retention ratio</td>
              <td className="py-2">Share of NI kept in the business</td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-2 pr-3">Dividend payout ratio</td>
              <td className="py-2">Share of NI paid as dividends</td>
            </tr>
            <tr>
              <td className="py-2 pr-3">Relationship</td>
              <td className="py-2">
                Retention ≈ 1 − payout (as decimals)
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Example: payout 35% → retention about 65%. See also the{' '}
        <a
          href="/tools/dividend-payout-ratio-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Dividend Payout Ratio Calculator
        </a>
        .
      </p>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations of Retention Ratio
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Does not measure profitability or return on invested capital.</li>
        <li>Does not prove reinvestment is efficient or value-creating.</li>
        <li>Ignores leverage, liquidity, and cash-flow quality.</li>
        <li>Undefined when net income is zero; hard to interpret with losses.</li>
        <li>One period may not represent long-term dividend policy.</li>
      </ul>

      <h2
        id="rr-faq"
        className="mt-10 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion items={[...RR_FAQS]} />
      </div>
    </article>
  );
}
