import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { GINI_FAQS } from './content';

export function GiniGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Gini Coefficient Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The Gini coefficient summarizes inequality in a distribution — most often
        income or wealth — as a single number usually between 0 and 1. On a Lorenz
        diagram, Area A lies between the line of perfect equality and the Lorenz
        curve; Area B lies beneath the Lorenz curve. This calculator computes{' '}
        <strong className="font-semibold text-accent">G = A / (A + B)</strong>,
        converts the result to a Gini index (G × 100), and shows an educational
        Lorenz illustration. An optional advanced mode estimates Gini from
        nonnegative income observations. Area A and Area B alone do not uniquely
        determine a measured Lorenz curve — the default chart is a modeled
        illustration unless you supply income data.
      </p>

      <h2
        id="what-is"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is the Gini Coefficient?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Named after statistician Corrado Gini, the coefficient measures relative
        dispersion: how unevenly a resource is shared across ordered population
        shares. A value of 0 means perfect equality under the measured definition;
        values approaching 1 mean extreme concentration. It does not measure
        overall prosperity. Two economies can share the same Gini while having
        very different average incomes, and the same country can show different
        Gini figures for pre-tax income, disposable income, and wealth.
      </p>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Income inequality describes flows over a period (wages, transfers,
        capital income). Wealth inequality describes stocks of net assets. Mixing
        the two without labels produces misleading comparisons.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Gini Coefficient Formula
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>G = A / (A + B)</p>
        <p>Gini Index = G × 100</p>
        <p>When A + B = 0.5 (unit square): G = 2A = 1 − 2B</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Use A/(A+B) whenever areas are expressed in any consistent units. The
        shortcuts G = 2A and G = 1 − 2B apply only when the Lorenz axes run from
        0 to 1 and the triangle under the equality line has area ½. Never apply
        2A to unnormalized area totals such as 1,200 + 3,800 = 5,000.
      </p>

      <h2
        id="how-to"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate the Gini Coefficient
      </h2>
      <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Identify the diagonal line of perfect equality.</li>
        <li>Plot or obtain the Lorenz curve for the distribution.</li>
        <li>Measure Area A between the equality line and the Lorenz curve.</li>
        <li>Measure Area B beneath the Lorenz curve.</li>
        <li>Compute the combined area A + B (must be &gt; 0).</li>
        <li>Apply G = A / (A + B).</li>
        <li>Interpret cautiously in context — not as a socioeconomic verdict.</li>
      </ol>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Worked area example: A = 1,200 unit², B = 3,800 unit² → G = 1,200 / 5,000
        = 0.24 → Gini index = 24. The distribution shows some inequality but is
        closer to equality than to the theoretical maximum in this area model.
      </p>

      <h2
        id="lorenz"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is the Lorenz Curve?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The Lorenz curve plots cumulative population share on the horizontal axis
        against cumulative income (or wealth) share on the vertical axis. Both
        axes typically run from 0% to 100%. Everyone starts at (0, 0) and the
        full population reaches (100%, 100%). The 45° diagonal is perfect
        equality: each cumulative population share holds the same cumulative
        income share. A larger bow below the diagonal means larger Area A and a
        higher Gini.
      </p>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Important integrity note: many different Lorenz curves can produce the
        same Gini. When you enter only Area A and Area B, the chart in this tool
        is a modeled illustration derived from G (a power-curve sketch), not a
        unique reconstruction of measured data.
      </p>

      <h2
        id="read-lorenz"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Read a Lorenz Curve
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Read a point (p, y) as: the bottom p% of the population receives y% of
        total income. Hypothetical teaching examples (not country data): if the
        bottom 20% receive 5% of income, the curve sits far below the diagonal at
        p = 0.20; if the bottom 50% receive 25%, inequality remains substantial;
        if the top 10% receive a disproportionately large residual share, the
        upper segment of the curve rises steeply. Always label whether the series
        is pre-tax, disposable, individual, or household.
      </p>

      <h2
        id="index-vs"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Gini Coefficient vs. Gini Index
      </h2>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[28rem] border-collapse text-left text-sm text-foreground/90">
          <thead>
            <tr className="border-b border-border text-accent">
              <th className="py-2 pr-3 font-semibold">Measure</th>
              <th className="py-2 pr-3 font-semibold">Typical scale</th>
              <th className="py-2 font-semibold">Example</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border/70">
              <td className="py-2 pr-3 font-medium">Gini coefficient</td>
              <td className="py-2 pr-3">0–1</td>
              <td className="py-2">0.24</td>
            </tr>
            <tr>
              <td className="py-2 pr-3 font-medium">Gini index</td>
              <td className="py-2 pr-3">0–100</td>
              <td className="py-2">24</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Conversion: Gini Index = Gini Coefficient × 100. Publications sometimes
        use “Gini” for either scale — check the units before comparing numbers.
      </p>

      <h2
        id="examples"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Gini Coefficient Calculation Examples
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Perfect equality: A=0, B=5000 → G=0</p>
        <p>Reference: A=1200, B=3800 → G=0.24 (index 24)</p>
        <p>Moderate: A=300, B=700 → G=0.30</p>
        <p>High: A=4000, B=1000 → G=0.80</p>
        <p>Area-model max: A=5000, B=0 → G=1</p>
        <p>Equal incomes [10,10,10,10] → G=0</p>
        <p>Unequal [10k,20k,30k,40k,100k] → G &gt; 0 (sorted formula)</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Comparing two hypothetical economies with the same average income but
        different Lorenz bows can yield different Gini values even when GDP per
        capita is identical — another reminder that averages and inequality
        answer different questions.
      </p>

      <h2
        id="from-incomes"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Gini from Income Distribution
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        For n ≥ 2 nonnegative observations with positive total income, sort
        incomes ascending as x₁ ≤ … ≤ xₙ and compute:
      </p>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>G = 2∑(i · xᵢ) / (n · ∑xᵢ) − (n + 1) / n</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Cumulative population and income shares then draw the empirical Lorenz
        curve. For grouped or frequency-weighted data, form ordered points
        (Xᵢ, Yᵢ) of cumulative population and income shares and estimate
        B = Σ ((Yᵢ + Yᵢ₋₁)/2)·(Xᵢ − Xᵢ₋₁), then G = 1 − 2B on the unit square.
        Do not feed frequency-weighted groups into the unweighted individual
        formula. Pre-tax vs post-tax and individual vs household units change
        results even on the same people.
      </p>

      <h2
        id="good-gini"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is a Good Gini Coefficient?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        There is no universally optimal Gini. Lower measured inequality is not
        automatically desirable without considering growth, mobility,
        measurement quality, and social preferences. Illustrative descriptive
        bands (for example, below 0.20 as “very low measured inequality”) help
        orientation in this calculator but are not official international
        standards. Always state income definition, year, and unit of analysis.
      </p>

      <h2
        id="countries"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Countries with the Highest and Lowest Gini Coefficients
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Published country rankings depend on year, whether the series is income
        or wealth, market vs disposable income, and household vs person
        equivalence. Authoritative sources include the World Bank, OECD, United
        Nations statistical databases, and national statistical agencies. This
        page does not hardcode undated high/low country tables to avoid
        presenting invented or stale figures as current. When you cite a table,
        include Country, Gini index, data year, income definition, and source —
        and never mix wealth Gini with income Gini in one ranking without clear
        labels.
      </p>

      <h2
        id="united-states"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is the Gini Coefficient of the United States?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        US Gini estimates differ across Census Bureau household income series,
        CBO measures that incorporate taxes and transfers, OECD disposable-income
        comparisons, and World Bank compilations. Pre-tax market income is
        typically more unequal than after-tax-and-transfer income. Look up a
        dated official release for any numeric claim — this calculator does not
        invent a current US figure.
      </p>

      <h2
        id="inequality"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Gini Coefficient and Economic Inequality
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Income inequality, wage inequality, and wealth (asset) inequality are
        related but distinct. Average income can rise while the Gini rises or
        falls depending on who gains. Asset ownership and capital returns often
        concentrate more than labor income. Use Gini alongside medians,
        percentile ratios, and poverty measures for a fuller picture.
      </p>

      <h2
        id="vs-gdp"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Gini Coefficient vs. GDP per Capita
      </h2>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[28rem] border-collapse text-left text-sm text-foreground/90">
          <thead>
            <tr className="border-b border-border text-accent">
              <th className="py-2 pr-3 font-semibold">Aspect</th>
              <th className="py-2 pr-3 font-semibold">Gini</th>
              <th className="py-2 font-semibold">GDP per capita</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border/70">
              <td className="py-2 pr-3 font-medium">Question</td>
              <td className="py-2 pr-3">How uneven is the distribution?</td>
              <td className="py-2">What is average output per person?</td>
            </tr>
            <tr className="border-b border-border/70">
              <td className="py-2 pr-3 font-medium">Scale</td>
              <td className="py-2 pr-3">Relative shares</td>
              <td className="py-2">Absolute average level</td>
            </tr>
            <tr>
              <td className="py-2 pr-3 font-medium">Limitation</td>
              <td className="py-2 pr-3">Silent on living standards level</td>
              <td className="py-2">Silent on distribution</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        High GDP per capita does not guarantee low inequality. Pair both metrics
        — see the{' '}
        <a
          href="/tools/gdp-per-capita-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          GDP per Capita Calculator
        </a>
        .
      </p>

      <h2
        id="advantages"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Advantages of the Gini Coefficient
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Simple numerical interpretation on a bounded scale</li>
        <li>Supports distribution comparisons across places and periods</li>
        <li>Useful for tracking inequality trends when definitions are held fixed</li>
        <li>Widely used in policy analysis and cross-country research</li>
      </ul>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations of the Gini Coefficient
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Different Lorenz shapes can share the same Gini</li>
        <li>Sensitive to income definitions, taxes, and transfers</li>
        <li>Household size and equivalence scales matter</li>
        <li>Underreporting, informal income, and top-income measurement issues</li>
        <li>Does not convey absolute income levels or regional detail</li>
        <li>Income and wealth inequality must not be conflated</li>
      </ul>

      <h2
        id="governments"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Governments Use the Gini Coefficient
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Researchers and policymakers monitor Gini series when evaluating taxation,
        social transfers, education access, public services, and development
        strategies. A changing Gini alone does not prove that a specific policy
        caused the change — confounding factors and measurement revisions are
        common. Treat the coefficient as one indicator among many.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use the Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Default mode: enter Area A and Area B in the same area units.</li>
        <li>Read Gini coefficient, Gini index, shares, and interpretation.</li>
        <li>Expand the step-by-step section to see A/(A+B) substitutions.</li>
        <li>Treat the Lorenz chart as illustrative unless you switch to incomes.</li>
        <li>Optional: enter nonnegative incomes for an empirical Lorenz and Gini.</li>
        <li>Use Clear / Reload / Share with the shared Omega action controls.</li>
      </ol>

      <h2
        id="related"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related Calculators
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <a
            href="/tools/gdp-per-capita-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            GDP per Capita Calculator
          </a>
        </li>
        <li>
          <a
            href="/tools/gdp-growth-rate-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            GDP Growth Rate Calculator
          </a>
        </li>
        <li>
          <a
            href="/tools/gdp-gap-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            GDP Gap Calculator
          </a>
        </li>
        <li>
          <a
            href="/tools/gdp-deflator-formula-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            GDP Deflator Formula Calculator
          </a>
        </li>
        <li>
          <a
            href="/tools/discretionary-income-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Discretionary Income Calculator
          </a>
        </li>
        <li>
          <a
            href="/tools/buying-power-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Buying Power Calculator
          </a>
        </li>
        <li>
          <a
            href="/tools/cpi-inflation-calculator-consumer-price-index"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            CPI Inflation Calculator
          </a>
        </li>
        <li>
          <a
            href="/tools/comparative-advantage-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Comparative Advantage Calculator
          </a>
        </li>
        <li>
          <a
            href="/tools/productivity-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Productivity Calculator
          </a>
        </li>
        <li>
          <a
            href="/tools/economic-value-added-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Economic Value Added Calculator
          </a>
        </li>
      </ul>

      <h2
        id="gini-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...GINI_FAQS]} />
      </div>
    </article>
  );
}
