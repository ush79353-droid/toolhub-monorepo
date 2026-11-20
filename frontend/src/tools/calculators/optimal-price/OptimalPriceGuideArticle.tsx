import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { OPTIMAL_PRICE_FAQS } from './content';

export function OptimalPriceGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-optimal"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is the Optimal Price?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The optimal price is the selling price that maximizes estimated profit
        under a stated demand and cost model. This calculator uses constant
        marginal cost and constant-elasticity demand.
      </p>

      <h2
        id="why-important"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Why Is Optimal Pricing Important?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Pricing links customer demand, unit costs, and contribution. Small price
        changes can move quantity enough to raise or cut profit.
      </p>

      <h2
        id="how-to-find"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Find the Optimal Price
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter constant marginal cost.</li>
        <li>Enter two observed price–quantity pairs.</li>
        <li>Calibrate constant elasticity ε = ln(Q₂/Q₁)/ln(P₂/P₁).</li>
        <li>If MC &gt; 0 and ε &lt; −1, compute P* = MC × ε/(ε+1).</li>
        <li>Estimate Q* and compare contribution at initial, final, and optimal prices.</li>
      </ol>

      <h2
        id="marginal-cost"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Marginal Cost Definition
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Marginal cost is the added cost of one more unit. Example: cost rises from
        $2,000 to $2,150 when quantity rises from 100 to 110 → MC = $15.
      </p>

      <h2
        id="marginal-revenue"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Marginal Revenue Definition
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Marginal revenue is the added revenue from one more unit. Along a
        downward-sloping demand curve, MR is below price. Optional MR in this
        tool is diagnostic only.
      </p>

      <h2
        id="mr-mc"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Marginal Revenue vs. Marginal Cost
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs text-accent sm:text-sm">
        Interior optimum: MR = MC
      </div>

      <h2
        id="what-is-ped"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is Price Elasticity of Demand?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        PED measures how quantity demanded responds to price. Ordinary demand is
        usually negative.
      </p>

      <h2
        id="calc-ped"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Price Elasticity
      </h2>
      <div className="my-4 rounded-xl border border-border bg-muted/30 p-4 font-mono text-xs text-accent sm:text-sm">
        ε = ln(Q₂/Q₁) / ln(P₂/P₁)
        <br />
        Midpoint (arc) PED is shown descriptively and is not mixed into P*.
      </div>

      <h2
        id="optimal-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Optimal Price Formula
      </h2>
      <div className="my-4 rounded-xl border border-border bg-muted/30 p-4 font-mono text-xs text-accent sm:text-sm">
        P* = MC × ε / (ε + 1) &nbsp; when MC &gt; 0 and ε &lt; −1
      </div>

      <h2
        id="optimal-qty"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Optimal Quantity
      </h2>
      <div className="my-4 rounded-xl border border-border bg-muted/30 p-4 font-mono text-xs text-accent sm:text-sm">
        Q* = Q₀ × (P*/P₀)^ε
      </div>

      <h2
        id="profit-initial"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Profit at the Initial Price
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        π₁ = (P₁ − MC) × Q₁ — contribution before fixed costs.
      </p>

      <h2
        id="profit-final"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Profit at the Final Price
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        π₂ = (P₂ − MC) × Q₂.
      </p>

      <h2
        id="profit-optimal"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Profit at the Optimal Price
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        π* = (P* − MC) × Q*.
      </p>

      <h2
        id="worked-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Complete Optimal Price Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        MC $40; P₁ $100, Q₁ 100; P₂ $125, Q₂ 64 → ε = −2; P* = <strong>$80</strong>;
        Q* = <strong>156.25</strong>; profits $6,000 / $5,440 /{' '}
        <strong>$6,250</strong>.
      </p>

      <h2
        id="elastic"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Understanding Elastic Demand
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        |ε| &gt; 1 — quantity moves proportionally more than price; markups tend
        to be smaller.
      </p>

      <h2
        id="inelastic"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Understanding Inelastic Demand
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        0 &lt; |ε| &lt; 1 — this unrestricted constant-elasticity model has no
        finite positive interior optimum with positive MC.
      </p>

      <h2
        id="unit-elastic"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Unit Elastic Demand
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        ε = −1 makes the markup formula undefined — no Infinity price is shown.
      </p>

      <h2
        id="markups"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Why More Elastic Demand Supports Lower Markups
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        (P − MC)/P = −1/ε. Larger |ε| shrinks the Lerner margin.
      </p>

      <h2
        id="vs-revenue"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Optimal Price vs. Maximum Revenue Price
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Revenue maximization ignores cost. Profit maximization sets MR = MC.
      </p>

      <h2
        id="vs-breakeven"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Optimal Price vs. Break-Even Price
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Break-even covers costs; optimal pricing aims for the highest modeled
        contribution.
      </p>

      <h2
        id="markup-vs-margin"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Markup vs. Profit Margin
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        At P* $80 and MC $40: markup on cost = 100%; margin on price = 50%.
      </p>

      <h2
        id="retail"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Optimal Pricing for Retail Businesses
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Retailers weigh inventory, promotions, and competition — this estimate is
        a starting point, not a shelf-ready policy.
      </p>

      <h2
        id="services"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Optimal Pricing for Services
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Capacity and labor often dominate variable cost; demand sensitivity still
        shapes feasible markups.
      </p>

      <h2
        id="online"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Optimal Pricing for Online Businesses
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A/B tests and conversion data can supply price–quantity pairs — still
        treat ε as an estimate.
      </p>

      <h2
        id="competition"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Competition Affects Optimal Pricing
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Rivals can raise effective elasticity. This tool does not simulate
        competitive responses.
      </p>

      <h2
        id="behavior"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Customer Behavior Affects Pricing
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Willingness to pay and switching costs shape ε — two historical points
        may not isolate a causal demand curve.
      </p>

      <h2
        id="costs"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Production Costs Affect Optimal Price
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Higher constant MC raises P* when ε &lt; −1. Rising MC with output needs
        a richer cost model.
      </p>

      <h2
        id="mistakes"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Common Optimal Pricing Mistakes
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Confusing MC with average cost</li>
        <li>Treating MR as equal to price</li>
        <li>Mixing midpoint and constant-ε assumptions</li>
        <li>Displaying Infinity when ε = −1</li>
        <li>Ignoring fixed costs when reporting “profit”</li>
        <li>Treating extrapolated demand as guaranteed sales</li>
      </ul>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations of Optimal Price Calculators
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Assumes constant ε and MC; two observations may not identify causal
        demand; capacity, taxes, discounts, and rivals are omitted. Educational
        estimate only — not financial advice.
      </p>

      <h2
        id="op-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion items={[...OPTIMAL_PRICE_FAQS]} />
      </div>
    </article>
  );
}
