import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { ACCRUAL_RATIO_FAQS } from './content';

export function AccrualRatioGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-accrual-ratio"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is the Accrual Ratio?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        An accrual ratio measures how large accounting accruals are relative to
        average net operating assets. Analysts use it when comparing reported
        earnings with cash generation and operating capital. Balance-sheet and
        cash-flow approaches both quantify accruals, but they use different
        numerators and can disagree.
      </p>

      <h2
        id="balance-sheet-method"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Balance Sheet Accrual Ratio
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        Balance Sheet Accrual Ratio = Change in NOA / Average NOA
        <br />
        NOA = Operating Assets − Operating Liabilities
        <br />
        Average NOA = (Beginning NOA + Ending NOA) / 2
      </div>

      <h2
        id="cash-flow-method"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Cash Flow Accrual Ratio
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        Cash Flow Accrual Ratio = (Net Income − Operating Cash Flow) / Average
        NOA
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This method focuses on the earnings–cash gap scaled by average operating
        capital. It is not a substitute for the balance-sheet formula.
      </p>

      <h2
        id="how-to-calculate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate the Accrual Ratio
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter beginning operating assets and liabilities → beginning NOA.</li>
        <li>Enter ending operating assets and liabilities → ending NOA.</li>
        <li>Average the beginning and ending NOA.</li>
        <li>
          Choose the numerator: change in NOA, or net income minus operating
          cash flow.
        </li>
        <li>Divide by average NOA (when nonzero) and interpret in context.</li>
      </ol>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Worked example: beginning NOA $3,000,000, ending NOA $3,500,000 →
        average $3,250,000, change $500,000 → balance-sheet ratio ≈{' '}
        <strong>15.38%</strong>.
      </p>

      <h2
        id="earnings-quality"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Apply the Accrual Ratio to Analyze Earnings Quality
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Earnings can diverge from operating cash flow because of working-capital
        changes and noncash items. Accruals may reverse later. One ratio is not
 enough; review trends, peers, policies, and cash-flow statements
        together.
      </p>

      <h2
        id="operating-assets-liabilities"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Operating Assets and Operating Liabilities
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Classification choices drive NOA. Financing assets and liabilities are
        generally treated separately under common net-operating-asset
        frameworks. Consistent classification across periods is essential.
      </p>

      <h2
        id="accrual-vs-cash"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Accrual Accounting vs. Cash Accounting
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Accrual accounting recognizes revenues and expenses when earned or
        incurred. Cash accounting records receipts and payments when cash moves.
        Timing differences and noncash transactions create accruals.
      </p>

      <h2
        id="positive-vs-negative"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Positive vs. Negative Accrual Ratio
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Positive ratios indicate positive measured accruals relative to average
        NOA; negative ratios indicate the opposite. There is no universal
        good/bad threshold that fits every industry or reporting period.
      </p>

      <h2
        id="vs-ocf-ratio"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Accrual Ratio vs. Operating Cash Flow Ratio
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Accrual ratios focus on earnings–accrual intensity versus operating
        capital. Operating cash-flow coverage ratios focus on liquidity or cash
        generation relative to obligations. They answer different questions.
      </p>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations of the Accrual Ratio
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Results depend on classifications, nonrecurring items, acquisitions,
        currency translation, policy changes, industry norms, and denominator
 sign or near-zero values. This tool is educational; not investment or
        audit advice.
      </p>

      <div id="accrual-ratio-faq" className="mt-10">
        <h2 className="text-lg font-bold tracking-tight text-accent sm:text-xl">
          Frequently Asked Questions
        </h2>
        <div className="mt-4">
          <FAQAccordion items={[...ACCRUAL_RATIO_FAQS]} />
        </div>
      </div>
    </article>
  );
}
