import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { AVC_FAQS } from './content';

export function AverageVariableCostGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="avc-formula"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What&apos;s the Average Variable Cost Formula, and How to Use It?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Average variable cost (AVC) spreads total variable production costs
        across the units produced in a period. Businesses use it to understand
        unit variable cost for efficiency checks and short-run decisions.
      </p>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        AVC = VC / Q
        <br />
        VC = total variable costs · Q = total output (must be &gt; 0)
      </div>

      <h2
        id="what-is-avc"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is Average Variable Cost, and Why Should We Care?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        AVC is the variable cost of producing one unit of output. It supports
        cost management, production comparisons across output levels, and
 contribution analysis, but it alone does not set a profitable price.
      </p>

      <h2
        id="variable-vs-fixed"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Variable Costs vs. Fixed Costs
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <strong>Variable costs</strong> change with production activity
          (materials, piece-rate labor, variable packaging).
        </li>
        <li>
          <strong>Fixed costs</strong> stay relatively unchanged over a relevant
          output range and period (rent, salaried overhead).
        </li>
      </ul>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Some expenses are mixed; classify carefully for the period you analyze.
      </p>

      <h2
        id="how-to-calculate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Average Variable Cost
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Identify the production period.</li>
        <li>Sum all variable production costs for that period.</li>
        <li>Measure total output for the same period.</li>
        <li>Confirm output is positive.</li>
        <li>Divide VC by Q and interpret cost per unit.</li>
      </ol>

      <h2
        id="worked-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Average Variable Cost Calculation Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Variable costs $60,000 · output 240 units → AVC = 60,000 / 240 ={' '}
        <strong>$250 per unit</strong>.
      </p>

      <h2
        id="avc-vs-atc"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Average Variable Cost vs. Average Total Cost
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        ATC = AFC + AVC
        <br />
        ATC = TC / Q
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Do not confuse total variable costs with total production costs.
      </p>

      <h2
        id="avc-vs-mc"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Average Variable Cost vs. Marginal Cost
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Marginal cost is the additional cost of producing one more unit (or an
        incremental quantity), often approximated as ΔTC / ΔQ. AVC averages
 variable cost across all units; they answer different questions.
      </p>

      <h2
        id="output-effect"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Does Output Affect Average Variable Cost?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Efficiency, input utilization, diminishing returns, and capacity can
        change AVC as output changes. Higher volume does not always lower AVC.
      </p>

      <h2
        id="pricing"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Businesses Use AVC in Pricing Decisions
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        AVC informs unit variable cost and contribution margin analysis for
        short-run decisions. Over time, prices must also help cover fixed costs
 and required profit; AVC alone is not enough.
      </p>

      <h2
        id="common-mistakes"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Common Mistakes When Calculating AVC
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Including fixed costs in VC</li>
        <li>Mixing different accounting periods</li>
        <li>Using sales quantity instead of production without justification</li>
        <li>Dividing by zero output</li>
        <li>Double-counting expenses or mixing units</li>
      </ul>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        AVC Calculator Limitations
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Results depend on correct cost classification and the selected period.
        AVC excludes fixed costs, does not establish profitability by itself, and
        historical AVC may not predict future costs. Educational use only.
      </p>

      <div id="avc-faq" className="mt-10">
        <h2 className="text-lg font-bold tracking-tight text-accent sm:text-xl">
          Frequently Asked Questions
        </h2>
        <div className="mt-4">
          <FAQAccordion items={[...AVC_FAQS]} />
        </div>
      </div>
    </article>
  );
}
