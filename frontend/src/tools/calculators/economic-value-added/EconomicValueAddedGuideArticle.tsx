import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { EVA_FAQS } from './content';

export function EconomicValueAddedGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is EVA?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Economic Value Added measures economic profit after accounting for the
        cost of invested capital. Unlike traditional accounting profit, EVA
        subtracts a capital charge so managers and investors can see whether
        operating returns exceed the required return on capital.
      </p>

      <h2
        id="definition"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Economic Value Added Definition
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>EVA = NOPAT − Capital Charge</p>
        <p>Capital Charge = Invested Capital × WACC</p>
      </div>

      <h2
        id="why-matters"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Why Economic Value Added Matters
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        EVA supports capital allocation, performance measurement, investment
        evaluation, and cost-of-capital awareness. Positive EVA does not
        guarantee strong future performance by itself.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        The EVA Formula
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>EVA = NOPAT − (Invested Capital × WACC)</p>
        <p>When WACC is entered as a percent: use WACC% ÷ 100</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A simplified article form sometimes writes EVA = NOPAT − (Total Assets −
        Current Liabilities) × WACC. That approximation needs care because
        assets and current liabilities may mix operating and financing items.
      </p>

      <h2
        id="how-to-calculate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate EVA
      </h2>
      <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Calculate NOPAT.</li>
        <li>Determine invested capital.</li>
        <li>Find WACC.</li>
        <li>Convert WACC to decimal.</li>
        <li>Calculate capital charge = IC × WACC.</li>
        <li>Subtract capital charge from NOPAT.</li>
        <li>Interpret the resulting EVA.</li>
      </ol>

      <h2
        id="nopat"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Understanding NOPAT
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        NOPAT is after-tax operating profit before financing costs. A common
        approximation is NOPAT = EBIT × (1 − T). Actual practice may require
        accounting adjustments so NOPAT aligns with invested capital.
      </p>

      <h2
        id="invested-capital"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is Invested Capital?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Invested capital is capital committed to operations — often operating
        assets less operating liabilities, or net operating working capital plus
        net operating fixed assets. Cash treatment, non-operating investments,
        and financing liabilities need consistent classification with NOPAT.
      </p>

      <h2
        id="wacc"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is WACC?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        WACC is the blended required return on capital sources. For a simplified
        debt-and-equity structure:
      </p>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>WACC = (E/V)×Re + (D/V)×Rd×(1 − T)</p>
      </div>

      <h2
        id="how-ic"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Invested Capital
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This calculator&apos;s helper uses Invested Capital = Operating Assets −
        Operating Liabilities. Avoid double-counting financing liabilities.
      </p>

      <h2
        id="example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Economic Value Added Calculation Example
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>NOPAT $750,000 · Invested capital $1,000,000 · WACC 10%</p>
        <p>Capital charge = $100,000 · EVA = $650,000</p>
      </div>

      <h2
        id="interpret"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Positive vs Negative EVA
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Positive: NOPAT exceeds the capital charge</li>
        <li>Zero: NOPAT exactly covers the capital charge</li>
        <li>Negative: NOPAT falls short of the capital charge</li>
      </ul>

      <h2
        id="importance"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Importance of EVA
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        EVA highlights whether the business earns more than its estimated cost of
        capital and can inform capital allocation and multi-period performance
        review.
      </p>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations of EVA
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Sensitive to WACC and invested-capital definitions</li>
        <li>Accounting adjustments can change results</li>
        <li>Harder to compare firms of very different sizes</li>
        <li>Period choice and estimates matter</li>
        <li>Intangible investments and capital intensity complicate interpretation</li>
        <li>Not a complete business valuation</li>
      </ul>

      <h2
        id="vs-roi"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        EVA vs ROI
      </h2>
      <div className="my-4 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <caption className="mb-2 text-left text-xs text-muted-foreground">
            Accounting profit versus Economic Value Added
          </caption>
          <thead>
            <tr className="border-b border-border">
              <th className="py-2 pr-3 font-semibold text-accent">Feature</th>
              <th className="py-2 pr-3 font-semibold text-accent">
                Accounting profit
              </th>
              <th className="py-2 font-semibold text-accent">EVA</th>
            </tr>
          </thead>
          <tbody className="text-foreground/90">
            <tr className="border-b border-border">
              <td className="py-2 pr-3">Purpose</td>
              <td className="py-2 pr-3">Accounting earnings</td>
              <td className="py-2">Profit after capital charge</td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-2 pr-3">Cost of equity</td>
              <td className="py-2 pr-3">Not deducted from net income</td>
              <td className="py-2">Included via WACC</td>
            </tr>
            <tr>
              <td className="py-2 pr-3">Typical form</td>
              <td className="py-2 pr-3">Earnings / ROI %</td>
              <td className="py-2">Monetary residual</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        ROI = Return ÷ Investment × 100. EVA = NOPAT − (IC × WACC). Use
        consistent definitions for either metric.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use the EVA Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter NOPAT.</li>
        <li>Enter invested capital.</li>
        <li>Enter WACC as a percentage.</li>
        <li>Review capital charge and EVA.</li>
        <li>Optionally expand Calculate invested capital.</li>
        <li>Enter operating assets and liabilities.</li>
        <li>Apply calculated invested capital when ready.</li>
        <li>Share or reset results as needed.</li>
      </ol>

      <h2
        id="eva-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion items={[...EVA_FAQS]} />
      </div>
    </article>
  );
}
