import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { MONEY_SUPPLY_FAQS } from './content';

export function MoneySupplyGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Money Supply Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Money supply measures the stock of monetary assets available under a
        chosen statistical definition — from currency and checking balances to
        broader deposit and money-market instruments. This calculator lets you
        assemble educational estimates of currency-only M0, the monetary base
        (MB), M1, M2, optional Money Zero Maturity (MZM), and, when the selected
        definition supports them, broader M3 and M4-style totals.
      </p>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Aggregate labels are not universal. The U.S. Federal Reserve currently
        emphasizes M1 and M2, discontinued M3 in 2006, and does not publish a
        standard M4. Choose a definition at the top of the tool, enter
        nonoverlapping components on one magnitude scale, and interpret results
        as model-based teaching calculations — not official central bank
        statistics.
      </p>

      <h2
        id="what-is"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is Money Supply?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Economists group liquid financial assets into monetary aggregates to
        track how much “money” the public holds. Currency outside banks,
        transferable deposits, savings-type balances (under some definitions),
        and certain money-market instruments appear in different layers of
        liquidity. Central banks publish official series with detailed manuals;
        textbooks often use simplified sums for classroom clarity. Liquidity —
        how quickly an asset converts to spending power at stable value —
        organizes the ladder from M0/MB toward broader Ms.
      </p>

      <h2
        id="components"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Components of the Money Supply Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Inputs include Federal Reserve–style notes and coins (for currency-only
        M0), currency in circulation and central-bank reserve balances (for MB),
        demand deposits, traveler’s checks, other checkable deposits, savings
        deposits, eligible money market funds, eligible time deposits, and — in
        textbook/custom modes — large time deposits, institutional money market
        funds, and other liquid instruments. Keeping components nonoverlapping
        prevents double counting when building M1 and M2.
      </p>

      <h2
        id="m0"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is M0 Money Supply?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This tool’s currency-only M0 equals notes plus coins. Some authors use
        “M0” loosely for the monetary base; we keep them separate so reserves
        are not silently mixed into a cash-only total.
      </p>

      <h2
        id="monetary-base"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is the Monetary Base?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The monetary base (MB), often called high-powered money in teaching
        models, is currency in circulation plus reserve balances at the central
        bank. Circulation may differ from notes and coins issued if vault cash
        or other adjustments matter in a national statistical treatment — enter
        circulation explicitly rather than assuming it always equals M0.
      </p>

      <h2
        id="m1"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is M1 Money Supply?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        M1 focuses on transaction balances. Historically, U.S. M1 emphasized
        currency, demand deposits, other checkable deposits, and traveler’s
        checks. In May 2020 the Federal Reserve redefined M1 to include savings
        deposits. This calculator’s U.S.-style and textbook illustrations follow
        that broader M1 so savings are not added again when forming M2.
      </p>

      <h2
        id="m2"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is M2 Money Supply?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        M2 equals M1 plus additional eligible instruments such as small
        time deposits and retail money market fund balances under the selected
        rules. It remains more liquid than many broader credit market tools but
        less purely transactional than narrow M1 components alone.
      </p>

      <h2
        id="m3"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is M3 Money Supply?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        M3 historically captured still broader money-like liabilities (for
        example large time deposits or institutional funds in some systems).
        Because the U.S. discontinued M3, Fed-style mode marks M3 unavailable.
        Textbook and custom modes add large time deposits and institutional MMFs
        to M2 as an explicit teaching aggregate.
      </p>

      <h2
        id="m4"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is M4 Money Supply?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        M4 is not a universal category. Some countries have used M4-style
        measures for broad liquidity. This calculator only offers a labeled
        custom/textbook M4 = M3 + other liquid instruments. Under U.S. Fed-style
        mode, M4 is unavailable.
      </p>

      <h2
        id="mzm"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is Money Zero Maturity?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Money Zero Maturity (MZM) aims to measure balances that are immediately
        redeemable at par. The educational MZM here sums currency, demand and
        other checkable deposits, savings, and eligible money market funds while
        excluding time deposits. It is distinct from M1 and M2 and is not treated
        as an automatic official series.
      </p>

      <h2
        id="formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Money Supply Formulas
      </h2>
      <div className="my-4 overflow-x-auto">
        <table className="w-full min-w-[32rem] border-collapse text-left text-sm text-foreground/90">
          <thead>
            <tr className="border-b border-border text-accent">
              <th className="py-2 pr-3 font-semibold">Aggregate</th>
              <th className="py-2 pr-3 font-semibold">Formula (this tool)</th>
              <th className="py-2 font-semibold">Scope note</th>
            </tr>
          </thead>
          <tbody className="align-top">
            <tr className="border-b border-border">
              <td className="py-2 pr-3 font-medium text-accent">M0</td>
              <td className="py-2 pr-3 font-mono text-xs">Notes + Coins</td>
              <td className="py-2">Currency-only</td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-2 pr-3 font-medium text-accent">MB</td>
              <td className="py-2 pr-3 font-mono text-xs">
                Circulation + Reserves
              </td>
              <td className="py-2">Monetary base</td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-2 pr-3 font-medium text-accent">M1</td>
              <td className="py-2 pr-3 font-mono text-xs">
                Circ. + Demand + TC + OCD + Savings
              </td>
              <td className="py-2">Selected nonoverlapping model</td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-2 pr-3 font-medium text-accent">M2</td>
              <td className="py-2 pr-3 font-mono text-xs">
                M1 + Eligible MMF + Eligible time
              </td>
              <td className="py-2">No double-counted savings</td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-2 pr-3 font-medium text-accent">MZM</td>
              <td className="py-2 pr-3 font-mono text-xs">
                Circ. + Demand + TC + OCD + Savings + MMF
              </td>
              <td className="py-2">Excludes time deposits</td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-2 pr-3 font-medium text-accent">M3</td>
              <td className="py-2 pr-3 font-mono text-xs">
                M2 + Large time + Inst. MMF
              </td>
              <td className="py-2">Textbook/custom only</td>
            </tr>
            <tr>
              <td className="py-2 pr-3 font-medium text-accent">M4</td>
              <td className="py-2 pr-3 font-mono text-xs">
                M3 + Other liquid instruments
              </td>
              <td className="py-2">Textbook/custom only</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2
        id="how-to"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Money Supply
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Choose the monetary aggregate definition.</li>
        <li>Collect component balances in one currency denomination.</li>
        <li>Apply one magnitude scale to every money input.</li>
        <li>Ensure components do not overlap.</li>
        <li>
          Compute M0 = 2,050,000 + 50,000 = 2,100,000 in the teaching example.
        </li>
        <li>
          Compute MB = 2,100,000 + 4,050,000 = 6,150,000.
        </li>
        <li>
          Compute M1 = 21,501,000 from currency and deposit components.
        </li>
        <li>
          Compute M2 = 21,501,000 + 500,000 + 640,000 = 22,641,000.
        </li>
        <li>Interpret results as definition-dependent model totals.</li>
      </ol>

      <h2
        id="banking"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Does Banking Affect the Money Supply?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Commercial banks intermediate deposits and loans. When banks grant loans,
        they typically create matching deposits, expanding measured money if those
        deposits sit inside the aggregate. Reserve balances, capital rules,
        liquidity requirements, credit demand, and funding markets constrain how
        far deposit creation can go. The traditional mechanical money-multiplier
        story — fixed reserve ratio, automatic expansion — is a teaching device
        with restrictive assumptions, not a complete description of modern
        banking.
      </p>

      <h2
        id="multiplier"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Money Supply and the Money Multiplier
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs text-accent sm:text-sm">
        Money Multiplier = Money Supply / Monetary Base
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Which money supply you place in the numerator (M1, M2, …) changes the
        ratio. Pair this page with the{' '}
        <Link
          href="/tools/money-multiplier-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Money Multiplier Calculator
        </Link>{' '}
        for a focused M/B worksheet.
      </p>

      <h2
        id="inflation"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Money Supply and Inflation
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Inflation relates spending, output capacity, expectations, and relative
        price shocks. Money growth can matter through demand and portfolio
        channels, but a change in M2 does not automatically cause an equal change
        in prices. Velocity and policy reaction functions also matter. Explore
        price-level tools such as the{' '}
        <Link
          href="/tools/inflation-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Inflation Calculator
        </Link>{' '}
        alongside monetary aggregates.
      </p>

      <h2
        id="aggregate-demand"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Can an Increase in Money Supply Affect Aggregate Demand?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Easier monetary conditions may lower financing costs, support asset
        prices, and encourage spending or investment. Channels include interest
        rates, credit supply, exchange rates, and confidence. Effects are
        context-dependent and can be muted when balance sheets or demand are
        weak.
      </p>

      <h2
        id="central-banks"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Do Central Banks Influence Money Supply?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Policy interest rates, reserve remuneration, open-market operations,
        quantitative easing or tightening, and standing facilities shape bank
        reserves and funding conditions. Modern frameworks often target rates
        rather than steering M2 through a fixed multiplier. Credit conditions and
        private-sector choices still determine many deposit outcomes.
      </p>

      <h2
        id="reserve-ratios"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate the Money Supply Increase With Reserve Ratios
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs text-accent sm:text-sm">
        Deposit Multiplier = 1 / Reserve Ratio
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Under idealized assumptions (no excess reserves, no currency drain,
        unlimited willing borrowers), a lower reserve ratio raises the textbook
        deposit multiplier. Real systems violate those assumptions frequently —
        treat 1/r as theory, not a forecast of national M2.
      </p>

      <h2
        id="compare"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Differences Between M0, MB, M1, M2, M3, and M4
      </h2>
      <div className="my-4 overflow-x-auto">
        <table className="w-full min-w-[30rem] border-collapse text-left text-sm text-foreground/90">
          <thead>
            <tr className="border-b border-border text-accent">
              <th className="py-2 pr-3 font-semibold">Measure</th>
              <th className="py-2 pr-3 font-semibold">Liquidity</th>
              <th className="py-2 font-semibold">Availability note</th>
            </tr>
          </thead>
          <tbody className="align-top">
            <tr className="border-b border-border">
              <td className="py-2 pr-3 font-medium text-accent">M0</td>
              <td className="py-2 pr-3">Cash notes/coins</td>
              <td className="py-2">Currency-only here</td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-2 pr-3 font-medium text-accent">MB</td>
              <td className="py-2 pr-3">Cash + reserves</td>
              <td className="py-2">Base / high-powered money</td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-2 pr-3 font-medium text-accent">M1</td>
              <td className="py-2 pr-3">Transaction money</td>
              <td className="py-2">Definitions shifted historically</td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-2 pr-3 font-medium text-accent">M2</td>
              <td className="py-2 pr-3">Broader retail money</td>
              <td className="py-2">Common policy/research aggregate</td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-2 pr-3 font-medium text-accent">M3</td>
              <td className="py-2 pr-3">Still broader</td>
              <td className="py-2">U.S. discontinued 2006</td>
            </tr>
            <tr>
              <td className="py-2 pr-3 font-medium text-accent">M4</td>
              <td className="py-2 pr-3">Jurisdiction-specific</td>
              <td className="py-2">Not a universal Fed series</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2
        id="why-important"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Why Is Money Supply Important?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Monetary aggregates support macro teaching, historical research,
        inflation analysis, and financial commentary. They help organize how
        currency, deposits, and near-monies fit together even when policy focuses
        primarily on interest rates.
      </p>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations of Money Supply Measures
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Cross-country definitions diverge; series are revised; financial
        innovation blurs lines between money and other claims; deposit
        classifications change; liquidity is continuous rather than discrete;
        double counting can distort homemade sums; and stock aggregates are not
        spending flows. Use this calculator to learn identities — verify official
        releases for research or policy work.
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
            href="/tools/money-multiplier-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Money Multiplier Calculator
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
            href="/tools/gdp-growth-rate-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            GDP Growth Rate Calculator
          </Link>
        </li>
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
            href="/tools/fisher-equation-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Fisher Equation Calculator
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
            href="/tools/buying-power-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Buying Power Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/gini-coefficient-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Gini Coefficient Calculator
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
      </ul>

      <h2
        id="money-supply-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion faqs={[...MONEY_SUPPLY_FAQS]} />
      </div>
    </article>
  );
}
