import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { GDP_DEFLATOR_FAQS } from './content';

export function GdpDeflatorGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        GDP Deflator Formula Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The GDP deflator compares nominal GDP with real GDP to summarize the
        overall price level of domestically produced final goods and services.
        Economists use the comparison to separate price changes from volume
        changes when reading national accounts. This calculator computes the
        index D = (N / R) × 100, rearranges for nominal or real GDP, and
        optionally measures inflation between two deflator readings. A single
        index value is not the same thing as a one-year inflation rate.
      </p>

      <h2
        id="what-is"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is the GDP Deflator?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The GDP deflator is a broad price index covering final domestic output.
        Its reference or base methodology sets an index level (commonly 100)
        against which later periods are compared. Unlike a fixed consumer
        basket, its implicit weights shift with the composition of GDP.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        GDP Deflator Formula
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>GDP Deflator = (Nominal GDP / Real GDP) × 100</p>
        <p>N = (D × R) / 100</p>
        <p>R = (N × 100) / D</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Nominal GDP uses current-period prices; real GDP uses constant
        reference-period prices. Both must share compatible currency units and
        consistent national-accounts definitions before the ratio is meaningful.
      </p>

      <h2
        id="how-to-calculate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate GDP Deflator
      </h2>
      <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Determine nominal GDP.</li>
        <li>Determine real GDP.</li>
        <li>Ensure both values use compatible units (and magnitudes).</li>
        <li>Divide nominal GDP by real GDP.</li>
        <li>Multiply by 100 to form the index.</li>
        <li>Interpret the result relative to the reference level of 100.</li>
      </ol>

      <h2
        id="example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        GDP Deflator Calculation Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Nominal GDP = $25 trillion · Real GDP = $20 trillion → D = (25/20)×100 =
 125. The measured price level is 25% above the index reference; not
        automatically “25% inflation in the current year.”
      </p>

      <h2
        id="nominal-vs-real"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Nominal GDP vs. Real GDP
      </h2>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[28rem] border-collapse text-left text-sm text-foreground/90">
          <thead>
            <tr className="border-b border-border text-accent">
              <th className="py-2 pr-3 font-semibold">Aspect</th>
              <th className="py-2 pr-3 font-semibold">Nominal GDP</th>
              <th className="py-2 font-semibold">Real GDP</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border/70">
              <td className="py-2 pr-3 font-medium">Price basis</td>
              <td className="py-2 pr-3">Current prices</td>
              <td className="py-2">Constant / reference prices</td>
            </tr>
            <tr className="border-b border-border/70">
              <td className="py-2 pr-3 font-medium">Inflation</td>
              <td className="py-2 pr-3">Includes price effects</td>
              <td className="py-2">Controls for price changes</td>
            </tr>
            <tr>
              <td className="py-2 pr-3 font-medium">Typical use</td>
              <td className="py-2 pr-3">Current-dollar aggregates</td>
              <td className="py-2">Volume / growth analysis</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2
        id="nominal-from-real"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Nominal GDP from Real GDP
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        N = R × (D / 100). Example: real $20 trillion and deflator 125 → nominal
        $25 trillion.
      </p>

      <h2
        id="real-from-nominal"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Real GDP from Nominal GDP
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        R = (N × 100) / D. Example: nominal $25 trillion and deflator 125 → real
        $20 trillion.
      </p>

      <h2
        id="inflation"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Inflation Using the GDP Deflator
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        Inflation = (D_t − D_t−1) / D_t−1 × 100
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Previous 120 and current 126 → 5%. Distinguish the index, the period
        inflation rate, and cumulative change versus a base period.
      </p>

      <h2
        id="importance"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Why Is the GDP Deflator Important in Economics?
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Measuring economy-wide domestic price changes</li>
        <li>Converting nominal GDP into real GDP</li>
        <li>Evaluating growth and inflationary conditions</li>
        <li>Supporting national-accounts and policy analysis</li>
      </ul>

      <h2
        id="vs-cpi"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        GDP Deflator vs. Consumer Price Index (CPI)
      </h2>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[28rem] border-collapse text-left text-sm text-foreground/90">
          <thead>
            <tr className="border-b border-border text-accent">
              <th className="py-2 pr-3 font-semibold">Topic</th>
              <th className="py-2 pr-3 font-semibold">GDP deflator</th>
              <th className="py-2 font-semibold">CPI</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border/70">
              <td className="py-2 pr-3 font-medium">Scope</td>
              <td className="py-2 pr-3">Domestic final output</td>
              <td className="py-2">Consumer basket</td>
            </tr>
            <tr className="border-b border-border/70">
              <td className="py-2 pr-3 font-medium">Imports</td>
              <td className="py-2 pr-3">Not domestic production</td>
              <td className="py-2">Often included</td>
            </tr>
            <tr>
              <td className="py-2 pr-3 font-medium">Weights</td>
              <td className="py-2 pr-3">GDP composition</td>
              <td className="py-2">Basket weights</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2
        id="vs-pce"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        GDP Deflator vs. PCE Price Index
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The personal consumption expenditures (PCE) price index focuses on
        consumption prices with its own coverage and weighting. It is widely used
        in policy analysis but is not interchangeable with the GDP deflator,
        which covers a broader set of domestic final goods and services.
      </p>

      <h2
        id="can-decrease"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Can the GDP Deflator Decrease?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Yes. A falling deflator indicates a lower measured price level versus the
        prior period (deflation in that index). That differs from a slowing but
 still positive inflation rate, where the index still rises; just more
        slowly.
      </p>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations of the GDP Deflator
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>National-account revisions and measurement methods</li>
        <li>Chain-weighted real GDP and reference-year effects</li>
        <li>Coverage limits versus household cost-of-living measures</li>
        <li>Difficulty comparing inconsistent historical series</li>
      </ul>

      <h2
        id="how-used"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Economists Use the GDP Deflator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Analysts use the index to deflate nominal series, cross-check inflation
        stories against CPI/PCE, and frame growth debates. Businesses and
 researchers may use published deflators for scenario work; always with
        the published methodology and revision history in mind.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use the GDP Deflator Formula Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Choose currency denomination (shared by both GDP fields).</li>
        <li>Select mode: calculate deflator, nominal GDP, or real GDP.</li>
        <li>Enter the two known values with matching magnitude units.</li>
        <li>Read the index interpretation and optional calculation steps.</li>
        <li>Optionally open the inflation section with two period indexes.</li>
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
            href="/tools/fisher-effect-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Fisher Effect Calculator
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
            href="/tools/salary-inflation-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Salary Inflation Calculator
          </Link>
        </li>
      </ul>

      <h2
        id="gdp-deflator-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...GDP_DEFLATOR_FAQS]} />
      </div>
    </article>
  );
}
