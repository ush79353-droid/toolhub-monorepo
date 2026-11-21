import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { PRODUCTIVITY_FAQS } from './content';

export function ProductivityGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-productivity"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Productivity?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Productivity measures how much output a business generates relative to
        an input such as labor. This calculator focuses on revenue-based labor
        productivity: revenue per employee and revenue per working hour.
      </p>

      <h2
        id="labor-productivity"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is Labor Productivity?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Labor productivity links workforce input to business output. Physical
        measures use units produced; revenue measures use sales generated.
        Revenue productivity is useful for planning but is not the same as
        efficiency or profit.
      </p>

      <h2
        id="why-important"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Why Is Productivity Important?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Managers use productivity indicators for workforce planning, cost
 awareness, growth capacity, and operational decisions; always alongside
        margins, quality, and demand.
      </p>

      <h2
        id="labor-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Labor Productivity Formula
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        Productivity = Output ÷ Labor Input
      </div>

      <h2
        id="rpe-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Revenue per Employee Formula
      </h2>
      <div className="my-4 rounded-xl border border-border bg-muted/30 p-4 font-mono text-xs text-accent sm:text-sm">
        RPE = Revenue ÷ Employees
      </div>

      <h2
        id="rph-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Revenue per Working Hour Formula
      </h2>
      <div className="my-4 rounded-xl border border-border bg-muted/30 p-4 font-mono text-xs text-accent sm:text-sm">
        RPH = Revenue ÷ Working Hours
      </div>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use the Productivity Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter total revenue for the reporting period.</li>
        <li>Enter employee count (or FTE) for that period.</li>
        <li>Enter total workforce working hours.</li>
        <li>Select seconds, minutes, or hours for the time entry.</li>
        <li>Review revenue per employee and revenue per working hour.</li>
      </ol>

      <h2
        id="worked-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Productivity Calculation Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Company Alpha: Revenue $500,000; employees 25; working hours 4,000. RPE
        = <strong>$20,000</strong>; RPH = <strong>$125/hour</strong>.
      </p>

      <h2
        id="employee-calc"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Employee Productivity
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Divide period revenue by the employee count (or FTE) for the same
        period. Employee count must be greater than zero.
      </p>

      <h2
        id="hourly-calc"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Hourly Productivity
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Convert entered time to hours, then divide revenue by total hours.
        Minutes ÷ 60 and seconds ÷ 3,600. Do not multiply total hours by
        headcount again.
      </p>

      <h2
        id="rpe-vs-rph"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Revenue per Employee vs. Revenue per Hour
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        When both are known, RPE = RPH × (Hours ÷ Employees). RPE reflects
        headcount intensity; RPH reflects labor-hour intensity.
      </p>

      <h2
        id="good-rpe"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is a Good Revenue per Employee?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        There is no universal target. Industry, outsourcing, capital intensity,
        and recognition policies change the meaning of the figure.
      </p>

      <h2
        id="good-rph"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is a Good Revenue per Hour?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Hourly revenue productivity also varies by sector. Compare like with
        like and review labor cost alongside the result.
      </p>

      <h2
        id="vs-efficiency"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Productivity vs. Efficiency
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Productivity emphasizes output per input. Efficiency emphasizes
        reducing waste for a given output. Both matter.
      </p>

      <h2
        id="vs-profit"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Productivity vs. Profitability
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        High revenue per employee does not guarantee profit if costs rise
        faster than sales.
      </p>

      <h2
        id="vs-labor-cost"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Productivity vs. Labor Cost
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Revenue productivity ignores wages and benefits. Pair it with labor
        cost and contribution margins for economic decisions.
      </p>

      <h2
        id="manufacturing"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Productivity in Manufacturing
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Plants often track units per labor hour. Revenue per hour adds pricing
        and mix effects on top of physical throughput.
      </p>

      <h2
        id="retail"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Productivity in Retail
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Sales per employee and per hour shift with traffic, seasonality, and
        staffing models.
      </p>

      <h2
        id="services"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Productivity in Service Businesses
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Billable utilization and pricing drive revenue per hour. Non-billable
        time still counts in total labor hours if included.
      </p>

      <h2
        id="software"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Productivity in Software Companies
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Subscription models can show high revenue per employee. Capital and
        automation intensity make peer comparisons careful.
      </p>

      <h2
        id="small-business"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Productivity in Small Businesses
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Small teams feel staffing changes quickly. Track periods consistently
        and avoid mixing monthly revenue with weekly hours.
      </p>

      <h2
        id="freelancers"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Productivity for Freelancers
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        With one person, RPE equals revenue. RPH equals revenue ÷ hours worked
        (or billed, if that is your chosen definition).
      </p>

      <h2
        id="improve-employee"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Improve Employee Productivity
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Training and clear workflows</li>
        <li>Better tools and automation</li>
        <li>Process optimization</li>
        <li>Workload and feedback loops</li>
      </ul>

      <h2
        id="improve-hourly"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Improve Hourly Productivity
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Cut avoidable delays</li>
        <li>Improve scheduling</li>
        <li>Remove bottlenecks</li>
        <li>Streamline repetitive tasks</li>
      </ul>

      <h2
        id="technology"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Technology and Productivity
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Technology raises measured productivity when it increases output or
        reduces required labor hours for the same output.
      </p>

      <h2
        id="automation"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Automation and Labor Productivity
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Automation can lift output per hour while changing roles and adding
 implementation cost; measure both sides.
      </p>

      <h2
        id="growth"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Productivity and Business Growth
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Sustainable scale often requires revenue growth that outpaces necessary
        labor growth, subject to quality and service constraints.
      </p>

      <h2
        id="margins"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Productivity and Profit Margins
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Cost structure determines whether revenue productivity becomes profit.
        Track operating expenses with these ratios.
      </p>

      <h2
        id="performance"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Productivity and Employee Performance
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Company-level revenue productivity should not be used alone to judge
 individual employees; roles and support systems differ.
      </p>

      <h2
        id="mistakes"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Common Productivity Calculation Mistakes
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Mixing reporting periods</li>
        <li>Double-counting hours by multiplying headcount again</li>
        <li>Confusing revenue with profit</li>
        <li>Treating calendar days as workdays without an hours assumption</li>
        <li>Ignoring part-time/FTE differences</li>
        <li>Comparing unrelated industries</li>
      </ul>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations of Productivity Calculators
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Revenue productivity is not a complete efficiency or performance score.
        Market demand, pricing, capital, outsourcing, and role mix all matter.
 Educational use only; not personalized financial advice.
      </p>

      <h2
        id="productivity-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion faqs={[...PRODUCTIVITY_FAQS]} />
      </div>
    </article>
  );
}
