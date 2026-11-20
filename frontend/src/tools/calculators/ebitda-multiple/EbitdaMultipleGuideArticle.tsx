import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { EBITDA_MULTIPLE_FAQS } from './content';

export function EbitdaMultipleGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is an EBITDA Multiple?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        An EBITDA multiple compares a company&apos;s enterprise value with its
        EBITDA (EV/EBITDA). Analysts use it for relative valuation, peer
        comparison, and acquisition analysis. A low multiple does not
        automatically mean a company is undervalued.
      </p>

      <h2
        id="enterprise-value"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is Enterprise Value?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Enterprise value is a broader valuation measure than market
        capitalization alone. A common simplified formula adds financial debt,
        preferred equity, and minority interest, then subtracts cash.
      </p>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>EV = Market Cap + Debt + Preferred Equity + Minority Interest − Cash</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Advanced valuations may also adjust for leases, non-operating assets, or
        other claims depending on methodology.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        The EBITDA Multiple Formula
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>EBITDA Multiple = Enterprise Value ÷ EBITDA</p>
      </div>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>EV $435,000,000 ÷ EBITDA $50,000,000 = 8.70×</p>
      </div>

      <h2
        id="how-to-calculate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate EV/EBITDA
      </h2>
      <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Determine market capitalization.</li>
        <li>Find financial debt.</li>
        <li>Identify cash and cash equivalents.</li>
        <li>Add preferred equity if applicable.</li>
        <li>Add minority interest if applicable.</li>
        <li>Calculate enterprise value.</li>
        <li>Determine EBITDA for the selected period.</li>
        <li>Divide enterprise value by EBITDA.</li>
        <li>Interpret versus peers and industry context.</li>
      </ol>

      <h2
        id="example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        EBITDA Multiple Calculation Example
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Market cap $450M · Debt $100M · MI $5M · Pref $10M · Cash $20M</p>
        <p>EV = 545M · EBITDA $50M · Multiple = 10.90×</p>
      </div>

      <h2
        id="interpret"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Interpret an EBITDA Multiple
      </h2>
      <h3 className="mt-4 text-base font-semibold text-accent">Lower multiple</h3>
      <p className="mt-2 text-sm leading-relaxed text-foreground/90 sm:text-base">
        May reflect lower expected growth, greater perceived risk, weaker
        outlook, cyclical conditions, or potential undervaluation versus peers.
      </p>
      <h3 className="mt-4 text-base font-semibold text-accent">Higher multiple</h3>
      <p className="mt-2 text-sm leading-relaxed text-foreground/90 sm:text-base">
        May reflect stronger growth expectations, business quality, market
        positioning — or potential overvaluation. Context always matters; there
        is no universal good/bad threshold.
      </p>

      <h2
        id="industry"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        EBITDA Multiples by Industry
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Typical multiples differ across consumer discretionary and staples,
        energy, finance and insurance, healthcare, industrials, information
        technology, materials, real estate, telecommunications, utilities, and
        wholesale trade. Industry levels change with growth, margins, rates,
        capital intensity, cyclicality, and sentiment. Treat any snapshot table
        as illustrative unless sourced and dated.
      </p>

      <h2
        id="vs-pe"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        EV/EBITDA vs P/E Ratio
      </h2>
      <div className="my-4 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <caption className="mb-2 text-left text-xs text-muted-foreground">
            Comparison of EV/EBITDA and P/E valuation lenses
          </caption>
          <thead>
            <tr className="border-b border-border">
              <th className="py-2 pr-3 font-semibold text-accent">Feature</th>
              <th className="py-2 pr-3 font-semibold text-accent">EV/EBITDA</th>
              <th className="py-2 font-semibold text-accent">P/E</th>
            </tr>
          </thead>
          <tbody className="text-foreground/90">
            <tr className="border-b border-border">
              <td className="py-2 pr-3">Numerator</td>
              <td className="py-2 pr-3">Enterprise value</td>
              <td className="py-2">Equity market value</td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-2 pr-3">Denominator</td>
              <td className="py-2 pr-3">EBITDA</td>
              <td className="py-2">Net earnings</td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-2 pr-3">Debt</td>
              <td className="py-2 pr-3">In enterprise value</td>
              <td className="py-2">Indirect via earnings/equity</td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-2 pr-3">D&amp;A / interest</td>
              <td className="py-2 pr-3">Excluded from EBITDA</td>
              <td className="py-2">Included in net earnings</td>
            </tr>
            <tr>
              <td className="py-2 pr-3">Common use</td>
              <td className="py-2 pr-3">Enterprise valuation</td>
              <td className="py-2">Equity valuation</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Neither ratio replaces full financial analysis.
      </p>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations of the EBITDA Multiple
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>EBITDA excludes capital expenditures and is not free cash flow</li>
        <li>Interest and taxes are excluded from the denominator</li>
        <li>Debt-heavy businesses need careful context</li>
        <li>Negative EBITDA complicates interpretation</li>
        <li>Accounting differences and one-time adjustments can distort peers</li>
        <li>EV construction can vary by methodology</li>
      </ul>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use the EBITDA Multiple Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter cash and cash equivalents.</li>
        <li>Enter market capitalization.</li>
        <li>Enter minority interest.</li>
        <li>Enter preferred equity value.</li>
        <li>Enter total financial debt.</li>
        <li>Review enterprise value.</li>
        <li>Enter EBITDA.</li>
        <li>Review the EBITDA multiple.</li>
        <li>Compare with relevant peers or industry data.</li>
      </ol>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Keep EV and EBITDA on a consistent currency and scale. Market EV is
        often measured at a valuation date while EBITDA may be trailing twelve
        months or a forecast period.
      </p>

      <h2
        id="evm-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion items={[...EBITDA_MULTIPLE_FAQS]} />
      </div>
    </article>
  );
}
