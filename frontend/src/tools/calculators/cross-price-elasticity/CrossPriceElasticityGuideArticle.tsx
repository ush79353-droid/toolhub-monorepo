import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { CPE_FAQS } from './content';

export function CrossPriceElasticityGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-cpe"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Cross-Price Elasticity of Demand?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Cross-price elasticity measures how quantity demanded of one good
        (Product B) responds to a change in the price of another good (Product
        A). Businesses use it when studying substitutes, complements, and related
        demand — always remembering that two observations alone do not prove
        causation.
      </p>

      <h2
        id="cpe-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Cross-Price Elasticity Formula
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        EBA = %ΔQB / %ΔPA
        <br />
        Initial-value %Δ = (new − old) / old × 100
        <br />
        Midpoint %Δ = (new − old) / ((old + new) / 2) × 100
      </div>

      <h2
        id="understanding"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Understanding the Results
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <strong>Positive:</strong> substitute-consistent direction.
        </li>
        <li>
          <strong>Negative:</strong> complement-consistent direction.
        </li>
        <li>
          <strong>Zero:</strong> no observed demand response over the interval.
        </li>
        <li>
          <strong>Magnitude:</strong> |E| describes responsiveness; the sign
          describes direction.
        </li>
      </ul>

      <h2
        id="substitutes"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Substitute Goods
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        When Product A becomes more expensive, buyers may shift toward Product B
        if the goods compete. Different brands of similar items are common
        illustrations — not automatic proof for any pair.
      </p>

      <h2
        id="complements"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Complementary Goods
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        When Product A becomes more expensive, demand for a complementary Product
        B may fall. Printers and compatible ink, or vehicles and fuel, are
        typical examples under simplifying assumptions.
      </p>

      <h2
        id="how-to-calculate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Cross-Price Elasticity
      </h2>
      <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Identify Product A (price) and Product B (demand).</li>
        <li>Enter initial and final prices for A.</li>
        <li>Enter initial and final quantities for B.</li>
        <li>Choose initial-value or midpoint percentages.</li>
        <li>Divide %Δ demand by %Δ price.</li>
        <li>Interpret sign and magnitude carefully.</li>
      </ol>

      <h2
        id="worked-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Cross-Price Elasticity Calculation Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        PA1 $10 · PA2 $12 · QB1 1,000 · QB2 1,200 → %ΔPA = 20% · %ΔQB = 20% → E =
        +1.00 under the initial-value method (and also ≈ +1.00 under midpoint for
        this proportional case).
      </p>

      <h2
        id="vs-own-price"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Cross-Price Elasticity vs. Price Elasticity of Demand
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Own-price elasticity uses the same good&apos;s price and quantity.
        Cross-price elasticity links one good&apos;s demand to another
        good&apos;s price.
      </p>

      <h2
        id="why-matters"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Why Cross-Price Elasticity Matters for Businesses
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        It informs pricing, competition, bundling, and demand forecasting for
        related products — alongside other market evidence.
      </p>

      <h2
        id="what-affects"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Affects Cross-Price Elasticity?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Availability of substitutes, complementary use, preferences,
        differentiation, switching costs, market conditions, and the time horizon
        can all change measured responsiveness.
      </p>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations of Cross-Price Elasticity
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Two-point calculations do not control for income, advertising,
        seasonality, availability, competitor prices, quality changes, or broader
        trends. A measured link is not automatically causal. This tool provides
        educational estimates, not market research advice.
      </p>

      <section id="cpe-faq" className="mt-10">
        <h2 className="text-lg font-bold tracking-tight text-accent sm:text-xl">
          Frequently Asked Questions
        </h2>
        <div className="mt-4">
          <FAQAccordion items={[...CPE_FAQS]} />
        </div>
      </section>
    </article>
  );
}
