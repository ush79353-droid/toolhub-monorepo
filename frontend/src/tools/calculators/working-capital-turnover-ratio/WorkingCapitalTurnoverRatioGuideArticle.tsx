import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { WORKING_CAPITAL_TURNOVER_RATIO_FAQS } from './content';

export function WorkingCapitalTurnoverRatioGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-wctr"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is the Working Capital Turnover Ratio?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The working capital turnover ratio shows how efficiently a company uses
        its average working capital to generate revenue during a reporting
 period. Higher values generally mean more sales per unit of WC; not
        automatically higher profit.
      </p>

      <h2
        id="meaning"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Working Capital Turnover Ratio Meaning
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A ratio of 10.00x means about 10 units of revenue were generated for
        each 1 unit of average working capital. Use it to study operational
        efficiency alongside liquidity and cash-conversion metrics.
      </p>

      <h2
        id="what-is-wc"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is Working Capital?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Working capital is current assets minus current liabilities. It measures
        short-term operating liquidity available for day-to-day activities.
      </p>

      <h2
        id="current-assets"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Are Current Assets?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Current assets are expected to convert to cash, sell, or be consumed
 within the operating cycle or about one year; cash, receivables,
        inventory, short-term investments, and prepaid expenses, among others.
      </p>

      <h2
        id="current-liabilities"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Are Current Liabilities?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Current liabilities are obligations due within the operating cycle or
 about one year; payables, short-term loans, accruals, and the current
        portion of long-term debt.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Working Capital Turnover Formula
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>WCT = Revenue / Average Working Capital</p>
        <p>Average WC = Average CA − Average CL</p>
      </div>

      <h2
        id="avg-ca"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Average Current Assets
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>ACA = (Opening CA + Closing CA) / 2</p>
      </div>

      <h2
        id="avg-cl"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Average Current Liabilities
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>ACL = (Opening CL + Closing CL) / 2</p>
      </div>

      <h2
        id="avg-wc"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Average Working Capital
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>AWC = ACA − ACL</p>
      </div>

      <h2
        id="how-to-calculate-turnover"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Working Capital Turnover
      </h2>
      <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Average opening and closing current assets.</li>
        <li>Average opening and closing current liabilities.</li>
        <li>Subtract average CL from average CA.</li>
        <li>Divide period revenue by average WC when AWC ≠ 0.</li>
      </ol>

      <h2
        id="worked-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Working Capital Turnover Ratio Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Company Alpha · Revenue = $3,500,000</p>
        <p>Opening/Closing CA = $500,000 / $700,000 → ACA = $600,000</p>
        <p>Opening/Closing CL = $200,000 / $300,000 → ACL = $250,000</p>
        <p>AWC = $350,000 · WCT = 10.00x</p>
      </div>

      <h2
        id="interpret"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Interpret Working Capital Turnover
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Higher turnover can indicate efficient use of WC relative to sales.
        Lower turnover can indicate surplus WC or slow conversion of inventory
        and receivables. Always interpret against industry norms.
      </p>

      <h2
        id="good-ratio"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is a Good Working Capital Turnover Ratio?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Ideal levels differ by industry and business model. Retail may show
        different patterns than manufacturing or services. Prefer peer and trend
        comparisons over a single absolute target.
      </p>

      <h2
        id="high-low"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        High vs. Low Working Capital Turnover
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
 High turnover can mean lean WC, or stretched liquidity. Low turnover
        can mean excess WC investment or a naturally WC-heavy model. Pair with
        the current ratio and cash conversion cycle.
      </p>

      <h2
        id="negative"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Negative Working Capital Turnover Ratio
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        When average WC is negative, the mathematical ratio can be negative.
        Some high-turnover businesses operate with negative WC; treat the signed
        result carefully and do not auto-label it as poor performance.
      </p>

      <h2
        id="vs-wc-ratio"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Working Capital Turnover vs. Working Capital Ratio
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The working capital (current) ratio is CA ÷ CL. Turnover divides revenue
        by average WC. One measures coverage; the other measures efficiency.
      </p>

      <h2
        id="vs-inventory"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Working Capital Turnover vs. Inventory Turnover
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Inventory turnover typically uses COGS and average inventory. Working
        capital turnover uses revenue and average WC across all current assets
        and liabilities.
      </p>

      <h2
        id="vs-asset"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Working Capital Turnover vs. Asset Turnover
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Total asset turnover uses average total assets. Working capital turnover
        focuses on the net current-asset cushion supporting operations.
      </p>

      <h2
        id="cash-flow"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Working Capital Turnover and Cash Flow
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Faster conversion of receivables and inventory into cash can raise
        turnover and free cash. Growth that expands WC faster than sales can
        lower turnover and absorb cash.
      </p>

      <h2
        id="improve"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Improve Working Capital Turnover
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Tighten collections, manage inventory, negotiate payable terms without
        damaging supply, and grow revenue without proportional WC expansion.
      </p>

      <h2
        id="mistakes"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Common Calculation Mistakes
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Using ending WC instead of average WC</li>
        <li>Mixing reporting periods</li>
        <li>Treating blank inputs as zero</li>
        <li>Using net income instead of revenue</li>
        <li>Dividing by zero average WC</li>
      </ul>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations of Working Capital Turnover
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Industry differences, seasonality, accounting classifications, and
        negative WC models limit single-ratio conclusions. Calculate monthly,
 quarterly, or annually, but keep definitions consistent.
      </p>

      <h2
        id="wctr-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...WORKING_CAPITAL_TURNOVER_RATIO_FAQS]} />
      </div>
    </article>
  );
}
