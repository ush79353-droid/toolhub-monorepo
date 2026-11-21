import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { PEG_FAQS } from './content';

export function PegRatioGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is PEG Ratio? The PEG Ratio Meaning
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        PEG stands for price/earnings-to-growth. It extends the P/E ratio by
        relating that multiple to an earnings growth rate, so valuation is
        viewed alongside expected growth rather than in isolation. It is widely
        used as a screening aid, with clear limits: growth estimates can be
        wrong, and PEG ignores many other fundamental factors.
      </p>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>PEG = (P/E) ÷ Earnings growth rate (%)</p>
        <p>Use growth in percentage points (4.8 for 4.8%), not 0.048</p>
      </div>

      <h2
        id="how-to-calculate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Do We Calculate the PEG Ratio?
      </h2>
      <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Find the current stock price.</li>
        <li>Determine EPS (enter it directly or derive from net earnings ÷ shares).</li>
        <li>Calculate P/E = price ÷ EPS.</li>
        <li>Estimate earnings growth % (here: retention % × ROE % ÷ 100).</li>
        <li>Divide P/E by growth expressed in percentage points.</li>
      </ol>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Price 250 · Net earnings 15,500,000 · Shares 1,000,000 → EPS 15.50</p>
        <p>P/E = 250 / 15.50 ≈ 16.1290</p>
        <p>Retention 60% · ROE 8% → g = (60 × 8) / 100 = 4.8%</p>
        <p>PEG = 16.1290 / 4.8 ≈ 3.3602</p>
      </div>

      <h2
        id="good-peg"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is a Good PEG Ratio?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Common heuristics: PEG below 1 may look inexpensive versus growth; near
        1 roughly aligned; above 1 relatively rich. These are not universal
        investment rules. Industry norms, growth reliability, profitability,
        leverage, risk, valuation assumptions, and accounting quality all
        matter. A low PEG alone does not make a stock a good investment.
      </p>

      <h2
        id="retention-roe"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Retention Rate and Return on Equity
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>g% = (b% × ROE%) / 100</p>
        <p>b = retention rate (earnings not paid as dividends)</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This sustainable-growth form assumes relatively stable profitability and
        financing policy. Estimated growth can differ sharply from realized
        growth when ROE, payout, or competitive conditions change.
      </p>

      <h2
        id="peg-vs-pe"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        PEG Ratio vs P/E Ratio
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        P/E compares price with earnings. PEG incorporates estimated earnings
        growth so businesses with different growth expectations can be compared
        more carefully. Both depend on the quality of the underlying financial
        data and assumptions.
      </p>

      <h2
        id="caveats"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Things to Pay Attention to When Implementing PEG Ratio Theory
      </h2>
      <h3 className="mt-4 text-base font-semibold text-accent">
        Differences between companies
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Cross-industry PEG comparisons can mislead when risk, capital intensity,
        and accounting practices differ.
      </p>
      <h3 className="mt-4 text-base font-semibold text-accent">
        Growth rate assumptions
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Optimistic or unreliable growth estimates can make PEG look artificially
        attractive or expensive.
      </p>
      <h3 className="mt-4 text-base font-semibold text-accent">
        Negative earnings
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Conventional PEG is generally not meaningful when EPS is zero or
        negative.
      </p>
      <h3 className="mt-4 text-base font-semibold text-accent">
        Low or negative growth
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Zero or negative growth prevents a useful conventional PEG
        interpretation.
      </p>
      <h3 className="mt-4 text-base font-semibold text-accent">
        Historical vs forecast growth
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Historical growth, analyst forecasts, and sustainable growth from
        retention × ROE can diverge. Know which definition you are using.
      </p>

      <h2
        id="peg-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion items={[...PEG_FAQS]} />
      </div>
    </article>
  );
}
