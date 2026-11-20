import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { GRAHAM_FAQS } from './content';

export function GrahamNumberGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is the Graham Number?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The Graham Number is a traditional stock-screening heuristic associated
        with Benjamin Graham&apos;s value-investing approach. It combines
        earnings per share and book value per share into a single per-share
        figure. It is not a comprehensive intrinsic-value model.
      </p>

      <h2
        id="benjamin-graham"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Benjamin Graham and Value Investing
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Graham emphasized buying securities with a margin of safety relative to
        estimated value. The Graham Number is one simplified expression of that
        screening mindset using historical earnings and book-value benchmarks.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Graham Number Formula
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>GN = √(22.5 × EPS × BVPS)</p>
        <p>22.5 = 15 × 1.5 (traditional P/E × P/B benchmarks)</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Positive EPS and BVPS are required. Do not treat the result as a
        standalone investment decision.
      </p>

      <h2
        id="how-to-calculate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Graham Number
      </h2>
      <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter book value per share (or derive it from equity and shares).</li>
        <li>Enter earnings per share (or derive it from income and shares).</li>
        <li>Compute √(22.5 × EPS × BVPS).</li>
        <li>Optionally enter the current price to compare.</li>
        <li>Review the price difference relative to the Graham Number.</li>
      </ol>

      <h2
        id="examples"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Real-Life Graham Number Examples
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Company Alpha: EPS $6 · BVPS $25 · Price $50</p>
        <p>GN = √(22.5 × 6 × 25) = √3375 ≈ $58.09</p>
        <p>Price is below GN · difference ≈ 13.93% vs GN</p>
        <p>Classic screen: EPS $5 · BVPS $20 → GN ≈ $47.43</p>
      </div>

      <h2
        id="intrinsic-value"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Graham Number and Intrinsic Value
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Intrinsic value estimates usually require cash-flow projections, risk
        assessment, and competitive analysis. The Graham Number is a shortcut
        screen, not a substitute for that work.
      </p>

      <h2
        id="interpret"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Interpret Graham Number
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A market price below the Graham Number may be described as potentially
        undervalued relative to this formula. A price above it trades above the
        screen. Neither outcome guarantees future returns.
      </p>

      <h2
        id="margin-of-safety"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Graham Number and Margin of Safety
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Margin of safety is the gap between estimated value and purchase price.
        The Graham Number can help frame that gap for screening, but estimated
        intrinsic value and risk still need independent judgment.
      </p>

      <h2
        id="vs-market"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Graham Number vs. Market Price
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Compare current price P with GN. Price difference vs GN = (GN − P) / GN
        × 100. Upside vs price = (GN − P) / P × 100. These are arithmetic
        comparisons, not predicted returns.
      </p>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations of Graham Number
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Zero or negative earnings break the positive formula</li>
        <li>Negative book value is incompatible with the standard screen</li>
        <li>Asset-light businesses may be poorly represented by book value</li>
        <li>Industry accounting and capital intensity vary widely</li>
        <li>15× and 1.5× benchmarks are historical, not universal</li>
        <li>Growth, debt risk, and earnings quality are not modeled directly</li>
        <li>Accounting policies can distort reported EPS and equity</li>
      </ul>

      <h2
        id="when-not"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        When the Graham Number Is Not Appropriate
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Skip or heavily discount the screen for loss-making firms, negative
        equity, many financial institutions, and businesses whose value is
        driven mainly by intangibles or high expected growth.
      </p>

      <h2
        id="gn-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion items={[...GRAHAM_FAQS]} />
      </div>
    </article>
  );
}
