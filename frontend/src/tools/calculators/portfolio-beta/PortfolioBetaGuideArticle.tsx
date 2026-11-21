import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { PB_FAQS } from './content';

export function PortfolioBetaGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is the Beta of a Portfolio?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Portfolio beta estimates how sensitive a portfolio&apos;s returns are to
        movements in a market benchmark. Individual stock betas measure that
        sensitivity for each holding; portfolio weights determine how much each
        beta counts. Diversification can blend betas, but beta captures
        systematic market sensitivity — not total investment risk, idiosyncratic
        volatility, or guaranteed future returns.
      </p>

      <h2
        id="how-to-calculate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate the Beta of a Portfolio
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>βp = Σ (wi × βi)</p>
        <p>With percent weights: βp = Σ ((wi%/100) × βi)</p>
      </div>
      <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Identify the stocks in the portfolio.</li>
        <li>Find each stock&apos;s beta.</li>
        <li>Determine each portfolio weight.</li>
        <li>Convert percentages to decimals (divide by 100).</li>
        <li>Multiply each beta by its weight.</li>
        <li>Sum the weighted contributions for a fully invested allocation.</li>
      </ol>

      <h2
        id="example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Portfolio Beta Calculation Example
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>A: β 1.20 × 50% = 0.60</p>
        <p>B: β 0.80 × 30% = 0.24</p>
        <p>C: β 1.50 × 20% = 0.30</p>
        <p>Total weight 100% · βp = 0.60 + 0.24 + 0.30 = 1.14</p>
      </div>

      <h2
        id="interpret"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Interpret Portfolio Beta
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>β &gt; 1 — higher estimated market sensitivity than the benchmark.</li>
        <li>β ≈ 1 — similar estimated sensitivity to the benchmark.</li>
        <li>0 &lt; β &lt; 1 — lower estimated sensitivity.</li>
        <li>β ≈ 0 — little estimated linear co-movement with the benchmark.</li>
        <li>β &lt; 0 — historically inverse estimated relationship.</li>
      </ul>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        These interpretations are model-based heuristics, not guarantees of
        magnitude or direction of future returns.
      </p>

      <h2
        id="why-important"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Why Is Portfolio Beta Important?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Portfolio beta supports construction, risk budgeting, benchmark
        comparison, allocation decisions, and monitoring of systematic exposure.
        It does not replace measures of total volatility, liquidity, credit, or
        concentration risk.
      </p>

      <h2
        id="reduce"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Reduce Portfolio Beta
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Approaches can include raising weights of lower-beta assets, reducing
        high-beta concentrations, rebalancing, reviewing the benchmark, and
        considering more defensive holdings. This is educational context — not
        personalized investment advice.
      </p>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations of Portfolio Beta
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Beta estimates are historical, can change with market regimes, depend on
        the benchmark, and assume roughly linear relationships. Correlation can
        be unstable; leverage and nonlinear exposures complicate interpretation.
        Systematic risk is not the same as total volatility.
      </p>

      <h2
        id="pb-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion items={[...PB_FAQS]} />
      </div>
    </article>
  );
}
