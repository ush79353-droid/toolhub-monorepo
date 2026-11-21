import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { EV_FAQS } from './content';

export function EnterpriseValueGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Enterprise Value?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Enterprise value represents a company&apos;s overall value under a common
        valuation convention that includes claims from debt and other financing
        stakeholders. It can approximate the economic value associated with the
        operating business, but it is not necessarily the cash price an
        acquirer would pay after premiums, working-capital adjustments,
        restricted cash, or transaction terms.
      </p>

      <h2
        id="meaning"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Enterprise Value Meaning
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        EV combines equity market value with financial claims and deducts
        qualifying cash. Two firms with similar market caps can have very
        different enterprise values depending on leverage and cash.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Enterprise Value Formula
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>EV = Market Cap + Debt + Minority Interest + Preferred Shares − Cash</p>
      </div>

      <h2
        id="components"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Components of Enterprise Value
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Market capitalization — market value of common equity</li>
        <li>Debt — interest-bearing financial borrowings included in EV</li>
        <li>Minority interest — non-controlling equity interests</li>
        <li>Preferred shares — preferred equity claims</li>
        <li>Cash — qualifying cash and cash equivalents deducted</li>
      </ul>

      <h2
        id="vs-mcap"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Market Capitalization vs Enterprise Value
      </h2>
      <div className="my-4 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <caption className="mb-2 text-left text-xs text-muted-foreground">
            Market capitalization compared with enterprise value
          </caption>
          <thead>
            <tr className="border-b border-border">
              <th className="py-2 pr-3 font-semibold text-accent">Feature</th>
              <th className="py-2 pr-3 font-semibold text-accent">
                Market capitalization
              </th>
              <th className="py-2 font-semibold text-accent">Enterprise value</th>
            </tr>
          </thead>
          <tbody className="text-foreground/90">
            <tr className="border-b border-border">
              <td className="py-2 pr-3">Measures</td>
              <td className="py-2 pr-3">Common equity market value</td>
              <td className="py-2">Broader claims-based value</td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-2 pr-3">Debt</td>
              <td className="py-2 pr-3">No</td>
              <td className="py-2">Yes</td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-2 pr-3">Cash adjustment</td>
              <td className="py-2 pr-3">No</td>
              <td className="py-2">Yes</td>
            </tr>
            <tr>
              <td className="py-2 pr-3">Common use</td>
              <td className="py-2 pr-3">Equity valuation</td>
              <td className="py-2">Company / acquisition analysis</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2
        id="how-to-calculate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Enterprise Value
      </h2>
      <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Determine market capitalization.</li>
        <li>Determine financial debt.</li>
        <li>Identify minority interest.</li>
        <li>Identify preferred shares.</li>
        <li>Determine cash and cash equivalents.</li>
        <li>Add market cap, debt, minority interest, and preferred shares.</li>
        <li>Subtract cash and cash equivalents.</li>
        <li>Interpret enterprise value with context.</li>
      </ol>

      <h2
        id="example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Enterprise Value Calculation Example
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>8,500,000 shares × $18.45 = Market cap $156,825,000</p>
        <p>Debt $143,500,000 · Cash $50,000,000 · MI/Pref $0</p>
        <p>EV = 156,825,000 + 143,500,000 − 50,000,000 = $250,325,000</p>
      </div>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>$500M + $20M + $15M + $100M − $50M = EV $585,000,000</p>
      </div>

      <h2
        id="why-debt"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Why Debt Is Added to Enterprise Value
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Debt holders have claims on the business. Adding financial debt reflects
        those claims in EV. Assuming debt and paying cash for debt are not
        identical transaction outcomes.
      </p>

      <h2
        id="why-cash"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Why Cash Is Subtracted From Enterprise Value
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Qualifying cash and cash equivalents can reduce net financing needs in a
        simplified framework. Not every reported cash balance is immediately
        available for distribution or debt repayment.
      </p>

      <h2
        id="mi-ps"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Minority Interest and Preferred Shares
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Minority interest and preferred equity are added when they represent
        claims that should sit alongside common equity and debt in the EV
        numerator for consolidated analysis.
      </p>

      <h2
        id="vs-equity"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Enterprise Value vs Equity Value
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Equity Value ≈ EV − Debt − Minority Interest − Preferred + Cash</p>
      </div>

      <h2
        id="multiples"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Enterprise Value Multiples
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>EV/EBITDA = EV ÷ EBITDA</p>
        <p>EV/EBIT = EV ÷ EBIT</p>
        <p>EV/Revenue = EV ÷ Revenue</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Use consistent periods and peer sets. A nonpositive denominator makes a
        multiple hard to interpret.
      </p>

      <h2
        id="interpret"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Interpret Enterprise Value
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        High EV is not automatically overvaluation, and low EV is not automatic
        undervaluation. Pair EV with earnings, revenue, growth, profitability,
        capital intensity, leverage, peers, and market conditions.
      </p>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations of Enterprise Value
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Depends on market prices and debt/cash classifications</li>
        <li>Lease and preferred valuation conventions can differ</li>
        <li>Restricted cash and non-operating assets may need adjustments</li>
        <li>Acquisition terms can diverge from textbook EV</li>
        <li>This calculator estimates EV from the inputs you enter</li>
      </ul>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use the Enterprise Value Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter market capitalization.</li>
        <li>Enter minority interest.</li>
        <li>Enter preferred shares value.</li>
        <li>Enter financial debt.</li>
        <li>Enter cash and cash equivalents.</li>
        <li>Review enterprise value and the breakdown.</li>
        <li>Share or reset results as needed.</li>
      </ol>

      <h2
        id="ev-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion items={[...EV_FAQS]} />
      </div>
    </article>
  );
}
