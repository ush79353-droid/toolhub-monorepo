import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { FISHER_EQUATION_FAQS } from './content';

export function FisherEquationGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Fisher Equation Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The Fisher equation relates the nominal interest rate, expected
        inflation, and the real interest rate in gross-return form. This
        calculator solves any one of the three with the exact identity
        (1+i)=(1+r)(1+πᵉ) and shows the approximate additive form side by side.
        It focuses on mathematical transparency — derivation, rearrangement, and
        exact-versus-approximate differences — distinct from the companion{' '}
        <Link
          href="/tools/fisher-effect-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Fisher Effect Calculator
        </Link>
        .
      </p>

      <h2
        id="what-is"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is the Fisher Equation in Economics?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Associated with Irving Fisher, the equation connects stated (nominal)
        interest with purchasing-power (real) interest through expected
        inflation. It is a relationship among defined rates, not a guarantee
        that market nominal rates always adjust immediately or one-for-one with
        inflation expectations.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is the Fisher Equation Formula?
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>(1 + i) = (1 + r)(1 + πᵉ)</p>
        <p>r = (1+i)/(1+πᵉ) − 1 = (i − πᵉ)/(1+πᵉ)</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The two real-rate expressions are algebraically equivalent when rates are
        decimals. The calculator converts percentages to decimals before
        applying them.
      </p>

      <h2
        id="deriving"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Deriving the Fisher Equation
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Solve for r: divide both sides by (1+πᵉ), subtract 1</li>
        <li>Solve for i: expand the product and subtract 1</li>
        <li>Solve for πᵉ: divide by (1+r), subtract 1</li>
      </ul>

      <h2
        id="approximate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Approximate Fisher Equation
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Expanding the exact form gives i = r + πᵉ + r·πᵉ. Dropping the product
        term yields i≈r+πᵉ. The omitted term is small when both rates are low
        and grows as rates rise — so the approximation must stay labeled
        approximate.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use the Fisher Equation Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Choose real, nominal, or expected-inflation mode</li>
        <li>Enter the two known rates</li>
        <li>Read the exact output and the approximated field</li>
        <li>Open calculation details for step-by-step math</li>
        <li>Reset or change mode as needed</li>
      </ol>

      <h2
        id="example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Fisher Equation Calculation Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Nominal 8%, expected inflation 3%:
      </p>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Exact: ((1.08/1.03)−1)×100 ≈ 4.8544% → 4.85%</p>
        <p>Approximate: 8% − 3% = 5.00%</p>
        <p>Difference ≈ 0.15 percentage points</p>
      </div>

      <h2
        id="nominal-vs-real"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Nominal vs. Real Interest Rates
      </h2>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[28rem] border-collapse text-left text-sm text-foreground/90">
          <thead>
            <tr className="border-b border-border text-accent">
              <th className="py-2 pr-3 font-semibold">Aspect</th>
              <th className="py-2 pr-3 font-semibold">Nominal</th>
              <th className="py-2 font-semibold">Real</th>
            </tr>
          </thead>
          <tbody className="align-top">
            <tr className="border-b border-border/70">
              <td className="py-2 pr-3 font-medium">Definition</td>
              <td className="py-2 pr-3">Stated contract rate</td>
              <td className="py-2">Inflation-adjusted via Fisher</td>
            </tr>
            <tr className="border-b border-border/70">
              <td className="py-2 pr-3 font-medium">Purchasing power</td>
              <td className="py-2 pr-3">Not adjusted</td>
              <td className="py-2">Adjusted</td>
            </tr>
            <tr>
              <td className="py-2 pr-3 font-medium">Uses</td>
              <td className="py-2 pr-3">Quotes, loans, deposits</td>
              <td className="py-2">Compare living-standard returns</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2
        id="inflation-exceeds"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Happens When Inflation Exceeds the Nominal Rate?
      </h2>
      <p className="mt-3 font-mono text-sm text-accent">
        i=4%, πᵉ=7% → r=((1.04/1.07)−1)×100 ≈ −2.80%
      </p>

      <h2
        id="negative-real"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Can the Real Interest Rate Be Negative?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Yes — even with a positive nominal rate. A negative real rate means
        expected inflation outpaces the stated return under the Fisher mapping.
        Implications for savers and borrowers depend on contracts, taxes, and
        risk, not the equation alone.
      </p>

      <h2
        id="vs-effect"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Fisher Equation vs. Fisher Effect
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The equation is the math. The Fisher effect typically describes the
        theoretical idea that nominal rates move with expected inflation when
        the real rate is held constant. Practice differs with risk premiums and
        monetary conditions. Use the{' '}
        <Link
          href="/tools/fisher-effect-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Fisher Effect Calculator
        </Link>{' '}
        for that framing.
      </p>

      <h2
        id="vs-ife"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Fisher Equation vs. International Fisher Effect
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The International Fisher Effect links cross-country nominal interest
        differentials to expected exchange-rate changes under additional
        assumptions. It is a separate theory — not a rename of the Fisher
        equation.
      </p>

      <h2
        id="applications"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Applications of the Fisher Equation
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Savings and deposit comparisons</li>
        <li>Loan and bond analysis</li>
        <li>Investment evaluation under inflation assumptions</li>
        <li>Teaching monetary and financial theory</li>
      </ul>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations of the Fisher Equation
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Expected vs actual inflation</li>
        <li>Forecast uncertainty and inflation risk</li>
        <li>Taxes, frictions, risk and liquidity premiums</li>
        <li>Real rates can change for non-inflation reasons</li>
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
            href="/tools/fisher-effect-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Fisher Effect Calculator
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
            href="/tools/compound-interest-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Compound Interest Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/simple-interest-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Simple Interest Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/apr-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            APR Calculator
          </Link>
        </li>
      </ul>

      <h2
        id="fisher-equation-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...FISHER_EQUATION_FAQS]} />
      </div>
    </article>
  );
}
