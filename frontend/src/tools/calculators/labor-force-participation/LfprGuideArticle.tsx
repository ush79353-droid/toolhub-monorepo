import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { LFPR_FAQS } from './content';

export function LfprGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Labor Force Participation Rate Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The labor force participation rate (LFPR) shows what share of a defined
 population is economically active in the labor market; either employed
        or unemployed under official criteria. Enter employed, unemployed, and
        working-age (coverage) population counts to compute labor force size,
        unemployment rate, LFPR, people outside the labor force, and the
        employment-to-population ratio. Teaching examples on this page are
        hypothetical unless labeled with a real source and year.
      </p>

      <h2
        id="what-is"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is the Labor Force Participation Rate?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        LFPR measures labor market participation, not employment alone. A person
        can be unemployed and still raise participation. People outside the labor
 force (such as many retirees or full-time students not seeking work) 
        lower participation without counting as unemployed.
      </p>

      <h2
        id="labor-force"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Does Labor Force Mean?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The labor force equals employed people plus unemployed people who meet
        the survey’s job-search and availability rules. Jobless people who are
        not seeking work (or do not meet other criteria) are typically classified
        outside the labor force.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Labor Force Participation Rate Formula
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Labor Force = Employed + Unemployed</p>
        <p>LFPR = Labor Force / Working-Age Population × 100</p>
        <p>LFPR = (Employed + Unemployed) / Working-Age Population × 100</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Hypothetical example: 5,500,000 employed + 700,000 unemployed =
        6,200,000 labor force; ÷ 7,200,000 working-age × 100 ≈ 86.11%.
      </p>

      <h2
        id="how-to"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate the Labor Force Participation Rate
      </h2>
      <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Determine employment: 5,500,000.</li>
        <li>Determine unemployment: 700,000.</li>
        <li>Calculate labor force: 6,200,000.</li>
        <li>Divide by working-age population 7,200,000 and × 100 → 86.11%.</li>
      </ol>

      <h2
        id="how-labor-force"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate the Labor Force
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Labor Force = Employed + Unemployed</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The labor force is smaller than the total adult population whenever some
        people are outside the labor force.
      </p>

      <h2
        id="how-unemployment"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate the Unemployment Rate
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Unemployment Rate = Unemployed / Labor Force × 100</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Example: 700,000 / 6,200,000 × 100 ≈ 11.29%. Unemployment can move
        differently from LFPR when people enter or leave the labor force.
      </p>

      <h2
        id="vs-unemployment"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Labor Force Participation Rate vs. Unemployment Rate
      </h2>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[28rem] border-collapse text-left text-sm text-foreground/90">
          <thead>
            <tr className="border-b border-border text-accent">
              <th className="py-2 pr-3 font-semibold">Metric</th>
              <th className="py-2 pr-3 font-semibold">Numerator</th>
              <th className="py-2 font-semibold">Denominator</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border/70">
              <td className="py-2 pr-3 font-medium">LFPR</td>
              <td className="py-2 pr-3">Labor force</td>
              <td className="py-2">Relevant population</td>
            </tr>
            <tr className="border-b border-border/70">
              <td className="py-2 pr-3 font-medium">Unemployment rate</td>
              <td className="py-2 pr-3">Unemployed</td>
              <td className="py-2">Labor force</td>
            </tr>
            <tr>
              <td className="py-2 pr-3 font-medium">Employment-population ratio</td>
              <td className="py-2 pr-3">Employed</td>
              <td className="py-2">Relevant population</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2
        id="working-age"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is the Working-Age Population?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Agencies differ: US BLS headline civilian labor force participation uses
        the civilian noninstitutional population aged 16+; many international
        series use 15+ or 15–64. Cross-country comparisons require matching
        definitions.
      </p>

      <h2
        id="not-in-lf"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Who Is Not Included in the Labor Force?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Common nonparticipant groups include many retirees, full-time students
        not working or seeking work, unpaid caregivers who do not meet labor
        force criteria, and people who have stopped seeking employment. Labels
 alone do not determine status; employment and job-search behavior do.
      </p>

      <h2
        id="why-important"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Why Is Labor Force Participation Important?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Participation informs labor supply, growth potential, demographic
        pressures, and how to read unemployment alongside people leaving or
        entering the market. Policymakers monitor it with employment and wage
        trends.
      </p>

      <h2
        id="what-affects"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Affects the Labor Force Participation Rate?
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Age distribution and population aging</li>
        <li>Education and retirement timing</li>
        <li>Health and family / childcare responsibilities</li>
        <li>Business cycle conditions and migration</li>
        <li>Labor market and social policies</li>
      </ul>

      <h2
        id="growth"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Labor Force Participation and Economic Growth
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        More labor supply can raise potential output, but productivity and hours
        worked also drive growth. High participation alone does not guarantee
        higher living standards.
      </p>

      <h2
        id="gdp"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Labor Force Participation and GDP
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Labor input is a building block of GDP. Pair LFPR with{' '}
        <Link
          href="/tools/gdp-growth-rate-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          GDP Growth Rate
        </Link>
        ,{' '}
        <Link
          href="/tools/gdp-per-capita-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          GDP per Capita
        </Link>
        , and{' '}
        <Link
          href="/tools/productivity-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Productivity
        </Link>{' '}
        for a fuller growth picture.
      </p>

      <h2
        id="aging"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Labor Force Participation and Population Aging
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        When older age groups grow as a share of the population, aggregate LFPR
        often falls even if age-specific rates are unchanged, because older
        cohorts participate less on average.
      </p>

      <h2
        id="countries"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Labor Force Participation in Different Countries
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Cross-country gaps reflect definitions, age structure, education,
        retirement rules, development, institutions, and labor market conditions.
 This page does not invent rankings; use ILO, OECD, or national releases
        with matching years and definitions.
      </p>

      <h2
        id="trends"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Labor Force Participation Rate Trends
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Rates move for cyclical reasons (recessions, recoveries), structural
        reasons (industry and preference shifts), and demographic reasons (aging,
        migration). Distinguishing these drivers matters for policy.
      </p>

      <h2
        id="good-rate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is a Good Labor Force Participation Rate?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        No single “good” rate fits every economy. Context includes age structure,
        education, retirement, job quality, and which population is in the
        denominator.
      </p>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Labor Force Participation Rate Limitations
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Definition and coverage differences</li>
        <li>Discouraged workers and underemployment</li>
        <li>Informal work and data quality issues</li>
        <li>No information on hours or job quality</li>
        <li>Demographic composition can dominate trends</li>
      </ul>

      <h2
        id="related"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related Calculators
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <Link
            href="/tools/unemployment-calculator-unemployment-rate"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Unemployment Rate Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/gdp-growth-rate-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            GDP Growth Rate Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/gdp-per-capita-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            GDP per Capita Calculator
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
            href="/tools/annual-income-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Annual Income Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/wage-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Wage Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/hourly-wage-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Hourly Wage Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/inflation-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Inflation Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/discretionary-income-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Discretionary Income Calculator
          </Link>
        </li>
      </ul>

      <h2
        id="lfpr-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...LFPR_FAQS]} />
      </div>
    </article>
  );
}
