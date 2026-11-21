import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { OKUNS_LAW_FAQS } from './content';

export function OkunsLawGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Okun&apos;s Law Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Real GDP and unemployment move together through the business cycle, but
        the mapping is empirical rather than exact. When firms produce more,
        they usually need more labor hours; when demand softens, hiring slows and
        layoffs rise. Okun&apos;s Law summarizes that association with a
        coefficient and a chosen formulation. This Okun&apos;s Law Calculator
        helps you estimate an output gap from an unemployment gap, forecast a
        change in unemployment from a GDP growth gap, solve for the growth rate
        needed to hit a target unemployment change, or recover the growth gap
        implied by a given Δu.
      </p>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The calculator separates the Okun coefficient used in the output-gap
        version (β) from the coefficient used in the growth-rate version (α).
        Those numbers are not interchangeable without an explicit model. A
        screenshot that shows a coefficient near −0.45 is using a signed slope;
        here you enter the positive magnitude and the formulas supply the minus
 signs. Results are teaching estimates for scenario analysis; not
        forecasts you should treat as guaranteed policy truth.
      </p>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Use the modes to keep inputs clean: only the fields that belong to the
        selected relationship appear, calculated values stay read-only, and
        step-by-step explanations update with your numbers. Charts illustrate
        the modeled line for the selected coefficient; they are not an observed
        historical scatter.
      </p>

      <h2
        id="what-is"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is Okun&apos;s Law?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Okun&apos;s Law is the name economists give to a family of empirical
        relationships connecting labor-market slack to real economic activity.
        Arthur Okun popularized the idea in the 1960s while studying U.S.
        macro data: periods of stronger real output were associated with lower
        unemployment, and weaker activity with higher unemployment. Later work
        expressed the idea in gap form (levels of unemployment and potential
        output) and in growth form (changes in unemployment and growth relative
        to trend).
      </p>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Why the negative association? Demand for goods and services drives labor
        demand. When GDP rises, firms often expand hours and employment. When GDP
        falls or grows slowly, firms cut overtime, freeze hiring, or reduce
        headcount. Potential GDP and the natural rate of unemployment provide
        benchmarks for “sustainable” activity and labor utilization under a
        chosen model. Cyclical swings around those benchmarks create unemployment
        gaps and output gaps that Okun-style equations relate.
      </p>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The observed slope is not a law of physics. Labor market institutions,
        hours flexibility, productivity shocks, participation shifts, and
        measurement practices all change how tightly unemployment tracks output.
        Treat Okun&apos;s Law as a useful regularity with a time- and
 country-specific coefficient; not a universal constant.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is the Okun&apos;s Law Formula in Macroeconomics?
      </h2>
      <h3 className="mt-4 text-base font-semibold text-accent">
        Output-gap version
      </h3>
      <div className="my-3 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs text-accent sm:text-sm">
        (Y − Y*) / Y* × 100 = −β (u − u*)
      </div>
      <p className="text-sm leading-relaxed text-foreground/90 sm:text-base">
        Equivalently, OutputGap = −β(u − u*). Here Y is actual real GDP, Y*
        potential real GDP, u the unemployment rate, u* the natural rate, and β a
        nonnegative Okun coefficient under this convention. The left side is the
        output gap in percent of potential; the unemployment gap is in percentage
        points. If a reference displays a signed coefficient k ≈ −0.45, that is
        the same as β = 0.45 with OutputGap = k(u − u*).
      </p>
      <h3 className="mt-4 text-base font-semibold text-accent">
        Growth-rate version
      </h3>
      <div className="my-3 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs text-accent sm:text-sm">
        Δu = −α (g − g*)
      </div>
      <p className="text-sm leading-relaxed text-foreground/90 sm:text-base">
        Δu is the change in the unemployment rate in percentage points, g is
        actual real GDP growth, g* is trend or unemployment-stabilizing growth,
        and α &gt; 0. Rearranging gives g = g* − Δu / α, or a growth gap g − g* =
        −Δu / α. A signed slope k = −α yields Δu = k(g − g*).
      </p>
      <h3 className="mt-4 text-base font-semibold text-accent">
        Why the two versions differ
      </h3>
      <p className="text-sm leading-relaxed text-foreground/90 sm:text-base">
        The output-gap version relates levels of slack (unemployment relative to
        natural, output relative to potential). The growth version relates
        changes in unemployment to growth relative to trend. Potential GDP and
        trend growth are related ideas but are not identical objects in every
        dataset. Because the left- and right-hand variables differ, β and α are
        not the same coefficient. Never copy a number from one equation into the
        other without stating the model you are using.
      </p>

      <h2
        id="growth-gap"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Do I Calculate GDP Growth Gap Using Okun&apos;s Law?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        First define the growth gap directly when you know both growth rates:
      </p>
      <div className="my-3 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs text-accent sm:text-sm">
        GDPGrowthGap = g − g*
      </div>
      <p className="text-sm leading-relaxed text-foreground/90 sm:text-base">
        From the growth Okun equation you can also recover the gap from an
        unemployment change:
      </p>
      <div className="my-3 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs text-accent sm:text-sm">
        GDPGrowthGap = −Δu / α
      </div>
      <p className="text-sm leading-relaxed text-foreground/90 sm:text-base">
        Example: suppose unemployment is expected to fall by 0.8 percentage
        points (Δu = −0.8) and α = 0.4. Then GDPGrowthGap = −(−0.8) / 0.4 = 2%.
        If trend growth is 2.5%, that corresponds to actual growth near 4.5%.
 Always keep α strictly positive when dividing: a zero coefficient makes
        the inverse undefined.
      </p>

      <h2
        id="output-gap"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate the Output Gap
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Worked example with unemployment rate 7%, natural rate 5%, and β = 2:
      </p>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          Unemployment gap = 7 − 5 = 2 percentage points above the natural rate.
        </li>
        <li>Apply OutputGap = −β × (u − u*) = −2 × 2.</li>
        <li>Estimated output gap = −4% of potential GDP.</li>
        <li>
          Interpretation: under this coefficient, actual output is about 4% below
          potential. A positive gap would mean output above potential.
        </li>
      </ol>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Contrast: if u = 3% and u* = 4% with the same β = 2, the unemployment gap
        is −1 pp and OutputGap = −2 × (−1) = +2%. Do not confuse the output gap
        with the GDP growth gap; one is a level concept relative to potential,
        the other a growth differential relative to trend.
      </p>

      <h2
        id="unemployment-change"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Changes in Unemployment
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Growth-rate example: actual GDP growth 4.5%, trend growth 2.5%, α = 0.4.
      </p>
      <div className="my-3 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs text-accent sm:text-sm">
        Δu = −0.4 × (4.5 − 2.5) = −0.8
      </div>
      <p className="text-sm leading-relaxed text-foreground/90 sm:text-base">
        Unemployment falls by 0.8 percentage points. That is not the same as a
        0.8% reduction of the initial unemployment rate. Percentage points measure
        absolute rate changes; percent of the old rate would scale by the starting
 unemployment level. If growth instead runs below trend; say g = 1% and
 g* = 3% with α = 0.5, then Δu = −0.5 × (1 − 3) = +1 percentage point.
      </p>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Negative GDP growth is valid input. If actual growth is −2% and trend is
        2% with α = 0.5, the growth gap is −4% and Δu = +2 pp under the model.
      </p>

      <h2
        id="coefficient"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Understanding the Okun Coefficient
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The Okun coefficient measures how strongly unemployment and activity move
        together in a chosen equation. Studies report different values because
        samples, countries, and specifications differ. Labor market flexibility,
        workforce productivity, participation, and hours all shape the slope.
        Business-cycle phases matter: recessions and expansions can yield
        different estimated coefficients. Statistical methods (gaps versus
        differences, filtering for potential/trend) also change the number.
      </p>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Because the relationship is estimated, not derived from a universal
        theory, you should not assume the coefficient stays constant forever or
        travels unchanged across economies. When a mode divides by α, a zero or
        negative coefficient is rejected so the calculator never emits Infinity.
      </p>

      <h2
        id="why-important"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Why Is Okun&apos;s Law Important?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Macro forecasters use Okun-style links as a cross-check: if growth
        projections and unemployment projections disagree wildly with a
        historically plausible coefficient, something may be inconsistent. Labor
        market monitoring and GDP analysis benefit from a transparent bridge
        between the two. Policy shops, central bank research, and government
        planning teams sometimes use Okun equations in scenario books for
 recessions and recoveries; always with uncertainty bands around the
        coefficient.
      </p>

      <h2
        id="recessions"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Okun&apos;s Law and Economic Recessions
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        During contractions, real GDP falls or slows and cyclical unemployment
        rises. Productivity and hours can absorb part of the shock before
        headcount adjusts, so unemployment may lag output. Recoveries can look
        “jobless” when firms raise output per worker before hiring. Across
        recessions, the Okun slope often differs because the mix of demand
        shocks, financial stress, and sectoral damage differs. Use the law as a
        organizing device, not as a promise that every downturn will map one
        growth percentage point into the same unemployment change.
      </p>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations of Okun&apos;s Law
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The relationship is empirical. Structural change, labor institutions,
        productivity trends, measurement error in potential GDP or the natural
        rate, economic shocks, shifts in working hours, and participation all
        weaken a fixed rule. Country-specific coefficients and sample periods
        produce different estimates. Observed outcomes can diverge from any
        single Okun projection. This calculator does not claim guaranteed
 predictions; it shows transparent arithmetic under assumptions you
        control.
      </p>

      <h2
        id="related"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related Calculators
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <Link
            href="/tools/gdp-gap-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            GDP Gap Calculator
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
            href="/tools/labor-force-participation-rate-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Labor Force Participation Rate Calculator
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
            href="/tools/cpi-inflation-calculator-consumer-price-index"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            CPI Inflation Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/mpc-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            MPC Calculator
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
      </ul>

      <h2
        id="okuns-law-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion faqs={[...OKUNS_LAW_FAQS]} />
      </div>
    </article>
  );
}
