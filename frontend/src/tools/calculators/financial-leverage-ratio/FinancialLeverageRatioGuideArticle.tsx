import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { FINANCIAL_LEVERAGE_RATIO_FAQS } from './content';

export function FinancialLeverageRatioGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-fl"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is the Financial Leverage Ratio?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        In this calculator, the financial leverage ratio is the{' '}
        <strong>equity multiplier</strong>: Total Assets ÷ Total Equity. It shows
        how many dollars of assets are supported by each dollar of book equity.
        Other sources may use “financial leverage” for debt-to-equity or
        debt-to-assets — those are different metrics.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Financial Leverage Ratio Formula
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        Financial Leverage = Total Assets / Total Equity
      </div>

      <h2
        id="total-assets"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Total Assets
      </h2>
      <div className="my-4 rounded-xl border border-border bg-muted/30 p-4 font-mono text-xs text-accent sm:text-sm">
        Total Assets = Current Assets + Non-Current Assets
      </div>

      <h2
        id="how-to-calculate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Financial Leverage
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Identify current and non-current assets; sum to total assets.</li>
        <li>Identify total equity from the same balance-sheet date.</li>
        <li>Divide total assets by total equity.</li>
        <li>If equity is zero, the ratio is undefined.</li>
        <li>If equity is negative, show the signed ratio with a warning.</li>
        <li>Interpret with industry, debt structure, and coverage context.</li>
      </ol>

      <h2
        id="worked-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Complete Financial Leverage Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Current assets 300,000 + Non-current 1,000,000 = Total assets 1,300,000.
        Equity 500,000 → Financial leverage = 1,300,000 / 500,000 ={' '}
        <strong>2.60×</strong>.
      </p>

      <h2
        id="interpret"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Interpret Financial Leverage
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <strong>1.00×:</strong> Assets equal equity — typically no liabilities
          under a standard nonnegative-liability balance sheet.
        </li>
        <li>
          <strong>Above 1:</strong> Assets exceed equity; some liability financing
          is present.
        </li>
        <li>
          <strong>Very high:</strong> Small equity base relative to assets —
          greater financial risk potential.
        </li>
        <li>
          <strong>Negative:</strong> Usually negative equity; conventional
          thresholds do not apply.
        </li>
        <li>
          <strong>Undefined:</strong> Zero equity — do not divide.
        </li>
      </ul>

      <h2
        id="good-ratio"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is a Good Financial Leverage Ratio?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        There is no universal “good” multiplier. Compare with industry peers,
        asset intensity, debt maturity, liquidity, and earnings stability.
      </p>

      <h2
        id="vs-dte"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Financial Leverage vs. Debt-to-Equity Ratio
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Debt-to-equity uses debt (or liabilities) over equity. The equity
        multiplier uses assets over equity. Interest-bearing debt-to-equity can
        differ from liabilities-to-equity.
      </p>

      <h2
        id="vs-equity-ratio"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Financial Leverage vs. Equity Ratio
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Equity Ratio = Equity / Assets. When both are positive and nonzero,
        Equity Multiplier = 1 / Equity Ratio (decimal form).
      </p>

      <h2
        id="vs-debt-ratio"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Financial Leverage vs. Debt Ratio
      </h2>
      <div className="my-4 rounded-xl border border-border bg-muted/30 p-4 font-mono text-xs text-accent sm:text-sm">
        Debt Ratio = Total Liabilities / Total Assets
      </div>
      <p className="text-sm leading-relaxed text-foreground/90 sm:text-base">
        Some definitions use interest-bearing debt instead of total liabilities.
      </p>

      <h2
        id="roe"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Financial Leverage and ROE
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        DuPont: ROE ≈ Net Profit Margin × Asset Turnover × Equity Multiplier.
        Period averages are often used for assets and equity in ROE analysis;
        this calculator uses the balances you enter (typically one reporting date).
      </p>

      <h2
        id="advantages"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Advantages of Financial Leverage
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Liability financing can support larger asset bases and amplify equity
        returns when returns exceed financing costs — with corresponding risk.
      </p>

      <h2
        id="risks"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Risks of High Financial Leverage
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Debt service, refinancing, interest-rate exposure, earnings volatility,
        liquidity strain, and reduced flexibility can accompany high leverage.
      </p>

      <h2
        id="negative"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Can Financial Leverage Be Negative?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Yes, when equity is negative. Do not treat a more negative multiplier as
        lower risk than a moderate positive one.
      </p>

      <h2
        id="mistakes"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Common Financial Leverage Calculation Mistakes
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Confusing equity multiplier with debt-to-equity.</li>
        <li>Using revenue instead of total assets.</li>
        <li>Dividing by zero equity or ignoring negative equity.</li>
        <li>Mixing currencies or reporting dates.</li>
        <li>Assuming universal “good” or “bad” thresholds.</li>
      </ul>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations of the Financial Leverage Ratio
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Book values, maturity structure, interest coverage, liquidity, and
        off-balance-sheet items are not fully captured. Related:{' '}
        <Link
          href="/tools/degree-of-operating-leverage-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Degree of Operating Leverage
        </Link>
        . Educational estimates only — not accounting or investment advice.
      </p>

      <h2
        id="flr-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="not-prose mt-4">
        <FAQAccordion items={[...FINANCIAL_LEVERAGE_RATIO_FAQS]} />
      </div>
    </article>
  );
}
