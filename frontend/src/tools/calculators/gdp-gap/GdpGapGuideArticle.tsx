import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { GDP_GAP_FAQS } from './content';

export function GdpGapGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        GDP Gap Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The GDP gap (output gap) measures how far actual real GDP sits above or
        below estimated potential real GDP. Positive values suggest activity
        above estimated sustainable capacity; negative values suggest spare
        capacity. This calculator computes Gap% = ((Y − Y*) / Y*) × 100,
        rearranges for actual or potential GDP, and shows the absolute gap in
        monetary units. Potential GDP is an estimate — not an exact ceiling.
      </p>

      <h2
        id="what-is"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is the GDP Gap?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Actual GDP is measured output. Potential GDP is estimated sustainable
        productive capacity. The absolute gap is Y − Y*; the percentage gap
        divides that difference by Y*. The gap can be positive, negative, or
        zero.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        GDP Gap Formula — How to Calculate the Output Gap
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        GDP Gap (%) = ((Y − Y*) / Y*) × 100
      </div>
      <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Identify actual real GDP (Y).</li>
        <li>Identify potential real GDP (Y*).</li>
        <li>Use compatible currency, magnitude, and price basis.</li>
        <li>Subtract Y* from Y and divide by Y*.</li>
        <li>Multiply by 100 and interpret the sign.</li>
      </ol>

      <h2
        id="positive"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is a Positive GDP Gap?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Actual output exceeds estimated potential. That can coincide with high
        resource utilization and stronger demand, and may add inflationary
        pressure — without guaranteeing inflation or lasting overheating.
      </p>

      <h2
        id="negative"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is a Negative GDP Gap?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Actual output is below potential, suggesting underused capacity and
        possibly weaker demand or cyclical unemployment. A negative gap is not
        the same as a formal recession definition.
      </p>

      <h2
        id="potential"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is Potential GDP?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Potential GDP reflects labor, capital, productivity, technology, and
        normal utilization. It cannot be observed perfectly and is revised as
        data and methods update.
      </p>

      <h2
        id="estimating"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Is Potential GDP Estimated?
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Production-function approaches</li>
        <li>Statistical trend filters</li>
        <li>Output-gap models</li>
        <li>Labor-market and productivity analysis</li>
      </ul>

      <h2
        id="actual-vs-potential"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Actual GDP vs. Potential GDP
      </h2>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[28rem] border-collapse text-left text-sm text-foreground/90">
          <thead>
            <tr className="border-b border-border text-accent">
              <th className="py-2 pr-3 font-semibold">Aspect</th>
              <th className="py-2 pr-3 font-semibold">Actual GDP</th>
              <th className="py-2 font-semibold">Potential GDP</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border/70">
              <td className="py-2 pr-3 font-medium">Meaning</td>
              <td className="py-2 pr-3">Measured output</td>
              <td className="py-2">Estimated sustainable capacity</td>
            </tr>
            <tr>
              <td className="py-2 pr-3 font-medium">Observability</td>
              <td className="py-2 pr-3">Published (subject to revision)</td>
              <td className="py-2">Model-based estimate</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2
        id="examples"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate GDP Gap — Worked Examples
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Positive: (22−20)/20×100 = +10%</p>
        <p>Negative: (18−20)/20×100 = −10%</p>
        <p>Zero: (20−20)/20×100 = 0%</p>
      </div>

      <h2
        id="potential-from-gap"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Potential GDP from the Output Gap
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Y* = Y / (1 + Gap/100). Example: actual 22 and gap +10% → potential 20.
        Gap must be greater than −100%.
      </p>

      <h2
        id="actual-from-gap"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Actual GDP from Potential GDP
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Y = Y* × (1 + Gap/100). Example: potential 20 and gap −10% → actual 18.
      </p>

      <h2
        id="importance"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Why Is the GDP Gap Important?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        It informs business-cycle monitoring, inflation analysis, monetary and
        fiscal discussions, employment conditions, and forecasting — always as
        an estimate, not a definitive prediction.
      </p>

      <h2
        id="inflation"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        GDP Gap and Inflation
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Positive gaps may add demand-side pressure; negative gaps may ease it.
        Supply shocks, expectations, and policy still matter — inflation is not
        determined by the gap alone.
      </p>

      <h2
        id="unemployment"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        GDP Gap and Unemployment
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Okun’s law–style links are empirical: larger negative gaps often relate
        to higher unemployment, but the coefficient is not universal.
      </p>

      <h2
        id="vs-growth"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        GDP Gap vs. GDP Growth Rate
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The gap compares levels of actual and potential output now; growth
        measures change over time. An economy can grow quickly while still below
        potential, or grow slowly while above potential.
      </p>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations of GDP Gap Analysis
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Unobservable potential GDP and model uncertainty</li>
        <li>Data revisions and real-time estimation problems</li>
        <li>Structural change and supply shocks</li>
        <li>Cross-country comparability limits</li>
      </ul>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use the GDP Gap Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Choose currency denomination (shared labels only).</li>
        <li>Select mode: gap %, actual GDP, or potential GDP.</li>
        <li>Enter the two known values with magnitudes.</li>
        <li>Read percentage gap, absolute gap, and interpretation.</li>
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
            href="/tools/gdp-deflator-formula-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            GDP Deflator Formula Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/cpi-inflation-calculator-consumer-price-index"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            CPI Inflation Calculator
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
        <li>
          <Link
            href="/tools/fisher-equation-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Fisher Equation Calculator
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
      </ul>

      <h2
        id="gdp-gap-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...GDP_GAP_FAQS]} />
      </div>
    </article>
  );
}
