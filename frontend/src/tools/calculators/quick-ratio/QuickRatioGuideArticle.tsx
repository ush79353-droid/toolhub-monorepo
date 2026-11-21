import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { QUICK_RATIO_FAQS } from './content';

export function QuickRatioGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Quick Ratio Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The quick ratio — also called the acid-test ratio — measures whether a
        company&apos;s most liquid current assets can cover its current
        liabilities without depending on inventory sales. Liquidity matters
        because short-term obligations come due regardless of how slowly stock
        turns or how long customers take to pay. This Quick Ratio Calculator
        uses cash and cash equivalents, marketable securities, net accounts
        receivable, and current liabilities to compute the ratio in real time.
        You can also switch to an adjusted current-assets method or reverse-solve
        for required quick assets, liabilities, or cash. Owners, credit
        analysts, lenders, suppliers, and students use the acid-test to screen
        short-term coverage before digging into cash-flow statements and notes.
      </p>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Currency labels in the panel are denomination only: changing PKR, USD,
        or another code updates symbols and grouping; it does not convert
        amounts. Enter figures already stated in the same currency as your
        balance sheet extract.
      </p>

      <h2
        id="definition"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is a Quick Ratio (Acid-Test Ratio)?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The quick ratio compares liquid current assets to current liabilities.
        &quot;Acid-test&quot; is the traditional name for the same idea: can the
        firm meet near-term claims with assets that convert to cash quickly and
        with relatively little price uncertainty? Inventory is excluded because
        selling stock can take time, may require discounts, and may not fund
        payables on the schedule creditors expect. Prepaid expenses are also
        excluded because they typically represent services already paid for,
        not cash available to settle new obligations.
      </p>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Creditors and analysts use the ratio as a tighter liquidity screen than
        the current ratio. It remains a point-in-time balance-sheet measure.
        Strong receivables on paper can still collect slowly; marketable
        securities can be restricted or illiquid; and upcoming debt maturities
        may cluster just after the reporting date. Interpret the acid-test with
        aging schedules, cash budgets, and industry context — not as a solitary
        pass/fail grade.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Quick Ratio Formula (Acid-Test Ratio Formula)
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>QR = Quick Assets / Current Liabilities</p>
        <p>Quick Assets = C + MS + AR</p>
        <p>QR = (C + MS + AR) / CL</p>
        <p>Adjusted: QR = (CA − I − PE − O) / CL</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Where C is cash and cash equivalents, MS is marketable securities, AR is
        net accounts receivable, CL is current liabilities, CA is total current
        assets, I is inventory, PE is prepaid expenses, and O is other current
        assets excluded from quick assets. Qualifying quick assets should be
        liquid and available to meet short-term claims. Do not mix inputs from
        the direct method with the adjusted method unless you intentionally
        rebuild a consistent set from the same statement.
      </p>

      <h2
        id="how-to-calculate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Quick Ratio
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Worked example (direct method):
      </p>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Cash and cash equivalents: PKR 150,000</li>
        <li>Marketable securities: PKR 50,000</li>
        <li>Accounts receivable (net): PKR 100,000</li>
        <li>Current liabilities: PKR 200,000</li>
      </ul>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          Quick assets = 150,000 + 50,000 + 100,000 = <strong>300,000</strong>
        </li>
        <li>
          Quick ratio = 300,000 ÷ 200,000 = <strong>1.50x</strong>
        </li>
      </ol>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Interpretation: the company has PKR 1.50 in quick assets for every PKR
        1.00 of current liabilities under these inputs. The same arithmetic
        applies in any currency when all line items share one denomination.
      </p>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Adjusted-method check: if current assets are 500,000, inventory 150,000,
        prepaid 50,000, and other non-quick 0, then quick assets = 500,000 −
        150,000 − 50,000 − 0 = 300,000 and QR = 300,000 ÷ 200,000 = 1.50x —
        matching the direct build when classifications are consistent.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use the Quick Ratio Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Choose a currency denomination that matches your statement units.</li>
        <li>
          Select <em>Direct Quick Assets</em> (default) or{' '}
          <em>Current Assets Adjustment</em>.
        </li>
        <li>
          Enter cash and cash equivalents, marketable securities, and net
          accounts receivable — or the adjusted current-asset components.
        </li>
        <li>Enter current liabilities (must be greater than zero).</li>
        <li>
          Review the calculated quick ratio, comparison bars, formula steps, and
          interpretation.
        </li>
        <li>
          Optionally change the solve target to reverse-calculate required quick
          assets, current liabilities, or required cash for a target ratio.
        </li>
        <li>
          Use Load example for the PKR 1.50 demonstration, Reload to restore the
          starting state, or Clear to wipe inputs.
        </li>
      </ol>

      <h2
        id="good-ratio"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is a Good Quick Ratio?
      </h2>
      <div className="my-4 overflow-x-auto rounded-xl border border-border">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-muted/40 text-accent">
            <tr>
              <th className="px-3 py-2 font-semibold">Quick ratio</th>
              <th className="px-3 py-2 font-semibold">General reading</th>
            </tr>
          </thead>
          <tbody className="text-foreground/90">
            <tr className="border-t border-border">
              <td className="px-3 py-2">Below 1.00</td>
              <td className="px-3 py-2">
                Quick assets are less than current liabilities
              </td>
            </tr>
            <tr className="border-t border-border">
              <td className="px-3 py-2">Exactly 1.00</td>
              <td className="px-3 py-2">
                Quick assets equal current liabilities
              </td>
            </tr>
            <tr className="border-t border-border">
              <td className="px-3 py-2">Above 1.00</td>
              <td className="px-3 py-2">
                Quick assets exceed current liabilities
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        There is no universal &quot;good&quot; number. Service firms with little
        inventory may run near or above 1.00 more comfortably than inventory-heavy
        retailers whose current ratio looks fine while the quick ratio is thinner.
        Cash-flow timing, unused credit lines, and receivable quality can make a
        sub-1 ratio manageable — or an above-1 ratio fragile. Do not label every
        ratio below 1 as financial distress, and do not treat every ratio above 1
        as proof of safety.
      </p>

      <h2
        id="vs-current"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Quick Ratio vs. Current Ratio
      </h2>
      <div className="my-4 overflow-x-auto rounded-xl border border-border">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-muted/40 text-accent">
            <tr>
              <th className="px-3 py-2 font-semibold">Measure</th>
              <th className="px-3 py-2 font-semibold">Formula focus</th>
            </tr>
          </thead>
          <tbody className="text-foreground/90">
            <tr className="border-t border-border">
              <td className="px-3 py-2">Quick ratio</td>
              <td className="px-3 py-2">
                Highly liquid current assets ÷ current liabilities
              </td>
            </tr>
            <tr className="border-t border-border">
              <td className="px-3 py-2">Current ratio</td>
              <td className="px-3 py-2">
                Total current assets ÷ current liabilities
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Current ratio = CA ÷ CL. Quick ratio removes inventory, prepaid expenses,
        and other non-quick items from the numerator. A business can post a high
        current ratio and a much lower quick ratio when inventory or prepaid
        balances dominate current assets — a common pattern in wholesale and
        manufacturing. Compare both ratios before concluding that working capital
        is comfortably liquid.
      </p>

      <h2
        id="vs-cash"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Quick Ratio vs. Cash Ratio
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The cash ratio is a stricter liquidity measure. Definitions vary, but a
        common convention uses cash and cash equivalents (sometimes plus highly
        liquid marketable securities) divided by current liabilities, often
        excluding receivables. This calculator&apos;s default quick ratio includes
        net accounts receivable in the direct method. If you need the more
        restrictive screen, use a{' '}
        <Link
          href="/tools/cash-ratio-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Cash Ratio Calculator
        </Link>{' '}
        or manually omit receivables from the acid-test inputs.
      </p>

      <h2
        id="included"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Assets Are Included in the Quick Ratio?
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <strong>Cash and cash equivalents</strong> — cash on hand, demand
          deposits, and short-term instruments readily convertible to known cash
          amounts with insignificant risk of value change.
        </li>
        <li>
          <strong>Marketable securities</strong> — liquid investments that can
          generally be converted quickly, subject to market conditions and any
          restrictions. Not every security automatically qualifies.
        </li>
        <li>
          <strong>Net accounts receivable</strong> — amounts owed by customers,
          preferably after allowances for expected credit losses. Slow or
          doubtful collections can overstate liquidity.
        </li>
      </ul>

      <h2
        id="excluded"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Assets Are Excluded From the Quick Ratio?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Inventory, prepaid expenses, and other current assets that are not
        readily available to meet short-term obligations are excluded from the
        acid-test numerator. Illiquid &quot;current&quot; items, restricted cash
        that cannot fund payables, and specialized receivables with long
        collection cycles may also deserve exclusion or separate analysis even
        when they appear in working capital. Do not double-subtract inventory or
        prepaid expenses when using the adjusted formula.
      </p>

      <h2
        id="factors"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Factors Affect a Company&apos;s Quick Ratio?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Receivables collection speed, short-term borrowing, cash management
        policy, inventory dependence, debt repayment schedules, seasonal sales,
        and working-capital changes all move the ratio. Drawing a revolver
        increases cash and current liabilities together; collecting AR raises cash
        while lowering receivables; paying suppliers reduces both cash and
        payables. Classification changes — for example, re-labeling a deposit as
        restricted — can alter the measured ratio without any operating change.
      </p>

      <h2
        id="importance"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Why Is the Quick Ratio Important?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The acid-test supports financial stability analysis, creditworthiness
        screening, supplier credit decisions, investment due diligence, working
        capital management, and internal liquidity monitoring. Lenders may
        compare the ratio across peers; managers may track it alongside days
        sales outstanding and cash forecasts. It does not replace the cash-flow
        statement, covenant packages, or qualitative review of customer
        concentration and contingent liabilities.
      </p>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations of the Quick Ratio
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>It is a point-in-time ratio from one balance sheet date.</li>
        <li>Accounts receivable may not be collected promptly or in full.</li>
        <li>The ratio does not show cash-flow timing within the operating cycle.</li>
        <li>Asset classification choices affect comparability across firms.</li>
        <li>Seasonal businesses can show wide swings between peak and trough.</li>
        <li>Industry comparisons require similar business models and accounting.</li>
        <li>
          Off-balance commitments and unused credit lines can change practical
          liquidity without moving the reported ratio.
        </li>
      </ul>

      <h2
        id="improve"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Can a Company Improve Its Quick Ratio?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Practical levers include accelerating receivables collection, maintaining
        adequate liquid reserves, managing the maturity profile of short-term
        liabilities, improving cash forecasting, and reducing unnecessary
        working-capital pressure. Selling excess inventory can help the current
        ratio more than the quick ratio until cash is realized. Maximizing the
        quick ratio is not always optimal — idle cash has an opportunity cost,
        and some industries operate efficiently with thinner liquid cushions when
        cash conversion is predictable.
      </p>

      <h2
        id="related"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related Calculators
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Explore{' '}
        <Link
          href="/tools/current-ratio-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Current Ratio
        </Link>
        ,{' '}
        <Link
          href="/tools/cash-ratio-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Cash Ratio
        </Link>
        ,{' '}
        <Link
          href="/tools/working-capital-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Working Capital
        </Link>
        ,{' '}
        <Link
          href="/tools/net-operating-working-capital-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Net Operating Working Capital
        </Link>
        ,{' '}
        <Link
          href="/tools/defensive-interval-ratio-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Defensive Interval Ratio
        </Link>
        ,{' '}
        <Link
          href="/tools/debt-to-asset-ratio-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Debt to Asset Ratio
        </Link>
        ,{' '}
        <Link
          href="/tools/debt-to-equity-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Debt to Equity
        </Link>
        ,{' '}
        <Link
          href="/tools/interest-coverage-ratio-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Interest Coverage Ratio
        </Link>
        ,{' '}
        <Link
          href="/tools/operating-cash-flow-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Operating Cash Flow
        </Link>
        , and{' '}
        <Link
          href="/tools/debt-service-coverage-ratio-calculator-dscr"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          DSCR
        </Link>
        .
      </p>

      <h2
        id="qr-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion items={[...QUICK_RATIO_FAQS]} />
      </div>
    </article>
  );
}
