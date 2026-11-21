import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { NET_INCOME_FAQS } from './content';

export function NetIncomeGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-ni"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Net Income?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Net income — also called net profit, net earnings, or the bottom line —
        is what remains after a business deducts cost of sales, operating
        expenses, interest, and income taxes from revenue under a stated
        reporting model. It is a core profitability measure, but it is not the
        same as cash flow.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Net Income Formula
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        Net Income = Revenue − COGS − Operating Expenses − Interest − Taxes
      </div>

      <h2
        id="how-to-calculate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Net Income
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter revenue for the period.</li>
        <li>Enter cost of sales and compute gross profit.</li>
        <li>Enter operating expenses and compute operating income.</li>
        <li>Subtract interest to get earnings before tax.</li>
        <li>Apply the tax rate to positive EBT for estimated taxes.</li>
        <li>Subtract taxes from EBT to get net income after taxes.</li>
      </ol>

      <h2
        id="gross-profit"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Gross Profit Calculation
      </h2>
      <div className="my-4 rounded-xl border border-border bg-muted/30 p-4 font-mono text-xs text-accent sm:text-sm">
        Gross Profit = Revenue − Cost of Sales
      </div>

      <h2
        id="operating-income"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Operating Income Calculation
      </h2>
      <div className="my-4 rounded-xl border border-border bg-muted/30 p-4 font-mono text-xs text-accent sm:text-sm">
        Operating Income = Gross Profit − Operating Expenses
      </div>

      <h2
        id="ebt"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Earnings Before Tax
      </h2>
      <div className="my-4 rounded-xl border border-border bg-muted/30 p-4 font-mono text-xs text-accent sm:text-sm">
        EBT = Operating Income − Interest
      </div>

      <h2
        id="income-tax"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Income Tax Calculation
      </h2>
      <div className="my-4 rounded-xl border border-border bg-muted/30 p-4 font-mono text-xs text-accent sm:text-sm">
        Estimated Taxes = max(EBT, 0) × (Tax Rate ÷ 100)
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This is a simplified effective-rate estimate. It is not a legal tax
        determination and does not invent a refund when EBT is negative.
      </p>

      <h2
        id="niat"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Net Income After Tax
      </h2>
      <div className="my-4 rounded-xl border border-border bg-muted/30 p-4 font-mono text-xs text-accent sm:text-sm">
        Net Income = EBT − Taxes
      </div>

      <h2
        id="worked-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Complete Net Income Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Company Alpha: Revenue $500,000; COGS $200,000; OpEx $100,000; Interest
        $20,000; tax 25%. Gross profit $300,000; operating income $200,000; EBT
        $180,000; taxes $45,000; net income <strong>$135,000</strong>; net
        margin <strong>27%</strong>.
      </p>

      <h2
        id="vs-gross"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Net Income vs. Gross Profit
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Gross profit covers only direct cost of sales. Net income also reflects
        operating costs, financing, and taxes.
      </p>

      <h2
        id="vs-operating"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Net Income vs. Operating Income
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Operating income measures core operations. Net income continues past
        interest and taxes to the bottom line.
      </p>

      <h2
        id="vs-ebit"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Net Income vs. EBIT
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        In this simplified layout, operating income is EBIT-like. Net income
        subtracts interest and taxes from that operating result.
      </p>

      <h2
        id="vs-ebitda"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Net Income vs. EBITDA
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        EBITDA typically starts from operating earnings and adds back D&amp;A.
        Net income is after interest and taxes and does not add D&amp;A back.
      </p>

      <h2
        id="vs-revenue"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Net Income vs. Revenue
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        High revenue does not guarantee profit. Cost structure and taxes
        determine the bottom line.
      </p>

      <h2
        id="vs-cash"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Net Income vs. Cash Flow
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Accrual timing, working capital, and financing/investing cash flows can
        make cash generation differ from reported net income.
      </p>

      <h2
        id="margin"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is Net Profit Margin?
      </h2>
      <div className="my-4 rounded-xl border border-border bg-muted/30 p-4 font-mono text-xs text-accent sm:text-sm">
        Net Profit Margin = (Net Income ÷ Revenue) × 100
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        For Company Alpha: 135,000 ÷ 500,000 × 100 = 27%. Undefined when revenue
        is zero.
      </p>

      <h2
        id="why-matters"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Why Net Income Matters
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Investors, lenders, and managers use net income to assess performance,
        plan distributions, and compare periods — always alongside cash flow and
        balance-sheet strength.
      </p>

      <h2
        id="improve"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Improve Net Income
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Grow profitable revenue and pricing discipline</li>
        <li>Reduce cost of sales and waste</li>
        <li>Control operating expenses</li>
        <li>Manage financing costs</li>
        <li>Plan taxes within applicable rules</li>
      </ul>

      <h2
        id="negative"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Causes Negative Net Income?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Losses arise when costs and taxes exceed revenue — from weak sales, high
        COGS, heavy overhead, interest burden, or investment/expansion phases.
      </p>

      <h2
        id="income-statement"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Read an Income Statement
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Follow the cascade: revenue → COGS → gross profit → operating expenses →
        operating income → interest → EBT → taxes → net income.
      </p>

      <h2
        id="financial-statements"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Net Income in Financial Statements
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Net income appears as the final result on the income statement for the
        reporting period and typically flows into equity via retained earnings.
      </p>

      <h2
        id="retained"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Net Income and Retained Earnings
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Profits generally increase retained earnings; dividends and certain
        adjustments reduce them.
      </p>

      <h2
        id="valuation"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Net Income and Business Valuation
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Earnings-based multiples often start from net income or related earnings
        measures, adjusted for sustainability and accounting policy.
      </p>

      <h2
        id="roe"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Net Income and Return on Equity
      </h2>
      <div className="my-4 rounded-xl border border-border bg-muted/30 p-4 font-mono text-xs text-accent sm:text-sm">
        ROE = (Net Income ÷ Average Shareholders&apos; Equity) × 100
      </div>

      <h2
        id="eps"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Net Income and Earnings Per Share
      </h2>
      <div className="my-4 rounded-xl border border-border bg-muted/30 p-4 font-mono text-xs text-accent sm:text-sm">
        Basic EPS ≈ (Net Income − Preferred Dividends) ÷ Weighted Avg Common
        Shares
      </div>

      <h2
        id="mistakes"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Common Net Income Calculation Mistakes
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Confusing revenue with profit</li>
        <li>Double-counting expenses across COGS and OpEx</li>
        <li>Multiplying by 25 instead of 0.25 for a 25% tax rate</li>
        <li>Assuming a pretax loss creates an automatic tax refund</li>
        <li>Mixing currencies or reporting periods</li>
        <li>Rounding intermediate steps before final net income</li>
      </ul>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations of the Net Income Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This tool uses a simplified income-statement model and an estimated
        effective tax rate. It does not apply jurisdiction-specific tax law,
        deferred taxes, or every non-operating adjustment. Educational use only
        — not personalized financial, tax, or accounting advice.
      </p>

      <h2
        id="ni-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion faqs={[...NET_INCOME_FAQS]} />
      </div>
    </article>
  );
}
