import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { PRICE_ELASTICITY_OF_DEMAND_FAQS } from './content';

export function PriceElasticityOfDemandGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-ped"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Price Elasticity of Demand?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Price elasticity of demand (PED) measures how sensitive quantity
        demanded is to a change in the product’s own selling price. Businesses
        use it to anticipate how customers may respond to price tests,
 promotions, and list-price changes. PED is dimensionless; it is not a
        currency amount and not a percentage unit on the coefficient itself.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Price Elasticity of Demand Formula
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        PED = %Δ Quantity Demanded / %Δ Price
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        For ordinary downward-sloping demand, PED is negative because price and
        quantity move in opposite directions. This calculator displays the
        signed result and classifies demand using absolute magnitude.
      </p>

      <h2
        id="midpoint"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Midpoint Formula for Elasticity of Demand
      </h2>
      <div className="my-4 rounded-xl border border-border bg-muted/30 p-4 font-mono text-xs text-accent sm:text-sm">
        PED = [(Q₂ − Q₁) / ((Q₁ + Q₂) / 2)] ÷ [(P₂ − P₁) / ((P₁ + P₂) / 2)]
        <br />
        = (Q₂ − Q₁)/(Q₁ + Q₂) × (P₁ + P₂)/(P₂ − P₁)
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The midpoint (arc) method uses averages of the two observations. It
        reduces dependence on which point is labeled “initial” and produces the
        same PED when the observations are reversed.
      </p>

      <h2
        id="how-to-calculate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Price Elasticity of Demand
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Record initial price P₁ and initial quantity Q₁.</li>
        <li>Record final price P₂ and final quantity Q₂.</li>
        <li>Compute average price and average quantity.</li>
        <li>Compute midpoint percentage price and quantity changes.</li>
        <li>Divide percentage quantity change by percentage price change.</li>
        <li>Classify using |PED| and review revenue separately.</li>
      </ol>

      <h2
        id="worked-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Complete PED Calculation Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Price $50 → $60; quantity 200 → 150. Midpoint %ΔQ ≈ −28.57%; midpoint
        %ΔP ≈ +18.18%; PED = −11/7 ≈ <strong>−1.5714</strong> (elastic).
        Revenue falls from $10,000 to $9,000 (−10%).
      </p>

      <h2
        id="types"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Types of Price Elasticity of Demand
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Common classifications by |PED|: elastic (&gt;1), unit elastic (=1),
        inelastic (between 0 and 1), and perfectly inelastic (0). Perfectly
        elastic demand is a theoretical limiting case.
      </p>

      <h2
        id="elastic"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Elastic Demand
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        When |PED| &gt; 1, quantity responds proportionally more than price.
        Customers are relatively price-sensitive over the measured interval.
      </p>

      <h2
        id="inelastic"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Inelastic Demand
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        When 0 &lt; |PED| &lt; 1, quantity responds proportionally less than
        price. Buyers may have fewer substitutes or treat the good as a
        short-run necessity.
      </p>

      <h2
        id="unit-elastic"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Unit Elastic Demand
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        When |PED| = 1, percentage quantity and price changes match in
        magnitude. For ordinary inverse relationships under the midpoint method,
        endpoint revenues can be equal for carefully chosen observations.
      </p>

      <h2
        id="perfectly-inelastic"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Perfectly Inelastic Demand
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        PED = 0 when quantity is unchanged while price changes. That describes
 the observed interval only; not a claim that demand never responds.
      </p>

      <h2
        id="perfectly-elastic"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Perfectly Elastic Demand
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Perfectly elastic demand is a theoretical horizontal demand curve. This
        two-point midpoint calculator does not return Infinity from ordinary
        finite observations.
      </p>

      <h2
        id="determinants"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Determines Price Elasticity?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Substitutes, necessity versus luxury positioning, share of income, time
        to adjust, brand loyalty, how narrowly the market is defined, and
        preferences all influence measured elasticity.
      </p>

      <h2
        id="revenue"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Price Elasticity and Total Revenue
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        For typical downward-sloping demand, a price increase often reduces
        total revenue when demand is elastic and raises it when demand is
 inelastic over the interval. These are revenue effects; not profit
        effects.
      </p>

      <h2
        id="revenue-change"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Revenue Increase and Price Elasticity
      </h2>
      <div className="my-4 rounded-xl border border-border bg-muted/30 p-4 font-mono text-xs text-accent sm:text-sm">
        Revenue = P × Q
        <br />
        Revenue change % = (R₂ − R₁) / R₁ × 100
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        When initial revenue is zero, the percentage change is undefined. Do not
        display Infinity.
      </p>

      <h2
        id="pricing"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Price Elasticity and Business Pricing
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        PED informs price tests, promotional depth, and segment comparisons. It
        should sit alongside competitive monitoring, capacity, and brand goals.
      </p>

      <h2
        id="profit"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Price Elasticity and Profit
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Maximizing revenue is not the same as maximizing profit. Marginal cost,
        fixed costs, and constraints matter. See the Optimal Price Calculator
        for constant-elasticity contribution estimates.
      </p>

      <h2
        id="vs-income"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Price Elasticity vs. Income Elasticity
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Own-price PED responds to the product’s price. Income elasticity (YED)
        responds to consumer income. Use each measure for its intended question.
      </p>

      <h2
        id="vs-cross"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Price Elasticity vs. Cross Price Elasticity
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Cross-price elasticity measures how demand for one good responds to
        another product’s price (substitutes vs complements). PED uses own
        price.
      </p>

      <h2
        id="marginal-revenue"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Price Elasticity and Marginal Revenue
      </h2>
      <div className="my-4 rounded-xl border border-border bg-muted/30 p-4 font-mono text-xs text-accent sm:text-sm">
        MR = P × (1 + 1/ε)
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        That relationship uses point elasticity on a differentiable demand
 curve. Midpoint PED is an interval estimate; do not treat it as an
        exact point ε without stating the approximation.
      </p>

      <h2
        id="optimal"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Price Elasticity and Optimal Pricing
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Under constant-elasticity demand with constant marginal cost, the
        interior markup depends on elasticity. More elastic demand generally
        supports a smaller markup in that model class.
      </p>

      <h2
        id="retail"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Price Elasticity in Retail
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Shelf prices, promotions, and substitute availability shape measured
        PED. Compare like-for-like products and periods when estimating response.
      </p>

      <h2
        id="ecommerce"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Price Elasticity in E-Commerce
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Online shoppers can compare prices quickly. Conversion, discounts,
        shipping, and marketplace competition all affect observed demand
        response.
      </p>

      <h2
        id="essentials"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Price Elasticity for Essential Goods
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Essentials are often relatively inelastic in the short run, but they are
        not automatically perfectly inelastic. Income, substitutes, and time
        horizon still matter.
      </p>

      <h2
        id="luxury"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Price Elasticity for Luxury Goods
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Luxury demand can be elastic when purchases are discretionary, or less
        elastic for status-driven niches. Measure rather than assume.
      </p>

      <h2
        id="positive"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Positive Price Elasticity
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Positive PED means price and quantity moved together. Possible
        explanations include confounding shocks, measurement problems, or
        special cases discussed in theory (for example Giffen or Veblen
        effects). Do not classify it as ordinary downward-sloping unit-elastic
        demand just because |PED| = 1.
      </p>

      <h2
        id="short-long"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Short-Run vs. Long-Run Elasticity
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Demand often becomes more elastic as buyers find substitutes, renegotiate
        contracts, or change habits. Short-run and long-run estimates can differ.
      </p>

      <h2
        id="point-vs-arc"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Point Elasticity vs. Arc Elasticity
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Point elasticity uses a local slope. Arc (midpoint) elasticity measures
        responsiveness between two finite points. This tool’s primary output is
        midpoint PED. Initial-base percentages and log constant-elasticity
 calibrations are different estimators; do not mix them silently.
      </p>

      <h2
        id="why-midpoint"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Why Is the Midpoint Method Used?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        It is symmetric for a two-point comparison and widely taught for finite
        price changes. That makes it a practical default for business price
        tests with two observations.
      </p>

      <h2
        id="mistakes"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Common PED Calculation Mistakes
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Reversing numerator and denominator</li>
        <li>Dropping the negative sign without saying so</li>
        <li>Mixing quantity units or currencies</li>
        <li>Using initial-base % changes while claiming midpoint PED</li>
        <li>Treating undefined PED as zero or Infinity</li>
        <li>Confusing revenue change with profit change</li>
        <li>Assuming the price change caused all demand movement</li>
        <li>Rounding intermediate percentages before dividing</li>
      </ul>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations of Price Elasticity Calculators
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Two observations provide limited demand information. External factors,
        competition, advertising, seasonality, and product changes can dominate.
        Midpoint PED is an interval estimate, not a causal law and not a full
 demand curve. Educational use only; not personalized financial advice.
      </p>

      <h2
        id="ped-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion faqs={[...PRICE_ELASTICITY_OF_DEMAND_FAQS]} />
      </div>
    </article>
  );
}
