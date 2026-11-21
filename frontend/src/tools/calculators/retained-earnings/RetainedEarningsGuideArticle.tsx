import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { RETAINED_EARNINGS_FAQS } from './content';

export function RetainedEarningsGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-are-re"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Are Retained Earnings?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Retained earnings are profits kept in the business after dividends.
        This calculator measures the current-period contribution: net income
        minus dividends. Cumulative retained earnings also need a beginning
        balance.
      </p>

      <h2
        id="definition"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Retained Earnings Definition
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        On the balance sheet, retained earnings accumulate over time. On this
 page, the primary result is period retention; not the full equity
        account unless beginning RE is known.
      </p>

      <h2
        id="net-income"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is Net Income?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Net income is profit after expenses, interest, and taxes. Do not
        substitute revenue, gross profit, EBIT, or EBITDA.
      </p>

      <h2
        id="dividends"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Are Dividends?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Dividends distribute value to shareholders and reduce retained
        earnings for the period.
      </p>

      <h2
        id="payout-ratio"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is the Dividend Payout Ratio?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The share of positive net income paid as dividends. Enter 30 for 30%
        (internally 0.30). The conventional ratio is not meaningful for zero or
        negative earnings.
      </p>

      <h2
        id="payout-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Dividend Payout Ratio Formula
      </h2>
      <div className="my-4 rounded-xl border border-border bg-muted/30 p-4 font-mono text-xs text-accent sm:text-sm">
        Payout Ratio = Dividends ÷ Net Income × 100
      </div>

      <h2
        id="retention"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Retention Ratio Formula
      </h2>
      <div className="my-4 rounded-xl border border-border bg-muted/30 p-4 font-mono text-xs text-accent sm:text-sm">
        Retention % = 100 − Dividend Payout %
      </div>

      <h2
        id="period-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Retained Earnings Formula
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs text-accent sm:text-sm">
        Current-Period RE = Net Income − Dividends
      </div>

      <h2
        id="cumulative"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Cumulative Retained Earnings Formula
      </h2>
      <div className="my-4 rounded-xl border border-border bg-muted/30 p-4 font-mono text-xs text-accent sm:text-sm">
        Ending RE = Beginning RE + Net Income − Dividends
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Example: Beginning $2,000,000 + NI $500,000 − Dividends $150,000 =
        Ending <strong>$2,350,000</strong>. Beginning RE is not a default field
 here; do not assume it is zero.
      </p>

      <h2
        id="how-to-calculate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Retained Earnings
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter net income (earnings).</li>
        <li>Enter the dividend payout ratio for positive earnings.</li>
        <li>Review dividends distributed.</li>
        <li>Review current-period retained earnings.</li>
        <li>Optionally enter shares for RE per share.</li>
      </ol>

      <h2
        id="worked-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Retained Earnings Calculation Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Company Alpha: NI $1,000,000; payout 30%; shares 50,000. Dividends ={' '}
        <strong>$300,000</strong>; RE = <strong>$700,000</strong>; REPS ={' '}
        <strong>$14</strong>.
      </p>

      <h2
        id="reps"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is Retained Earnings per Share?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Period retained earnings allocated across outstanding shares. It is
        not EPS and not market price per share.
      </p>

      <h2
        id="reps-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Retained Earnings per Share Formula
      </h2>
      <div className="my-4 rounded-xl border border-border bg-muted/30 p-4 font-mono text-xs text-accent sm:text-sm">
        REPS = Retained Earnings ÷ Outstanding Shares
      </div>

      <h2
        id="vs-ni"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Retained Earnings vs. Net Income
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Net income is earned; retained earnings keep what remains after
        dividends.
      </p>

      <h2
        id="vs-revenue"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Retained Earnings vs. Revenue
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Revenue is top-line sales. Retained earnings sit far below after costs
        and distributions.
      </p>

      <h2
        id="vs-cash"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Retained Earnings vs. Cash
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
 High RE does not mean high cash; profits may be invested in other
        assets.
      </p>

      <h2
        id="vs-equity"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Retained Earnings vs. Shareholders’ Equity
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        RE is one equity component alongside capital stock and other reserves.
      </p>

      <h2
        id="vs-eps"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Retained Earnings vs. Earnings per Share
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        EPS uses earnings attributable to common shares; REPS uses period
        retained earnings after dividends.
      </p>

      <h2
        id="vs-dividends"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Retained Earnings vs. Dividends
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Dividends reduce period RE dollar-for-dollar when paid from earnings.
      </p>

      <h2
        id="positive"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Positive Retained Earnings
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Indicate some earnings were kept for reinvestment or reserves during
        the period.
      </p>

      <h2
        id="negative"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Negative Retained Earnings
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Can arise from losses or payouts above 100% of current earnings. A
        negative period result is not automatically a calculation error.
      </p>

      <h2
        id="zero"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Can Retained Earnings Be Zero?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Yes for the period when all earnings are paid as dividends (100%
        payout).
      </p>

      <h2
        id="good-balance"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is a Good Retained Earnings Balance?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
 No universal benchmark; compare strategy, industry, and dividend
        policy.
      </p>

      <h2
        id="growth"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Retained Earnings and Business Growth
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Retained profits can finance growth without new equity issuance when
        cash and opportunities align.
      </p>

      <h2
        id="reinvestment"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Retained Earnings and Reinvestment
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Firms reinvest into operations, equipment, R&D, and working capital.
      </p>

      <h2
        id="policies"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Retained Earnings and Dividend Policies
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Management balances shareholder distributions against internal funding
        needs.
      </p>

      <h2
        id="small-business"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Retained Earnings in Small Businesses
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Owner draws and reinvestment decisions strongly shape period retention.
      </p>

      <h2
        id="corporations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Retained Earnings in Large Corporations
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Capital allocation committees set payout and retention targets across
        cycles.
      </p>

      <h2
        id="statements"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Retained Earnings in Financial Statements
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Reported in equity and reconciled through the statement of retained
        earnings or changes in equity.
      </p>

      <h2
        id="statement-of-re"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Statement of Retained Earnings
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Typically shows beginning RE, net income or loss, dividends,
        adjustments, and ending RE.
      </p>

      <h2
        id="roe"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Retained Earnings and Return on Equity
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
 Higher RE raises equity and can change ROE; higher RE alone does not
        guarantee better returns.
      </p>

      <h2
        id="roi"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Retained Earnings and Return on Investment
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Reinvestment quality matters more than the accounting residual alone.
      </p>

      <h2
        id="stability"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Retained Earnings and Financial Stability
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Accumulated profits can support flexibility, but liquidity and leverage
        still matter.
      </p>

      <h2
        id="mistakes"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Common Retained Earnings Calculation Mistakes
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Using revenue or EBIT instead of net income</li>
        <li>Treating 30% as 0.30%</li>
        <li>Treating a blank payout as 0%</li>
        <li>Applying payout % to net losses</li>
        <li>Assuming RE equals cash</li>
        <li>Confusing period RE with cumulative RE</li>
        <li>Confusing REPS with EPS</li>
        <li>Dividing by zero shares</li>
      </ul>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations of Retained Earnings Calculations
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Period RE is not cash, not market value, and not cumulative without
        beginning RE. Payout ratios need positive earnings. Educational use
 only; not personalized financial advice.
      </p>

      <h2
        id="re-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion faqs={[...RETAINED_EARNINGS_FAQS]} />
      </div>
    </article>
  );
}
