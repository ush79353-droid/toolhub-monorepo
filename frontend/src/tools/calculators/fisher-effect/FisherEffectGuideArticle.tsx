import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { FISHER_EFFECT_FAQS } from './content';

export function FisherEffectGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Fisher Effect Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The Fisher effect connects nominal interest rates, expected inflation,
        and real interest rates — the purchasing-power view of a stated return.
        This calculator solves any one of the three using the exact Fisher
        equation by default and shows the common additive approximation for
        comparison. Nominal and real rates here are accounting identities under
        the equation, not guaranteed investment outcomes.
      </p>

      <h2
        id="what-is"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is the Fisher Effect? — Definition
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Irving Fisher described how the nominal rate embeds compensation for
        expected inflation so that the real rate reflects purchasing power.
        Observed markets may deviate because of risk, taxes, liquidity, and
        policy — so treat the equation as a theoretical relationship, not an
        automatic market law.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Fisher Effect Formula
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>(1 + i) = (1 + r)(1 + πᵉ)</p>
        <p>Approximate: i ≈ r + πᵉ</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Convert percentages to decimals before multiplying. The approximation
        is handy for small rates; the exact product form remains the calculator
        default.
      </p>

      <h2
        id="how-to-calculate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate the Fisher Effect
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Nominal 5%, expected inflation 2%:
      </p>
      <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Decimals: 0.05 and 0.02</li>
        <li>Gross factors: 1.05 and 1.02</li>
        <li>Divide: 1.05 / 1.02</li>
        <li>Subtract 1 and ×100 → ≈ 2.941176%</li>
        <li>Display as 2.94%; approximate r ≈ 5 − 2 = 3%</li>
      </ol>

      <h2
        id="interpret"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Interpret the Fisher Effect
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Positive r: nominal return exceeds expected inflation in purchasing-power terms</li>
        <li>Negative r: expected inflation exceeds the nominal return</li>
        <li>Zero r: nominal return offsets expected inflation under the equation</li>
      </ul>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Markets need not move nominal rates one-for-one with inflation
        expectations in every episode.
      </p>

      <h2
        id="nominal-vs-real"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Nominal Interest Rate vs. Real Interest Rate
      </h2>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[28rem] border-collapse text-left text-sm text-foreground/90">
          <thead>
            <tr className="border-b border-border text-accent">
              <th className="py-2 pr-3 font-semibold">Topic</th>
              <th className="py-2 pr-3 font-semibold">Nominal</th>
              <th className="py-2 font-semibold">Real</th>
            </tr>
          </thead>
          <tbody className="align-top">
            <tr className="border-b border-border/70">
              <td className="py-2 pr-3 font-medium">Definition</td>
              <td className="py-2 pr-3">Stated rate</td>
              <td className="py-2">Inflation-adjusted rate</td>
            </tr>
            <tr className="border-b border-border/70">
              <td className="py-2 pr-3 font-medium">Purchasing power</td>
              <td className="py-2 pr-3">Not adjusted</td>
              <td className="py-2">Adjusted via Fisher</td>
            </tr>
            <tr>
              <td className="py-2 pr-3 font-medium">Use</td>
              <td className="py-2 pr-3">Quotes, contracts</td>
              <td className="py-2">Compare living standards of returns</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2
        id="expected-inflation"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Expected Inflation and the Fisher Effect
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Expected inflation enters the Fisher equation; realized inflation may
        differ. Uncertainty, central-bank policy, and market pricing of risk all
        affect observed rates beyond the simple identity.
      </p>

      <h2
        id="exact-vs-approx"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Exact vs. Approximate Fisher Equation
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Example: i = 12%, πᵉ = 8%. Approximate r ≈ 4%. Exact r =
        ((1.12/1.08)−1)×100 ≈ 3.70%. The gap grows as rates rise — do not label
        the approximation as exact.
      </p>

      <h2
        id="examples"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Fisher Effect Examples
      </h2>
      <h3 className="mt-4 text-base font-semibold text-accent">
        Example 1: Normal inflation
      </h3>
      <p className="mt-2 font-mono text-sm text-accent">
        i=6%, πᵉ=3% → r=((1.06/1.03)−1)×100 ≈ 2.91%
      </p>
      <h3 className="mt-4 text-base font-semibold text-accent">
        Example 2: High inflation
      </h3>
      <p className="mt-2 font-mono text-sm text-accent">
        i=10%, πᵉ=12% → r=((1.10/1.12)−1)×100 ≈ −1.79% (negative real rate)
      </p>
      <h3 className="mt-4 text-base font-semibold text-accent">
        Example 3: Deflation
      </h3>
      <p className="mt-2 font-mono text-sm text-accent">
        i=2%, πᵉ=−1% → r=((1.02/0.99)−1)×100 ≈ 3.03% (real &gt; nominal)
      </p>

      <h2
        id="banking"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        The Fisher Effect in Banking and Lending
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Loans, mortgages, deposits, and bonds are often quoted in nominal terms.
        Real rates help interpret purchasing-power outcomes for borrowers and
        savers. Loan pricing also reflects credit risk, funding costs, and
        regulation — not the Fisher equation alone.
      </p>

      <h2
        id="monetary-policy"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Fisher Effect and Monetary Policy
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Central banks influence short-term nominal rates and shape inflation
        expectations that feed into longer rates. Applying a simple Fisher
        one-for-one rule to policy episodes oversimplifies transmission.
      </p>

      <h2
        id="ife"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Fisher Effect vs. International Fisher Effect
      </h2>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[28rem] border-collapse text-left text-sm text-foreground/90">
          <thead>
            <tr className="border-b border-border text-accent">
              <th className="py-2 pr-3 font-semibold">Concept</th>
              <th className="py-2 font-semibold">Focus</th>
            </tr>
          </thead>
          <tbody className="align-top">
            <tr className="border-b border-border/70">
              <td className="py-2 pr-3 font-medium">Fisher effect</td>
              <td className="py-2">i, r, and expected inflation</td>
            </tr>
            <tr>
              <td className="py-2 pr-3 font-medium">International Fisher Effect</td>
              <td className="py-2">
                Cross-country nominal rate gaps ↔ expected FX changes (separate
                theory; not an exact FX forecast)
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations of the Fisher Effect
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Uncertain or biased inflation expectations</li>
        <li>Taxes, risk premiums, liquidity premiums</li>
        <li>Market frictions and policy interventions</li>
        <li>Real rates themselves can change for non-inflation reasons</li>
        <li>Expected vs realized inflation differ</li>
      </ul>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use the Fisher Effect Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Select real, nominal, or expected-inflation mode</li>
        <li>Enter the two known rates</li>
        <li>Review the exact computed rate</li>
        <li>Compare with the approximate result</li>
        <li>Read the interpretation and formula breakdown</li>
        <li>Reset or adjust inputs as needed</li>
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
            href="/tools/currency-forward-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Currency Forward Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/carry-trade-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Carry Trade Calculator
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
        id="fisher-effect-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...FISHER_EFFECT_FAQS]} />
      </div>
    </article>
  );
}
