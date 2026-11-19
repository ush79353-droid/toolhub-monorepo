import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { COMBINED_RATIO_FAQS } from './content';

const interpretRows = [
  { ratio: '70%', meaning: 'Strong positive underwriting result under the simplified model' },
  { ratio: '85%', meaning: 'Positive underwriting margin' },
  { ratio: '95%', meaning: 'Small positive underwriting margin' },
  { ratio: '100%', meaning: 'Underwriting break-even' },
  { ratio: '105%', meaning: 'Underwriting loss' },
  { ratio: '120%', meaning: 'Significant underwriting loss' },
] as const;

export function CombinedRatioGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-combined-ratio"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Does the Combined Ratio Mean in Insurance?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The combined ratio is a core underwriting performance metric. It compares insurance losses
        and underwriting operating expenses to the premium base for the same period and accounting
        definition. Analysts and investors use it to judge whether premiums cover claims and the
        cost of writing business — before investment income and many non-underwriting items.
      </p>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Combined Ratio = Loss Ratio + Expense Ratio</p>
        <p>Loss Ratio = Loss Expense / Premiums × 100</p>
        <p>Expense Ratio = Underwriting Expense / Premiums × 100</p>
        <p>Combined Ratio = (Loss Expense + Underwriting Expense) / Premiums × 100</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Below 100% generally means underwriting profit under that definition; above 100% means
        underwriting loss. Definitions of premiums (often net earned), losses, and expenses must
        stay consistent — mixing bases invalidates the ratio.
      </p>

      <h2 id="how-to-calculate" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Calculate the Combined Ratio
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Example: premiums $100,000,000; claim loss $52,000,000; loss adjustments $8,000,000;
        underwriting expense $28,000,000.
      </p>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Loss expense = 52,000,000 + 8,000,000 = 60,000,000</li>
        <li>Loss ratio = 60,000,000 / 100,000,000 × 100 = 60%</li>
        <li>Expense ratio = 28,000,000 / 100,000,000 × 100 = 28%</li>
        <li>Combined ratio = 60% + 28% = 88%</li>
      </ol>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The simplified underwriting margin is 100% − 88% = 12%. Underwriting result = premiums −
        loss expense − underwriting expense = $12,000,000 in this example.
      </p>

      <h2 id="vs-loss-ratio" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Combined Ratio vs. Loss Ratio
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <strong>Loss ratio</strong> looks only at losses versus premiums.{' '}
        <strong>Combined ratio</strong> also includes underwriting expenses. Example: loss ratio 65%
        and expense ratio 25% → combined ratio 90%. A favorable loss ratio can still leave a weak
        underwriting result if acquisition and admin costs are high.
      </p>

      <h2 id="how-to-interpret" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Interpret the Combined Ratio
      </h2>
      <div className="mt-4 overflow-x-auto rounded-xl border border-border">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-muted/40 text-accent">
            <tr>
              <th className="px-3 py-2 font-semibold">Combined ratio</th>
              <th className="px-3 py-2 font-semibold">Interpretation</th>
            </tr>
          </thead>
          <tbody>
            {interpretRows.map((row) => (
              <tr key={row.ratio} className="border-t border-border">
                <td className="px-3 py-2 tabular-nums">{row.ratio}</td>
                <td className="px-3 py-2">{row.meaning}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Acceptable levels vary by insurance line, jurisdiction, business model, accounting basis,
        and market cycle. One number never guarantees company-wide financial health.
      </p>

      <h2 id="factors" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Factors Affecting the Combined Ratio
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Claims frequency and severity, including catastrophic events</li>
        <li>Inflation in repair, medical, and legal costs</li>
        <li>Reinsurance structure and recoveries</li>
        <li>Underwriting quality and premium pricing</li>
        <li>Claims handling efficiency and loss adjustment spend</li>
        <li>Acquisition commissions and administrative costs</li>
        <li>Changes in loss reserves and regulatory/accounting rules</li>
      </ul>

      <h2
        id="vs-profitability"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Combined Ratio vs. Profitability
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Underwriting income is only one piece of an insurer’s results. Investment income, other
        operating items, taxes, reserve development, and reinsurance can move total profit even when
        the combined ratio is above or below 100%. Treat the metric as an underwriting lens, not a
        full P&amp;L substitute.
      </p>

      <h2
        id="related-calculators"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related Calculators
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <Link
            className="text-primary underline-offset-2 hover:underline"
            href="/tools/operating-margin-calculator"
          >
            Operating Margin Calculator
          </Link>
        </li>
        <li>
          <Link
            className="text-primary underline-offset-2 hover:underline"
            href="/tools/expense-ratio-calculator"
          >
            Expense Ratio Calculator
          </Link>
        </li>
        <li>
          <Link
            className="text-primary underline-offset-2 hover:underline"
            href="/tools/gross-margin-calculator"
          >
            Gross Margin Calculator
          </Link>
        </li>
        <li>
          <Link className="text-primary underline-offset-2 hover:underline" href="/tools/roi-calculator">
            ROI Calculator
          </Link>
        </li>
        <li>
          <Link
            className="text-primary underline-offset-2 hover:underline"
            href="/tools/break-even-calculator"
          >
            Break-Even Calculator
          </Link>
        </li>
      </ul>

      <h2
        id="combined-ratio-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...COMBINED_RATIO_FAQS]} />
      </div>
    </article>
  );
}
