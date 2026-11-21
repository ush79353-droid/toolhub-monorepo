import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { MARGINAL_COST_FAQS } from './content';

export function MarginalCostGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-mc"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Marginal Cost?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Marginal cost measures the additional total cost associated with a
        change in production. Businesses use it to estimate how expensive it is
        to expand (or contract) output over a measured interval. This calculator
 reports discrete incremental cost (an average over ΔQ) not necessarily
        the exact continuous derivative at one point.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Marginal Cost Formula
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        MC = ΔTC / ΔQ
        <br />
        ΔTC = TC₂ − TC₁ · ΔQ = Q₂ − Q₁
      </div>

      <h2
        id="how-to-calculate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Marginal Cost
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Record initial and final total production cost.</li>
        <li>Compute the change in total cost (ΔTC).</li>
        <li>Record initial and final quantity.</li>
        <li>Compute the change in quantity (ΔQ).</li>
        <li>Confirm ΔQ is not zero.</li>
        <li>Divide ΔTC by ΔQ.</li>
        <li>Interpret the result as cost per unit over that interval.</li>
      </ol>

      <h2
        id="worked-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Marginal Cost Calculation Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Company Alpha: cost $50,000 → $65,000; quantity 1,000 → 1,200. ΔTC =
        $15,000; ΔQ = 200; MC = <strong>$75 per unit</strong>. Another scale:
        $500,000 → $650,000 with 10,000 → 12,000 units also yields $75/unit.
      </p>

      <h2
        id="why-important"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Why Marginal Cost Is Important
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Incremental cost informs production planning, pricing floors, overtime
        decisions, capacity utilization, and whether expansion is likely to
        improve contribution after comparing with marginal revenue.
      </p>

      <h2
        id="vs-average"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Marginal Cost vs. Average Cost
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Average total cost is TC ÷ Q. Marginal cost is ΔTC ÷ ΔQ. Example: ATC
 might be $50/unit while the next 200 units cost $60 each on average; 
        those figures answer different questions.
      </p>

      <h2
        id="vs-mr"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Marginal Cost vs. Marginal Revenue
      </h2>
      <div className="my-4 rounded-xl border border-border bg-muted/30 p-4 font-mono text-xs text-accent sm:text-sm">
        MR = ΔTR / ΔQ
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Comparing MR and MC helps evaluate whether selling more units adds
        profit. This tool does not compute MR or an optimal output from cost
        alone.
      </p>

      <h2
        id="variable-cost"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Marginal Cost and Variable Cost
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        When fixed costs are unchanged, ΔTC = ΔVC and MC = ΔVC / ΔQ. If fixed
        costs change between observations, that change is included in the ΔTC
        you enter.
      </p>

      <h2
        id="economies"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Economies of Scale
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
 Economies of scale describe declining average cost as volume expands; 
        from specialization, bulk buying, or spreading fixed costs. Do not
        define economies of scale solely as declining marginal cost.
      </p>

      <h2
        id="diseconomies"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Diseconomies of Scale
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
 Diseconomies appear when average costs rise with scale; coordination
        friction, bottlenecks, or logistics strain. Positive MC alone does not
        prove diseconomies of scale.
      </p>

      <h2
        id="mc-increase"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Why Marginal Cost May Increase
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Capacity limits, overtime premiums, scarce materials, equipment
        constraints, and rising input prices can push incremental cost higher.
      </p>

      <h2
        id="mc-decrease"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Why Marginal Cost May Decrease
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Learning curves, better utilization, process redesign, and cost-saving
        technology can lower incremental cost over some ranges of output.
      </p>

      <h2
        id="how-many-units"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Many Units Should a Business Produce?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Cost data alone cannot set optimal quantity. Revenue response (MR),
        capacity, and strategy matter. A common interior benchmark is MR = MC
        under suitable assumptions.
      </p>

      <h2
        id="reduce-mc"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Reduce Marginal Cost
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Improve production methods and reduce waste</li>
        <li>Lower variable input costs where quality allows</li>
        <li>Train workers and stabilize processes</li>
        <li>Use equipment more efficiently</li>
        <li>Optimize supply chains and setup times</li>
      </ul>

      <h2
        id="economics"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Marginal Cost in Economics
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Economists often define MC as the derivative of the total cost function.
        Short-run curves hold capital fixed; long-run analysis allows more
        adjustment. Discrete ΔTC/ΔQ approximates the slope when the interval is
        small and data are comparable.
      </p>

      <h2
        id="pricing"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Marginal Cost in Business Pricing
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
 Incremental cost is a pricing input; especially for short-run
 decisions, but demand elasticity, competition, and fixed-cost recovery
        still matter. See Optimal Price for elasticity-based markup models.
      </p>

      <h2
        id="mistakes"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Common Marginal Cost Calculation Mistakes
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Using total cost instead of ΔTC</li>
        <li>Using Q instead of ΔQ</li>
        <li>Confusing ATC with MC</li>
        <li>Dividing by zero when ΔQ = 0</li>
        <li>Treating 0/0 as zero MC</li>
        <li>Mixing currencies or quantity units</li>
        <li>Comparing noncomparable periods or product mixes</li>
        <li>Rounding intermediates before dividing</li>
      </ul>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations of the Marginal Cost Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Results are averages over the selected output change. Cost may vary
        within the interval; fixed-cost changes may be embedded in ΔTC; quality
        and mix may differ. The calculator does not determine optimal output or
 profitability by itself. Educational use only; not personalized
        financial advice.
      </p>

      <h2
        id="mc-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion faqs={[...MARGINAL_COST_FAQS]} />
      </div>
    </article>
  );
}
