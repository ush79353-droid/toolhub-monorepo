import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { PES_FAQS } from './content';

export function PriceElasticityOfSupplyGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Price Elasticity of Supply Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Price elasticity of supply (PES) measures how strongly quantity supplied
        responds when price changes. This calculator compares two observations
        with either the standard percentage-change method or the midpoint (arc)
        method, reports PES as a dimensionless coefficient, and classifies the
        response — including negative or undefined cases when data warrant them.
      </p>

      <h2
        id="what-is"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is Price Elasticity of Supply?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Producers choose how much to offer at market prices. PES summarizes the
        percentage change in quantity supplied relative to the percentage change
        in price. A movement along a supply relationship is different from a
        shift of the whole supply curve caused by costs, technology, or other
        non-price factors.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Price Elasticity of Supply Formula
      </h2>
      <div className="my-3 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs text-accent sm:text-sm">
        PES = %ΔQs / %ΔP
      </div>
      <p className="text-sm leading-relaxed text-foreground/90 sm:text-base">
        For the standard method, %ΔP = (P₂−P₁)/P₁×100 and %ΔQs =
        (Q₂−Q₁)/Q₁×100, so PES = [(Q₂−Q₁)/Q₁] / [(P₂−P₁)/P₁].
      </p>

      <h2
        id="how-to"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Price Elasticity of Supply
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>P₁ = 100, P₂ = 120 → %ΔP = 20%.</li>
        <li>Q₁ = 500, Q₂ = 600 → %ΔQs = 20%.</li>
        <li>PES = 20% / 20% = 1.00 — unit elastic supply.</li>
      </ol>

      <h2
        id="midpoint"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Midpoint Formula for Price Elasticity of Supply
      </h2>
      <div className="my-3 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs text-accent sm:text-sm">
        %ΔP = (P₂−P₁)/((P₁+P₂)/2)×100
      </div>
      <p className="text-sm leading-relaxed text-foreground/90 sm:text-base">
        With averages in the denominators, reversing Period 1 and Period 2 yields
        the same arc PES. For 100→120 and 500→600, midpoint % changes are about
        18.18% each, so PES = 1 as well.
      </p>

      <h2
        id="types"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Types of Price Elasticity of Supply
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>PES = 0: perfectly inelastic.</li>
        <li>0 &lt; PES &lt; 1: relatively inelastic.</li>
        <li>PES = 1: unit elastic.</li>
        <li>PES &gt; 1: relatively elastic.</li>
        <li>
          Perfectly elastic: idealized limit — not created by identical prices
          (that case is undefined).
        </li>
        <li>Negative PES: opposite moves of price and quantity supplied.</li>
      </ul>

      <h2
        id="factors"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Factors Affecting Price Elasticity of Supply
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Capacity, raw materials, time horizon, inventories, labor flexibility,
        technology, entry/exit barriers, agricultural cycles, financing access,
        and supply-chain constraints all shape how quickly output can respond.
      </p>

      <h2
        id="short-long"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Short-Run vs. Long-Run Supply Elasticity
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Short-run responses are often constrained by fixed capital. Over longer
        horizons, firms can expand capacity and new entrants may appear —
        elasticity frequently rises, but not in every industry.
      </p>

      <h2
        id="examples"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Price Elasticity of Supply Examples
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Hypothetical illustrations: seasonal crops can look inelastic within a
        harvest window; factories with spare shifts may look elastic; housing
        construction often adjusts slowly; digital goods with unused server
        capacity can expand quickly; limited-seat services may be near-inelastic
        in the short run.
      </p>

      <h2
        id="business"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Why Price Elasticity of Supply Matters to Businesses
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        PES informs production planning, capacity investment, inventory, pricing
        strategy, tax-incidence analysis, and how markets clear after shocks.
      </p>

      <h2
        id="vs-demand"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Price Elasticity of Supply vs. Price Elasticity of Demand
      </h2>
      <div className="mt-3 overflow-x-auto rounded-xl border border-border">
        <table className="min-w-full text-left text-xs sm:text-sm">
          <thead className="bg-muted/40 text-accent">
            <tr>
              <th className="px-3 py-2">Feature</th>
              <th className="px-3 py-2">Supply elasticity</th>
              <th className="px-3 py-2">Demand elasticity</th>
            </tr>
          </thead>
          <tbody className="text-foreground/90">
            <tr className="border-t border-border">
              <td className="px-3 py-2">Measures</td>
              <td className="px-3 py-2">Producer quantity response</td>
              <td className="px-3 py-2">Consumer quantity response</td>
            </tr>
            <tr className="border-t border-border">
              <td className="px-3 py-2">Quantity</td>
              <td className="px-3 py-2">Quantity supplied</td>
              <td className="px-3 py-2">Quantity demanded</td>
            </tr>
            <tr className="border-t border-border">
              <td className="px-3 py-2">Usual sign</td>
              <td className="px-3 py-2">Positive</td>
              <td className="px-3 py-2">Negative</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Usual-sign generalizations can fail in observed data; always report the
        calculated signed coefficient.
      </p>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations of Price Elasticity of Supply Calculations
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Two-point ratios are not causal supply curves. Simultaneous demand
        shifts, measurement error, nonlinearities, and changing horizons all
        limit interpretation.
      </p>

      <h2
        id="related"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related Calculators
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <Link
            href="/tools/price-elasticity-of-demand-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Price Elasticity of Demand Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/cross-price-elasticity-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Cross Price Elasticity Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/income-elasticity-of-demand-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Income Elasticity of Demand Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/comparative-advantage-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Comparative Advantage Calculator
          </Link>
        </li>
      </ul>

      <h2
        id="pes-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion faqs={[...PES_FAQS]} />
      </div>
    </article>
  );
}
