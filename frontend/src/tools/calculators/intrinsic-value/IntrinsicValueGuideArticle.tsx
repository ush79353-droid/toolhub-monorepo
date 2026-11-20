import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { IV_FAQS } from './content';

export function IntrinsicValueGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Intrinsic Value?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Intrinsic value is an estimate of an asset&apos;s underlying economic
        worth based on assumptions about earnings, growth, risk, and other
        fundamentals. Market price can trade above or below that estimate for
        long periods. Valuation always involves uncertainty.
      </p>

      <h2
        id="how-to-calculate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate the Intrinsic Value of a Stock
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>V = EPS × (8.5 + 2g) × 4.4 ÷ Y</p>
        <p>EPS = earnings per share</p>
        <p>g = expected growth in percentage points (6 = 6%)</p>
        <p>Y = corporate bond yield in percentage points</p>
        <p>8.5 = historical no-growth P/E base · 4.4 = historical benchmark yield</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This is a simplified historical Graham heuristic. It is not the same as
        a discounted cash flow model and should not be treated as a definitive
        appraisal.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use the Online Intrinsic Value Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter earnings per share.</li>
        <li>Enter expected annual growth rate (percentage points).</li>
        <li>Enter corporate bond yield (percentage points).</li>
        <li>Optionally enter current market price.</li>
        <li>Review estimated intrinsic value.</li>
        <li>Review margin of safety when CMP is provided.</li>
      </ol>

      <h2
        id="margin-of-safety"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is the Margin of Safety?
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>MS = (V − CMP) ÷ V × 100</p>
        <p>Example: V $150 · CMP $100 → MS = 33.33%</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A positive margin means the market price is below the estimate. It does
        not guarantee a matching percentage profit.
      </p>

      <h2
        id="pick-stock"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use Intrinsic Value to Pick a Stock
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Estimates can support research by organizing assumptions about earnings
        and growth. Combine them with financial statement review, competitive
        analysis, and risk assessment. This tool does not recommend buying or
        selling any security.
      </p>

      <h2
        id="example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Example of Intrinsic Value Calculation
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>EPS = $5 · g = 6 · Y = 4.4 · CMP = $80</p>
        <p>V = 5 × (8.5 + 12) × 4.4 ÷ 4.4 = 5 × 20.5 = $102.50</p>
        <p>MS = (102.50 − 80) ÷ 102.50 × 100 ≈ 21.95%</p>
      </div>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations of Intrinsic Value Calculations
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Growth assumptions can be wrong</li>
        <li>Historical multiples may not fit current markets</li>
        <li>Corporate bond yields change over time</li>
        <li>Earnings quality affects EPS usefulness</li>
        <li>Cyclical businesses can have unstable earnings</li>
        <li>Negative earnings make this model unsuitable</li>
        <li>Intangibles and competitive advantages are not modeled explicitly</li>
        <li>The formula does not forecast free cash flow</li>
        <li>It does not replace full financial analysis</li>
        <li>Prices can stay misaligned with estimates for long periods</li>
      </ul>

      <h2
        id="iv-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion items={[...IV_FAQS]} />
      </div>
    </article>
  );
}
