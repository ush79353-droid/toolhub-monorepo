import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { TAX_EQUIVALENT_YIELD_FAQS } from './content';

export function TaxEquivalentYieldGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Tax Equivalent Yield Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Use this Tax Equivalent Yield Calculator (taxable equivalent yield) to
        find the before-tax yield a fully taxable investment must earn to match
        a tax-exempt investment — such as a qualifying municipal bond — at your
        applicable marginal tax rate. Investors compare taxable and tax-exempt
        quotes because headline yields are not directly comparable when taxes
        differ. Enter the tax-exempt bond yield and marginal tax rate to compute
        TEY in real time, or reverse-solve for the required tax-exempt yield or
        implied tax rate. An optional panel compares a taxable investment&apos;s
        after-tax yield with the tax-exempt quote.
      </p>

      <h2
        id="definition"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is Tax Equivalent Yield?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Tax equivalent yield is the pre-tax yield required from a fully taxable
        investment to produce the same after-tax income as a tax-exempt yield,
        assuming the selected marginal rate applies to the taxable interest.
        Higher marginal rates raise the taxable hurdle needed to match a given
        muni yield. The measure links three ideas: the tax-exempt yield, the
        taxable yield, and the fraction of taxable interest retained after tax.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Tax Equivalent Yield Formula
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>TEY = Y / (1 − t)</p>
        <p>Y = TEY × (1 − t)</p>
        <p>t (%) = (1 − Y / TEY) × 100</p>
        <p>Y_after-tax = Y_taxable × (1 − t)</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Y is the tax-exempt yield (%). t is the marginal tax rate as a decimal
        (30% → 0.30). The denominator (1 − t) is the share of taxable interest
        retained after tax under this simplified model. Do not divide the bond
        yield by the tax rate itself.
      </p>

      <h2
        id="how-to-calculate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Tax Equivalent Yield
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Tax-exempt yield Y = 6%.</li>
        <li>Marginal tax rate = 30% → t = 0.30.</li>
        <li>Retention factor = 1 − 0.30 = 0.70.</li>
        <li>
          TEY = 6% ÷ 0.70 ≈ <strong>8.57%</strong>.
        </li>
      </ol>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A taxable bond would need about 8.57% before tax to match a 6%
        tax-exempt yield for an investor in the 30% bracket under these
        assumptions.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use the Tax Equivalent Yield Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter the tax-exempt bond yield (%).</li>
        <li>Enter the applicable marginal tax rate (%), less than 100%.</li>
        <li>Review the taxable equivalent yield and retention factor.</li>
        <li>Compare TEY with taxable investment quotes using the same yield convention.</li>
        <li>Optionally enter a taxable yield to see after-tax yield and the gap.</li>
        <li>Weigh credit risk, liquidity, duration, call risk, fees, and tax nuances.</li>
      </ol>

      <h2
        id="tax-free-vs-taxable"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Tax-Free Bonds vs. Taxable Bonds
      </h2>
      <div className="my-4 overflow-x-auto rounded-xl border border-border">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-muted/40 text-accent">
            <tr>
              <th className="px-3 py-2 font-semibold">Feature</th>
              <th className="px-3 py-2 font-semibold">Tax-exempt (e.g. muni)</th>
              <th className="px-3 py-2 font-semibold">Taxable (e.g. corporate)</th>
            </tr>
          </thead>
          <tbody className="text-foreground/90">
            <tr className="border-t border-border">
              <td className="px-3 py-2">Quoted yield</td>
              <td className="px-3 py-2">Often after specified income taxes</td>
              <td className="px-3 py-2">Before income tax on interest</td>
            </tr>
            <tr className="border-t border-border">
              <td className="px-3 py-2">Comparison tool</td>
              <td className="px-3 py-2">Use TEY to convert</td>
              <td className="px-3 py-2">Compare to TEY or after-tax yield</td>
            </tr>
            <tr className="border-t border-border">
              <td className="px-3 py-2">Typical risks</td>
              <td className="px-3 py-2">Issuer credit, call, liquidity</td>
              <td className="px-3 py-2">Credit, rate, liquidity, call</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Municipal, corporate, and government securities differ in tax treatment,
        credit standing, and liquidity. TEY equalizes only the tax dimension of
        the yields you enter.
      </p>

      <h2
        id="marginal-rate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is a Marginal Tax Rate?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The marginal rate is the tax on an additional dollar of taxable income
        in the relevant bracket. The effective rate is total tax divided by
        total income and is usually lower. TEY uses the marginal rate that would
        apply to the taxable interest being compared — which may differ from
        ordinary wage brackets if special rules apply. Use the rate applicable
        to the investment income, not a vague average.
      </p>

      <h2
        id="why-matters"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Why Tax Equivalent Yield Matters
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        TEY helps compare taxable and tax-exempt returns, screen municipal
        bonds, support tax-aware portfolio construction, and translate after-tax
        income goals into taxable yield hurdles. It is a planning aid, not a
        recommendation to buy or sell any security.
      </p>

      <h2
        id="example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Tax Equivalent Yield Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Second example: tax-exempt yield = 4%, marginal tax rate = 25%.
      </p>
      <p className="mt-3 font-mono text-sm text-accent">
        TEY = 4% ÷ (1 − 0.25) = 4% ÷ 0.75 ≈ 5.33%
      </p>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A taxable investment would need about 5.33% before tax to match 4%
        tax-exempt for an investor in a 25% marginal bracket under these
        assumptions.
      </p>

      <h2
        id="compare"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Compare Taxable and Tax-Exempt Bond Returns
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        After-tax taxable yield ≈ Y_taxable × (1 − t). Example: taxable 7.5% at
        30% tax → 7.5% × 0.70 = 5.25%. Against a 6% tax-exempt yield, the
        tax-exempt quote is 0.75 percentage points higher after tax under these
        inputs — still not automatically the better bond once credit, duration,
        call risk, fees, and other taxes are considered.
      </p>

      <h2
        id="federal-state"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Federal and State Taxes Affect Bond Yields
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Qualifying municipal interest is often exempt from federal income tax,
        and may be exempt from state or local tax for residents of the issuing
        state — but not always. Out-of-state munis can be state-taxable.
        Tax-deferred accounts differ from tax-exempt bonds. Alternative Minimum
        Tax can affect some private-activity bonds. Combined federal-plus-state
        rates are not a simple sum when deductibility or caps apply; this
        calculator uses one explicit marginal rate you supply rather than a
        hardcoded combined-tax model.
      </p>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations of Tax Equivalent Yield
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Ignores credit and default risk differences.</li>
        <li>Ignores interest-rate risk, duration, and call features.</li>
        <li>Ignores liquidity and investment fees unless baked into inputs.</li>
        <li>Assumes the entered tax rate applies cleanly to the interest.</li>
        <li>Depends on consistent yield conventions (YTM vs current yield, etc.).</li>
        <li>Tax law and personal circumstances can change.</li>
        <li>Does not include inflation or real-return adjustments.</li>
      </ul>

      <h2
        id="when-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        When Should You Use a Tax Equivalent Yield Calculator?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Useful for individual investors, retirement planners, bond investors,
        portfolio analysts, and advisors who need a quick tax-aware comparison
        between tax-exempt and taxable fixed income — always alongside full
        credit and structural analysis.
      </p>

      <h2
        id="related"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related Calculators
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Explore{' '}
        <Link
          href="/tools/bond-yield-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Bond Yield
        </Link>
        ,{' '}
        <Link
          href="/tools/bond-current-yield-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Bond Current Yield
        </Link>
        ,{' '}
        <Link
          href="/tools/bond-ytm-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Bond YTM
        </Link>
        ,{' '}
        <Link
          href="/tools/bond-price-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Bond Price
        </Link>
        ,{' '}
        <Link
          href="/tools/coupon-rate-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Coupon Rate
        </Link>
        ,{' '}
        <Link
          href="/tools/bond-equivalent-yield-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Bond Equivalent Yield
        </Link>
        ,{' '}
        <Link
          href="/tools/effective-interest-rate-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Effective Interest Rate
        </Link>
        ,{' '}
        <Link
          href="/tools/interest-rate-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Interest Rate
        </Link>
        ,{' '}
        <Link
          href="/tools/inflation-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Inflation
        </Link>
        , and{' '}
        <Link
          href="/tools/after-tax-cost-of-debt-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          After-Tax Cost of Debt
        </Link>
        .
      </p>

      <h2
        id="tey-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion items={[...TAX_EQUIVALENT_YIELD_FAQS]} />
      </div>
    </article>
  );
}
