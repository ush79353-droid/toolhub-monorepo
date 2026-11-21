import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { COMPARATIVE_ADVANTAGE_FAQS } from './content';

export function ComparativeAdvantageGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Comparative Advantage Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This calculator compares the opportunity costs of producing two goods
        across Country X and Country Y. Enter each country’s output of Good A
        and Good B per labor unit, then see who has comparative advantage
        (lower opportunity cost) and absolute advantage (higher productivity).
        The linear two-good model is a teaching tool — it does not capture every
        real-world trade cost, barrier, or distributional effect.
      </p>

      <h2
        id="what-is"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is Comparative Advantage?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Comparative advantage means producing a good at a lower opportunity cost
        than another producer. Opportunity cost is what you forgo — here, how
        many units of the other good you sacrifice along a linear production
        possibility frontier. Relative productivity differences across countries
        create room for specialization and trade in the classical model, even
        when one country is less productive in absolute terms.
      </p>

      <h2
        id="economics"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Comparative Advantage in Economics
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Associated with David Ricardo, comparative advantage is a foundational
        idea in international trade: allocate resources where opportunity costs
        are relatively lowest, specialize, and potentially expand feasible
        consumption through exchange. Gains from trade in the stylized model
        come from exploiting cost differences — not from every producer being
        the world’s best at something. The simplified setup does not claim to
        explain tariffs, transport networks, or every industry outcome.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Comparative Advantage Formula
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>OC_A = Output of Good B / Output of Good A</p>
        <p>OC_B = Output of Good A / Output of Good B</p>
        <p>(same country, same labor unit)</p>
      </div>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[20rem] border-collapse text-left text-sm text-foreground/90">
          <thead>
            <tr className="border-b border-border text-accent">
              <th className="py-2 pr-3 font-semibold">Symbol</th>
              <th className="py-2 font-semibold">Meaning</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border/70">
              <td className="py-2 pr-3 font-mono text-xs">OC_A</td>
              <td className="py-2">
                Units of Good B sacrificed per extra unit of Good A
              </td>
            </tr>
            <tr>
              <td className="py-2 pr-3 font-mono text-xs">OC_B</td>
              <td className="py-2">
                Units of Good A sacrificed per extra unit of Good B
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Never mix outputs from different countries in one ratio. Opportunity
        cost is always a within-country trade-off.
      </p>

      <h2
        id="how-to-calculate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Comparative Advantage
      </h2>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[16rem] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-border text-accent">
              <th className="py-2 pr-3 font-semibold">Country</th>
              <th className="py-2 pr-3 font-semibold">Good A</th>
              <th className="py-2 font-semibold">Good B</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border/70">
              <td className="py-2 pr-3">X</td>
              <td className="py-2 pr-3">100</td>
              <td className="py-2">80</td>
            </tr>
            <tr>
              <td className="py-2 pr-3">Y</td>
              <td className="py-2 pr-3">90</td>
              <td className="py-2">90</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>OC_X,A = 80/100 = 0.8 · OC_X,B = 100/80 = 1.25</p>
        <p>OC_Y,A = 90/90 = 1 · OC_Y,B = 1</p>
        <p>Good A → Country X (0.8 &lt; 1) · Good B → Country Y (1 &lt; 1.25)</p>
      </div>

      <h2
        id="economics-trade"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        The Economics of Comparative Advantage
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Suppose Island North can grow either 40 crates of fruit or 20 bolts of
        cloth per day, while Island South can grow 30 crates or 30 bolts. North
        has absolute advantage in fruit, South in cloth — but comparative
        advantage still follows opportunity costs (cloth per fruit crate: 0.5
        vs 1). A producer does not need absolute advantage in a good to benefit
        from specializing where its relative cost is lowest.
      </p>

      <h2
        id="vs-absolute"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Comparative Advantage vs. Absolute Advantage
      </h2>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[28rem] border-collapse text-left text-sm text-foreground/90">
          <thead>
            <tr className="border-b border-border text-accent">
              <th className="py-2 pr-3 font-semibold">Concept</th>
              <th className="py-2 pr-3 font-semibold">Measures</th>
              <th className="py-2 font-semibold">Implication</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border/70">
              <td className="py-2 pr-3 font-medium">Absolute advantage</td>
              <td className="py-2 pr-3">Higher output per input</td>
              <td className="py-2">Who produces more with the same labor</td>
            </tr>
            <tr>
              <td className="py-2 pr-3 font-medium">Comparative advantage</td>
              <td className="py-2 pr-3">Lower opportunity cost</td>
              <td className="py-2">
                Who should specialize under the model
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A country may have absolute advantage in both goods while retaining
        comparative advantage in only one when relative costs differ.
      </p>

      <h2
        id="ppf"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Opportunity Cost and Production Possibility Frontiers
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A linear PPF shows scarcity: with fixed labor, more of Good A means less
        of Good B. The slope’s magnitude is the opportunity cost of the
        horizontal good. The calculator chart uses intercepts H × productivity
        so total capacity is explicit; opportunity-cost ratios themselves do not
        depend on H.
      </p>

      <h2
        id="trade"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Comparative Advantage and International Trade
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Specialization can shape trade patterns and potential consumption gains
        when terms of trade lie between autarky opportunity costs. Transport
        costs, barriers, market power, adjustment frictions, and distributional
        effects can shrink or reverse simple textbook gains. Dependence on
        traded goods also creates vulnerabilities the two-good diagram omits.
      </p>

      <h2
        id="specialization"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Countries Benefit from Specialization
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        In the worked example, Country X specializes relatively in Good A and
        Country Y in Good B. A mutually beneficial exchange rate for Good A in
        units of Good B can lie strictly between 0.8 and 1 under the model —
        presented as a possible interval, not a guaranteed market price.
        Assumptions include two goods, linear PPFs, comparable labor units, and
        no trade frictions.
      </p>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations of Comparative Advantage
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Transportation costs and trade restrictions</li>
        <li>Imperfect competition and production adjustment costs</li>
        <li>Differences in labor skills and multiple production factors</li>
        <li>Technology change and dynamic comparative advantage</li>
        <li>Distributional, environmental, and social considerations</li>
      </ul>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use the Comparative Advantage Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter Country X productivity for Good A and Good B (units per labor-hour)</li>
        <li>Enter Country Y productivity for both goods with the same units</li>
        <li>Read the comparative-advantage labels in each country section</li>
        <li>Review opportunity costs, absolute advantage, specialization, and the PPF</li>
        <li>Optionally adjust labor endowment H for chart intercepts, or load the 100/80 vs 90/90 example</li>
      </ol>

      <h2
        id="related"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related Calculators
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <Link
            href="/tools/opportunity-cost-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Opportunity Cost Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/productivity-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Productivity Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/cobb-douglas-production-function-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Cobb-Douglas Production Function Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/marginal-cost-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Marginal Cost Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/economic-profit-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Economic Profit Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/buying-power-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Buying Power Calculator
          </Link>
        </li>
      </ul>

      <h2
        id="comparative-advantage-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...COMPARATIVE_ADVANTAGE_FAQS]} />
      </div>
    </article>
  );
}
