import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { DEADWEIGHT_LOSS_FAQS } from './content';

export function DeadweightLossGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Deadweight Loss Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This calculator estimates the loss of total economic surplus when market
        quantity differs from a socially efficient baseline. Enter prices and
        quantities for the simple triangle model, a per-unit tax wedge, or
        explicit linear supply and demand. Deadweight loss arises from taxes,
        subsidies, price controls, monopoly, externalities, quotas, and other
        distortions. Results are geometric or model-based estimates — not
        automatic proof that any particular policy is inefficient.
      </p>

      <h2
        id="what-is"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is Deadweight Loss?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        In competitive markets without market failures, equilibrium quantity
        maximizes total surplus (consumer surplus + producer surplus). When
        quantity moves away from that efficient level, some mutually beneficial
        trades disappear. That lost surplus is deadweight loss — distinct from a
        transfer of surplus from one party to another.
      </p>

      <h2
        id="causes"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Causes Deadweight Loss?
      </h2>
      <h3 className="mt-4 text-base font-semibold text-accent">Taxes</h3>
      <p className="mt-2 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A tax wedge between buyer and seller prices can shrink traded quantity
        so that some units with willingness to pay above marginal cost are not
        produced.
      </p>
      <h3 className="mt-4 text-base font-semibold text-accent">Subsidies</h3>
      <p className="mt-2 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Subsidies may expand output past the efficient point when private
        incentives already align with social value — creating over-trading.
      </p>
      <h3 className="mt-4 text-base font-semibold text-accent">Price ceilings</h3>
      <p className="mt-2 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Binding ceilings can cause shortages and reduce quantity below the
        competitive level, eliminating surplus from foregone trades.
      </p>
      <h3 className="mt-4 text-base font-semibold text-accent">Price floors</h3>
      <p className="mt-2 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Binding floors can create surpluses and reduce completed transactions,
        again generating a welfare-loss region.
      </p>
      <h3 className="mt-4 text-base font-semibold text-accent">Monopoly</h3>
      <p className="mt-2 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Output where marginal revenue equals marginal cost is typically below
        the competitive P = MC quantity, leaving unrealized gains from trade.
      </p>
      <h3 className="mt-4 text-base font-semibold text-accent">Externalities</h3>
      <p className="mt-2 text-sm leading-relaxed text-foreground/90 sm:text-base">
        When private and social costs or benefits diverge, the market quantity
        can be too high or too low relative to the social optimum.
      </p>
      <h3 className="mt-4 text-base font-semibold text-accent">Quotas</h3>
      <p className="mt-2 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Quantity caps can directly prevent efficient trades above the quota.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Deadweight Loss Formula
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Triangle: DWL = ½ × |ΔP| × |ΔQ|</p>
        <p>Tax: DWL = ½ × t × |Qe − Qt|</p>
        <p>Linear: DWL = ½(b+d)(Qe − Qd)²</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The triangle formula estimates area only when the supplied price gap
        matches the economic wedge under assumed linear geometry. It is not a
        universal formula for every intervention.
      </p>

      <h2
        id="how-to-calculate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Deadweight Loss
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Example: original price $10, new price $14, original quantity 1,000,
        new quantity 800.
      </p>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>|14 − 10| = 4</p>
        <p>|1000 − 800| = 200</p>
        <p>DWL = 0.5 × 4 × 200 = 400</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The $400 figure is the triangle area under those inputs. Whether it
        equals true economic DWL depends on whether the price difference is the
        correct wedge and curves are approximately linear.
      </p>

      <h2
        id="graph"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Deadweight Loss Graph Explained
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Quantity is on the horizontal axis and price on the vertical. Demand
        slopes down; supply slopes up. Efficient quantity Qe and distorted
        quantity Qd frame the loss region. The shaded area approximates the
        value of trades that are no longer efficient. In simple triangle mode
        this tool shows an illustrative triangle from |ΔP| and |ΔQ| without
        inventing full curves; linear mode plots the curves you enter.
      </p>

      <h2
        id="taxes"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Deadweight Loss From Taxes
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        With t = $4, Qe = 1,000, Qt = 800: DWL = ½ × 4 × 200 = $400. Tax revenue
        = 4 × 800 = $3,200. Revenue is a transfer; DWL is the surplus that
        vanishes.
      </p>

      <h2
        id="monopoly"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Deadweight Loss From Monopoly
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Monopoly markup is not itself DWL. Welfare loss comes from restricting
        output below the competitive quantity. Correct monopoly DWL requires
        demand and cost curves — not an arbitrary price difference alone. Use
        the linear mode when you can specify those relationships.
      </p>

      <h2
        id="price-controls"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Deadweight Loss From Price Controls
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Ceilings can create shortages and inefficient rationing; floors can
        create surpluses and unused supply. Both can shrink completed trades
        relative to the efficient quantity and generate a welfare-loss triangle.
      </p>

      <h2
        id="surplus-compare"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Consumer Surplus vs. Producer Surplus vs. Deadweight Loss
      </h2>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[28rem] border-collapse text-left text-sm text-foreground/90">
          <thead>
            <tr className="border-b border-border text-accent">
              <th className="py-2 pr-3 font-semibold">Metric</th>
              <th className="py-2 font-semibold">What it measures</th>
            </tr>
          </thead>
          <tbody className="align-top">
            <tr className="border-b border-border/70">
              <td className="py-2 pr-3 font-medium">Consumer surplus</td>
              <td className="py-2">WTP − price for units bought</td>
            </tr>
            <tr className="border-b border-border/70">
              <td className="py-2 pr-3 font-medium">Producer surplus</td>
              <td className="py-2">Price − marginal cost for units sold</td>
            </tr>
            <tr className="border-b border-border/70">
              <td className="py-2 pr-3 font-medium">Total surplus</td>
              <td className="py-2">CS + PS (+ government surplus if any)</td>
            </tr>
            <tr>
              <td className="py-2 pr-3 font-medium">Deadweight loss</td>
              <td className="py-2">Surplus destroyed by inefficient quantity</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2
        id="elasticity"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Deadweight Loss and Elasticity
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        For a given wedge, more elastic curves usually imply a larger quantity
        response and a larger DWL triangle. Elasticity alone does not determine
        DWL in every model — curve shape and the policy instrument matter.
      </p>

      <h2
        id="reduce"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Reduce Deadweight Loss
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Improve competition and remove inefficient barriers</li>
        <li>Address externalities with targeted instruments</li>
        <li>Avoid poorly designed price controls</li>
        <li>Choose tax/subsidy designs that limit inefficient quantity gaps</li>
      </ul>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations of the Deadweight Loss Formula
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Triangle mode assumes linear (or locally linear) geometry</li>
        <li>Four numbers do not uniquely identify supply and demand</li>
        <li>Nonlinear curves need integration or other welfare methods</li>
        <li>Observed prices may not equal the full economic wedge</li>
      </ul>

      <h2
        id="related"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related Calculators
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <a
            href="/tools/consumer-surplus-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Consumer Surplus Calculator
          </a>
        </li>
        <li>
          <a
            href="/tools/price-elasticity-of-demand-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Price Elasticity of Demand Calculator
          </a>
        </li>
        <li>
          <a
            href="/tools/marginal-cost-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Marginal Cost Calculator
          </a>
        </li>
        <li>
          <a
            href="/tools/cobb-douglas-production-function-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Cobb-Douglas Production Function Calculator
          </a>
        </li>
      </ul>

      <h2
        id="deadweight-loss-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...DEADWEIGHT_LOSS_FAQS]} />
      </div>
    </article>
  );
}
