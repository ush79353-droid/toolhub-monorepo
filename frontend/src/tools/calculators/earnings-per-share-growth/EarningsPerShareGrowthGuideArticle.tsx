import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { EPS_GROWTH_FAQS } from './content';

export function EarningsPerShareGrowthGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-are-eps"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Are Earnings per Share?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Earnings per share is the portion of a company&apos;s profit attributable
        to each weighted-average common share. Basic EPS subtracts preferred
        dividends from net income, then divides by weighted-average common
        shares. Diluted EPS can include potentially dilutive securities. EPS
        helps investors evaluate profitability; comparing EPS across periods
        shows how earnings performance changed.
      </p>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>EPS = (Net Income − Preferred Dividends)</p>
        <p>÷ Weighted-Average Common Shares</p>
      </div>

      <h2
        id="how-to-find"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Find Earnings per Share
      </h2>
      <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Obtain net income.</li>
        <li>Determine preferred dividends.</li>
        <li>Subtract preferred dividends from net income.</li>
        <li>Determine weighted-average common shares.</li>
        <li>Divide earnings available to common shareholders by shares.</li>
      </ol>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Net income $10,000,000 · Preferred $500,000 · Shares 2,000,000</p>
        <p>EPS = 9,500,000 ÷ 2,000,000 = $4.75/share</p>
      </div>

      <h2
        id="what-is-growth"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is EPS Growth?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        EPS growth measures how earnings per share changed between two reporting
        periods. It can reflect rising or falling profitability, share
        repurchases, and changes in outstanding shares. EPS can grow even when
        net income is flat if the weighted-average share count falls.
      </p>

      <h2
        id="growth-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate EPS Growth
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Growth (%) = (Final EPS − Initial EPS) ÷ Initial EPS × 100</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The standard percentage interpretation assumes a positive initial EPS.
        Example: $2.50 → $4.00 is 60% total growth. A decline from $5.00 to
        $4.00 is −20%.
      </p>

      <h2
        id="what-is-cagr"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is EPS CAGR, Also Known as EPS Growth Rate?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        CAGR is the constant compounded per-period rate that would turn initial
        EPS into final EPS over n periods. It smooths the path between endpoints
        and does not show year-to-year volatility.
      </p>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>CAGR = (Final EPS ÷ Initial EPS)^(1/n) − 1</p>
      </div>

      <h2
        id="how-cagr"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate EPS Growth Rate
      </h2>
      <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Find EPS at the beginning of the period.</li>
        <li>Find EPS at the end.</li>
        <li>Determine the number of elapsed periods.</li>
        <li>Divide final EPS by initial EPS.</li>
        <li>Raise the result to the power of 1 ÷ n.</li>
        <li>Subtract one.</li>
        <li>Multiply by 100 for a percentage.</li>
      </ol>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>$2.50 → $4.00 over 3 periods</p>
        <p>(4 ÷ 2.5)^(1/3) − 1 ≈ 16.99% per period</p>
      </div>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use the Earnings Per Share Growth Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter the initial EPS.</li>
        <li>Enter the final EPS.</li>
        <li>Review total EPS growth.</li>
        <li>Enter the number of elapsed periods.</li>
        <li>Review the annualized EPS growth rate.</li>
        <li>Interpret whether EPS increased or decreased.</li>
        <li>Compare results with other financial indicators.</li>
      </ol>

      <h2
        id="examples"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Worked EPS Growth Examples
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Positive: $2.50 → $4.00 · 3 yrs → 60% total · ≈16.99% CAGR</p>
        <p>Decline: $5.00 → $4.00 · 2 yrs → −20% total · ≈−10.56% CAGR</p>
        <p>Zero final: $2.00 → $0.00 · 3 yrs → −100% total and CAGR</p>
      </div>

      <h2
        id="applications"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Applications of EPS Growth
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Profitability trends and earnings quality checks</li>
        <li>Share-buyback effects on per-share results</li>
        <li>Industry comparisons and multi-period reviews</li>
        <li>Valuation context alongside P/E and other ratios</li>
      </ul>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        EPS growth alone does not guarantee positive investment returns.
      </p>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations of EPS Growth
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Based on accounting earnings, not cash flow alone</li>
        <li>Buybacks and one-time gains can distort growth</li>
        <li>Negative EPS complicates percentage comparisons</li>
        <li>CAGR hides intermediate volatility</li>
        <li>Past growth does not guarantee future growth</li>
        <li>Basic and diluted EPS can produce different growth figures</li>
      </ul>

      <h2
        id="epsg-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion items={[...EPS_GROWTH_FAQS]} />
      </div>
    </article>
  );
}
