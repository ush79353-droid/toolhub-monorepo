import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { VELOCITY_OF_MONEY_FAQS } from './content';

export function VelocityOfMoneyGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Velocity of Money Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Use this velocity of money calculator to estimate how frequently money
        circulates through an economy in an accounting sense. Enter a price
        index and transaction volume (with a base basket price), a direct
        nominal transaction total, or nominal GDP, together with a money stock,
        to compute velocity for a chosen period. You can also reverse-solve for
 money supply or the nominal flow. Results are educational ratios; not
        forecasts of inflation or growth.
      </p>

      <h2
        id="what-is"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is the Velocity of Money?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        In macroeconomics, the velocity of money relates aggregate nominal
        spending or transaction value to the quantity of money. If nominal GDP
        is three times the measured money stock during a year, GDP-based
        velocity is three turnovers per year. The ratio helps describe how
        intensively a money stock supports monetary flows, but it does not
        literally count how many times each bill changed hands.
      </p>

      <h2
        id="equation"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Velocity of Money Equation
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The Fisher equation of exchange is often written:
      </p>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>MV = PT</p>
        <p>V = PT / M = T_nominal / M</p>
        <p>MV = PY (income form)</p>
        <p>V_GDP = Nominal GDP / M</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Here M is the money stock, V velocity, P a price measure, T real
        transaction volume, and PT (or T_nominal) nominal transaction value. In
        the income form, P is an aggregate price level and Y real output, so PY
        is nominal GDP. The transactions and GDP versions use different
        numerators and should not be treated as identical.
      </p>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A dimensionless price index is not itself a currency price. To build
        PT from an index and a volume count, you need a base basket price (or
        an equivalent quantity definition): price = basePrice × (P /
        indexBase), then T_nominal = price × N.
      </p>

      <h2
        id="how-to-calculate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Velocity of Money
      </h2>
      <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Choose transaction-based or GDP-based velocity.</li>
        <li>Enter the correct nominal flow (transactions or GDP).</li>
        <li>Enter the money stock for a labeled aggregate (M1, M2, base, other).</li>
        <li>Confirm the measurement period and amount magnitude.</li>
        <li>Divide nominal flow by money stock (or use reverse solve).</li>
        <li>Interpret V as an aggregate turnover ratio for that period.</li>
      </ol>

      <h2
        id="example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Example: Using the Velocity of Money Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Suppose total nominal transactions are $1,500,000 and money in
        circulation is $500,000 over one year:
      </p>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>V = 1,500,000 / 500,000 = 3 turnovers/year</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Money circulates at an average rate of three transaction-value turnovers
        during the year under the selected measure. A GDP example: $25 trillion
        nominal GDP and $20 trillion money stock → V_GDP = 1.25 (illustrative,
        not a current statistic). Reverse example: with T = $4 trillion and V =
        2, money stock M = $2 trillion.
      </p>

      <h2
        id="high-velocity"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Does a High Velocity of Money Mean?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        High measured velocity means substantial nominal activity relative to
        the money stock. That can accompany strong spending, but also inflation
        pressure, measurement quirks, or shifts in money demand. High velocity
        is not automatically a sign of a healthy economy.
      </p>

      <h2
        id="low-velocity"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Does a Low Velocity of Money Mean?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Low velocity often appears when the money stock grows faster than
        nominal flows, or when spending is weak relative to balances people
        hold. Possible contributors include higher money demand, increased
        saving, monetary expansion, payment-habit changes, or uncertainty. Low
        velocity does not by itself prove recession.
      </p>

      <h2
        id="factors"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Factors Affecting the Velocity of Money
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Consumer spending, saving patterns, inflation expectations, interest
        rates, money demand, banking conditions, payment technologies, economic
        confidence, monetary policy, and financial innovation all influence
        measured V. Changes in how M1 or M2 are defined can also jump the
        series without any change in “true” circulation intensity.
      </p>

      <h2
        id="inflation"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Velocity of Money and Inflation
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        From MV = PY, growth in money or velocity can raise nominal spending.
        How that shows up in prices versus real output depends on capacity,
        expectations, and other shocks. The equation alone does not imply that
        an increase in money always produces an equal proportional rise in
        prices.
      </p>

      <h2
        id="growth"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Velocity of Money and Economic Growth
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Economists read velocity beside real GDP growth, nominal GDP, inflation,
        interest rates, and money-supply growth. A rising V with stable money
        growth can signal stronger nominal demand; a falling V during rapid
        money growth can mean balances are being absorbed without matching
        spending. Interpretation requires the full context.
      </p>

      <h2
        id="quantity-theory"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        The Quantity Theory of Money
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Classical quantity-theory reasoning often assumes that velocity is
        relatively stable and that real output is determined by real factors, so
        that money growth maps closely into prices. Modern practice treats those
        assumptions as empirical questions. Distinguish the accounting identity
        MV = PY from any causal claim about money and inflation.
      </p>

      <h2
        id="transaction-vs-income"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Transaction Velocity vs. Income Velocity
      </h2>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[28rem] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-border text-accent">
              <th className="py-2 pr-3 font-semibold">Feature</th>
              <th className="py-2 pr-3 font-semibold">Transaction velocity</th>
              <th className="py-2 font-semibold">GDP-based velocity</th>
            </tr>
          </thead>
          <tbody className="text-foreground/90">
            <tr className="border-b border-border">
              <td className="py-2 pr-3">Numerator</td>
              <td className="py-2 pr-3">Nominal value of transactions</td>
              <td className="py-2">Nominal GDP</td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-2 pr-3">Denominator</td>
              <td className="py-2 pr-3">Selected money stock</td>
              <td className="py-2">Selected money stock</td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-2 pr-3">Interpretation</td>
              <td className="py-2 pr-3">Transaction-value turnover</td>
              <td className="py-2">Income/output turnover</td>
            </tr>
            <tr>
              <td className="py-2 pr-3">Main use</td>
              <td className="py-2 pr-3">Transactions analysis</td>
              <td className="py-2">Macroeconomic analysis</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Results differ because GDP excludes many intermediate and financial
        transactions that may appear in a broader transactions measure.
      </p>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations of Velocity of Money
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Different monetary aggregates change measured V.</li>
        <li>Period mismatches (monthly flows vs annual stocks) distort ratios.</li>
        <li>Financial versus goods-and-services transactions differ.</li>
        <li>Nominal versus real concepts must not be confused.</li>
        <li>Transaction statistics are often incomplete.</li>
        <li>Payment behavior and definitions evolve.</li>
        <li>Velocity is a ratio; causation is not automatic.</li>
        <li>Stocks and flows must be defined consistently.</li>
      </ul>

      <h2
        id="related"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related Calculators
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <Link href="/tools/money-supply-calculator" className="font-medium text-primary underline-offset-2 hover:underline">
            Money Supply Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/money-multiplier-calculator" className="font-medium text-primary underline-offset-2 hover:underline">
            Money Multiplier Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/fisher-equation-calculator" className="font-medium text-primary underline-offset-2 hover:underline">
            Fisher Equation Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/fisher-effect-calculator" className="font-medium text-primary underline-offset-2 hover:underline">
            Fisher Effect Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/real-gdp-calculator" className="font-medium text-primary underline-offset-2 hover:underline">
            Real GDP Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/gdp-growth-rate-calculator" className="font-medium text-primary underline-offset-2 hover:underline">
            GDP Growth Rate Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/inflation-calculator" className="font-medium text-primary underline-offset-2 hover:underline">
            Inflation Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/reserve-ratio-calculator" className="font-medium text-primary underline-offset-2 hover:underline">
            Reserve Ratio Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/mpc-calculator" className="font-medium text-primary underline-offset-2 hover:underline">
            MPC Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/spending-multiplier-calculator" className="font-medium text-primary underline-offset-2 hover:underline">
            Spending Multiplier Calculator
          </Link>
        </li>
      </ul>

      <h2
        id="velocity-of-money-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...VELOCITY_OF_MONEY_FAQS]} />
      </div>
    </article>
  );
}
