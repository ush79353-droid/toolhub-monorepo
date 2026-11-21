import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { PHILLIPS_CURVE_FAQS } from './content';

export function PhillipsCurveGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Phillips Curve Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The Phillips Curve is a family of ideas connecting inflation (or wage
        growth) to labor-market slack, expectations, and sometimes supply shocks.
 Policymakers and students use it to organize short-run trade-offs, and to
        remember why those trade-offs can vanish once expectations adjust. This
        calculator supports three educational specifications: a simplified
        Traditional wage-change model, an expectations-augmented New Classical
        form, and a simplified New Keynesian Phillips Curve (NKPC). Results are
        transparent arithmetic under assumptions you choose, not guarantees about
        next quarter&apos;s CPI.
      </p>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Switch versions to change inputs, formulas, charts, and interpretations.
        Inverse targets let you solve for unemployment, expected inflation, output
        gaps, or shocks when coefficients are positive and finite. Coefficients
        are never silently copied across incompatible models.
      </p>

      <h2
        id="what-is"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is the Phillips Curve?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A. W. Phillips (1958) documented an inverse association between
        unemployment and money-wage growth in U.K. data. Later writers restated
        the idea in price-inflation terms and asked whether policymakers could
 permanently buy lower unemployment with higher inflation. Experience; 
 especially stagflation, and theory emphasizing expectations showed that a
        stable, exploitable long-run trade-off is not a reliable feature of modern
        economies. Short-run relationships can still appear while expectations,
        shocks, and institutions evolve.
      </p>

      <h2
        id="traditional"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is the Traditional Phillips Curve?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Traditional presentations often relate wage growth to the unemployment
        level (w = a − bu): tighter labor markets raise bargaining power and wage
        pressure. Demand for labor, hours, and unemployment all matter. A change
 relationship is different from a level relationship; Δu is not the same
        object as u. This calculator&apos;s Traditional mode uses a simplified
        wage-change specification for teaching clarity; it is not the only
        historical form.
      </p>

      <h2
        id="traditional-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        The Traditional Phillips Curve Formula
      </h2>
      <div className="my-3 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs text-accent sm:text-sm">
        w = w_T − β Δu
      </div>
      <p className="text-sm leading-relaxed text-foreground/90 sm:text-base">
        w is money-wage growth (%), w_T trend/baseline wage growth (%), Δu the
        change in unemployment (percentage points), and β &gt; 0 an explicit
        sensitivity. Example: w_T = 4%, Δu = +1 pp, β = 0.5 → w = 3.5%. A one
        percentage-point rise in unemployment reduces predicted wage growth from
        4% to 3.5% under this model. Inverse: Δu = (w_T − w) / β requires β &gt; 0.
      </p>

      <h2
        id="new-classical"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        The New Classical Phillips Curve Equation
      </h2>
      <div className="my-3 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs text-accent sm:text-sm">
        π = πᵉ − α(u − uₙ) + s
      </div>
      <p className="text-sm leading-relaxed text-foreground/90 sm:text-base">
        π is inflation, πᵉ expected inflation, u unemployment, uₙ the natural
        rate, α &gt; 0 the slope, and s a supply shock (pp). Example: πᵉ = 3%, u =
        6%, uₙ = 5%, α = 0.5, s = 0 → π = 2.5%. Unemployment above natural is
        associated with inflation below expectations. Raising πᵉ shifts the
        short-run curve. This simplified equation does not capture every
 rational-expectations DSGE feature; it teaches the expectations-augmented
        logic.
      </p>

      <h2
        id="new-keynesian"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        The New Keynesian Phillips Curve Model
      </h2>
      <div className="my-3 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs text-accent sm:text-sm">
        πₜ = β Eₜ[πₜ₊₁] + κ xₜ + sₜ
      </div>
      <p className="text-sm leading-relaxed text-foreground/90 sm:text-base">
        Current inflation depends on discounted expected future inflation, an
        output gap xₜ (demand pressure / sticky-price marginal cost proxy), slope
        κ &gt; 0, and cost-push shock sₜ. Discount factor satisfies 0 &lt; β ≤ 1.
        Example: E[π] = 3%, β = 0.99, x = 2%, κ = 0.25, s = 0.5 → πₜ = 3.97%. This
        is a simplified percentage-rate teaching form, not a full log-linearized
        hybrid NKPC.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use the Phillips Curve Calculator
      </h2>
      <h3 className="mt-4 text-base font-semibold text-accent">Traditional</h3>
      <p className="text-sm leading-relaxed text-foreground/90 sm:text-base">
        Choose whether to solve for wage growth, Δu, or trend wage growth. Enter
        the remaining fields and a positive β. Read the modeled wage–Δu chart.
      </p>
      <h3 className="mt-4 text-base font-semibold text-accent">New Classical</h3>
      <p className="text-sm leading-relaxed text-foreground/90 sm:text-base">
        Enter expected inflation, unemployment, natural rate, slope α, and shock s
        (use 0 if none). Or invert for u, πᵉ, uₙ, or s. Watch the short-run curve
        shift with πᵉ.
      </p>
      <h3 className="mt-4 text-base font-semibold text-accent">New Keynesian</h3>
      <p className="text-sm leading-relaxed text-foreground/90 sm:text-base">
        Enter expected inflation, discount factor, output gap, κ, and cost-push
        shock. Solve for πₜ or invert for expectations, gap, or shock.
      </p>

      <h2
        id="examples"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Phillips Curve Examples
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          Rising unemployment: w_T 4%, Δu +1, β 0.5 → w 3.5% (wage growth slows).
        </li>
        <li>
          Unemployment above natural: πᵉ 3%, u 6%, uₙ 5%, α 0.5, s 0 → π 2.5%.
        </li>
        <li>
          Positive gap + shock: E[π] 3%, β 0.99, x 2%, κ 0.25, s 0.5 → πₜ 3.97%.
        </li>
      </ol>

      <h2
        id="short-long"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Short-Run vs. Long-Run Phillips Curve
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Holding expectations fixed, a short-run curve can look downward-sloping.
        When expectations catch up, standard models place unemployment at its
 natural rate and make the long-run curve vertical; inflation can settle
        wherever policy anchors it. Textbook diagrams simplify a richer reality.
      </p>

      <h2
        id="nairu"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Phillips Curve and NAIRU
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        NAIRU is an empirical unemployment rate associated with stable inflation
        in a chosen regression. It is related to, but not identical with, the
        theoretical natural rate. Estimates drift with demographics, institutions,
 and measurement; they cannot be known precisely.
      </p>

      <h2
        id="shifts"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Causes the Phillips Curve to Shift?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Inflation expectations, oil and import prices, productivity, wage
        bargaining, monetary regimes, and structural labor-market change all move
        the short-run schedule. Supply shocks are modeled explicitly as s or sₜ
        here.
      </p>

      <h2
        id="stagflation"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Phillips Curve and Stagflation
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        High inflation with high unemployment can arise when adverse supply shocks
        and rising expectations dominate demand-driven trade-offs. A simple
        inverse curve is then a poor guide.
      </p>

      <h2
        id="central-banks"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Central Banks Use the Phillips Curve
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Central banks may use Phillips-style links among many tools to assess
        slack, expectations, and inflation risks. They do not set policy from a
        single equation.
      </p>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations of the Phillips Curve
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Relationships change over time; expectations and natural rates are hard to
        measure; supply shocks and flat estimated slopes complicate forecasting.
        Country differences and model assumptions matter. Treat every result as
        illustrative.
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
            href="/tools/okuns-law-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Okun&apos;s Law Calculator
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
      </ul>

      <h2
        id="phillips-curve-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion faqs={[...PHILLIPS_CURVE_FAQS]} />
      </div>
    </article>
  );
}
