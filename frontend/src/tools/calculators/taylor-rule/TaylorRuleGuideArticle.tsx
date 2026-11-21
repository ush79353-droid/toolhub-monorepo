import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { TAYLOR_RULE_FAQS } from './content';

export function TaylorRuleGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Taylor Rule Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The Taylor rule turns inflation relative to target and the GDP output
        gap into a recommended nominal policy interest rate, given a neutral
        real rate and response coefficients. This calculator computes the
        inflation gap, the output gap, the classic 0.5/0.5 prescription, and
 optional custom coefficients. Results are educational benchmarks; not
        official Federal Reserve decisions or live forecasts. GDP currency
        selection is denomination only (not FX conversion).
      </p>

      <h2
        id="what-is"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is the Taylor Rule?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Monetary policymakers influence short-term interest rates to stabilize
        inflation and economic activity. Economist John B. Taylor proposed a
        transparent interest-rate rule in the early 1990s linking the policy
        rate to inflation and the output gap. Central banks need not follow any
        single formula, but the rule provides a clear benchmark for evaluating
        stance relative to inflation targets and resource utilization.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Taylor Rule Formula
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>i = r* + π + a(π − π*) + b·y</p>
        <p>Standard: a = 0.5, b = 0.5</p>
        <p>Inflation gap = π − π*</p>
        <p>y = ((Y − Y*) / Y*) × 100</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        i is the implied nominal policy rate, r* the neutral real rate, π
        current inflation, π* the inflation target, Y actual GDP, Y* potential
        GDP, and y the output gap in percent. Rates are entered as percent
        numbers (4 means 4%).
      </p>

      <h2
        id="how-it-works"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Does the Taylor Rule Work?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Higher inflation or a positive output gap raises the recommended rate;
        lower inflation or slack lowers it. The direct π term plus a×(π − π*)
        means that, under the standard coefficients, the nominal rate rises more
 than one-for-one with inflation when other terms are held fixed; 
        consistent with the Taylor principle.
      </p>

      <h2
        id="how-to-calculate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate the Taylor Rule Interest Rate
      </h2>
      <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Inflation gap: 4% − 2% = 2 percentage points.</li>
        <li>Output gap: ((21 − 20) / 20) × 100 = 5%.</li>
        <li>i = 2 + 4 + 0.5(2) + 0.5(5) = 2 + 4 + 1 + 2.5 = 9.5%.</li>
      </ol>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Under these assumptions both above-target inflation and above-potential
        output push the recommended rate higher. Actual policy can still differ.
      </p>

      <h2
        id="inflation-gap"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is the Inflation Gap?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The inflation gap is the difference between current inflation and the
        target, in percentage points. Negative gaps (including deflation cases)
        are allowed; this calculator does not force inflation to be positive.
      </p>

      <h2
        id="output-gap"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is the Output Gap?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The output gap compares actual GDP with potential GDP. Positive gaps
        suggest above-normal utilization; negative gaps suggest slack. Use
 consistent currency, price basis, and period; ideally real GDP. See
        also the{' '}
        <Link
          href="/tools/gdp-gap-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          GDP Gap Calculator
        </Link>
        .
      </p>

      <h2
        id="neutral-rate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is the Neutral Real Interest Rate?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        r* is an estimate of the real policy rate consistent with balanced
        inflation and activity. It is not a fixed observable constant; estimates
        vary over time and across models. Treat the calculator&apos;s r* as an
        explicit assumption.
      </p>

      <h2
        id="taylor-principle"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Understanding the Taylor Principle
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Under the standard model, the nominal policy interest rate should
        respond more than one-for-one to sustained inflation increases, holding
        other relevant factors constant, so that the real rate rises when
        inflation rises. That property helps stabilize inflation expectations in
        many New Keynesian analyses.
      </p>

      <h2
        id="vs-actual"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Taylor Rule vs. Actual Federal Funds Rate
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The federal funds rate is set through FOMC decisions and market
        implementation. The Taylor rule is a simple benchmark. Differences arise
        from judgment, financial conditions, employment goals, data revisions,
        and constraints such as effective lower bounds.
      </p>

      <h2
        id="advantages"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Advantages of the Taylor Rule
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Transparency and educational simplicity.</li>
        <li>Consistent scenario comparison across inflation and gap assumptions.</li>
        <li>Useful for evaluating historical policy stance relative to a rule.</li>
      </ul>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations of the Taylor Rule
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Potential GDP and r* are uncertain and revised.</li>
        <li>Supply shocks can move inflation and output in opposite directions.</li>
        <li>Policy transmission lags and financial-stability concerns.</li>
        <li>Zero or effective lower bound episodes (negative rates remain possible).</li>
        <li>Forward-looking and open-economy considerations are omitted.</li>
      </ul>

      <h2
        id="when-useful"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        When Is the Taylor Rule Useful?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        It helps students, analysts, and policy discussants structure debates
 about stance; provided everyone treats inputs as assumptions and the
        output as a guideline, not a crystal ball.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use the Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter current and target inflation to see the inflation gap.</li>
        <li>Enter actual and potential GDP (same magnitude) for the output gap.</li>
        <li>Enter the assumed neutral real rate.</li>
        <li>Optionally customize a and b, expected inflation, or a comparison floor.</li>
        <li>Reload restores the 9.5% worked example; Clear empties fields.</li>
      </ol>

      <h2
        id="related"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related Calculators
      </h2>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-foreground/90 sm:text-base">
        <li>
          <Link href="/tools/gdp-gap-calculator" className="text-primary hover:underline">
            GDP Gap Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/inflation-calculator" className="text-primary hover:underline">
            Inflation Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/fisher-equation-calculator" className="text-primary hover:underline">
            Fisher Equation Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/fisher-effect-calculator" className="text-primary hover:underline">
            Fisher Effect Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/real-gdp-calculator" className="text-primary hover:underline">
            Real GDP Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/cpi-inflation-calculator-consumer-price-index" className="text-primary hover:underline">
            CPI Inflation Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/phillips-curve-calculator" className="text-primary hover:underline">
            Phillips Curve Calculator
          </Link>
        </li>
      </ul>

      <h2
        id="taylor-rule-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion faqs={[...TAYLOR_RULE_FAQS]} />
      </div>
    </article>
  );
}
