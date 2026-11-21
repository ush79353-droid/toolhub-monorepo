import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { MONEY_MULTIPLIER_FAQS } from './content';

export function MoneyMultiplierGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Money Multiplier Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This Money Multiplier Calculator helps you explore a simplified
        macroeconomic accounting relationship among checkable deposits, bank
        reserves, currency in circulation, the monetary base, money supply, and
        the money multiplier. Enter deposits and either a reserve ratio or bank
        reserves, plus currency held by the public, to compute reserves (when
        derived), monetary base, money supply, and m = M/B. The tool also shows
        the currency-to-deposit and reserve-to-deposit ratios and the theoretical
        simple deposit multiplier 1/r so you can compare textbook identities side
        by side.
      </p>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The monetary base matters because it summarizes currency outside banks
 plus reserves inside the banking system: the “outside” money stock that
        often anchors classroom models of money creation. Deposits and reserves
        are linked through the reserve ratio: reserves equal deposits times the
        ratio when you treat the ratio as the source of truth, or the ratio
        equals reserves divided by deposits when you enter reserves directly.
        Interpreting the result means reading m as how large measured money
 supply is relative to that base under these definitions; useful for
        learning macroeconomics, not as a forecast of inflation or a claim that
        every modern banking system expands deposits by a fixed multiple of new
        reserves.
      </p>

      <h2
        id="what-is"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is a Money Multiplier?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Economists often call the money multiplier the ratio of a money-supply
        aggregate to the monetary base. In symbols, m = M/B. Here M is a
        simplified money supply equal to currency in circulation plus checkable
        deposits, and B is currency plus bank reserves. The multiplier therefore
        embeds three building blocks: how much cash the public holds outside
        banks, how large transaction deposits are, and how many reserves banks
        hold against those deposits.
      </p>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Thinking in ratios clarifies the same idea. Let c be currency divided by
        deposits and r be reserves divided by deposits. Then M = deposits ×
        (1 + c) and B = deposits × (r + c), so m = (1 + c)/(r + c) whenever
        deposits are positive. That identity is algebraically equivalent to M/B
        under these definitions. It does not by itself describe bank capital,
 loan demand, or central-bank interest-rate corridors; it organizes the
        accounting links among currency, reserves, deposits, base, and supply.
      </p>

      <h2
        id="how-works"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Does the Money Multiplier Work?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Traditional textbook stories start with an initial deposit, a required
        (or desired) reserve fraction, and lending of excess reserves. A
        borrower spends the loan; the recipient deposits funds at another bank;
        that bank keeps a fraction and lends again. Repeating the process
        produces a geometric series of deposits whose theoretical sum approaches
        the initial excess reserves times 1/r when nobody holds extra currency
        and banks hold no excess reserves beyond r.
      </p>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Real-world deposit and loan creation also depend on bank capital ratios,
        liquidity rules, credit demand, funding costs, borrower risk, and
        central-bank policy tools such as reserve remuneration and standing
        facilities. Banks may hold large excess reserves even when reserve
        requirements are low or zero. The calculator therefore separates the
        observed supply-to-base ratio m from the idealized deposit multiplier
        1/r and reminds you that the mechanical expansion narrative is a
        teaching device with restrictive assumptions.
      </p>

      <h2
        id="fractional-reserve"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is Fractional Reserve Banking?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Fractional reserve banking describes systems in which commercial banks
 hold reserves (vault cash and balances at the central bank) that are
        only a fraction of deposit liabilities. Depositors can still withdraw or
        transfer funds in the ordinary course of business because only a portion
        of deposits is demanded as cash at once, while banks earn returns by
        lending or investing the remainder subject to risk management and
        regulation.
      </p>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Reserve requirements, when they exist, set a minimum ratio of reserves to
        certain deposits. Many jurisdictions have reduced or eliminated binding
        reserve requirements; banks still hold reserves for settlement,
        liquidity, and policy reasons. Excess reserves are holdings above any
        required minimum. Central-bank balances are a core part of modern
 reserve stocks. This calculator’s reserve ratio is a modeling input; 
        the default 10% is an example for arithmetic, not a statement that every
        country currently mandates a 10% requirement.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Money Multiplier Formula
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>m = M / B</p>
        <p>B = Currency in circulation + Bank reserves</p>
        <p>M = Currency in circulation + Checkable deposits</p>
        <p>Bank reserves = Checkable deposits × (Reserve ratio / 100)</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Here m is the money multiplier, M the simplified money supply, and B the
        monetary base. When B is zero, the ratio is undefined; the calculator
        shows an unavailable state instead of Infinity or NaN. Official national
        aggregates labeled M1 or M2 may include additional instruments or exclude
 some items used here; treat M as a pedagogical definition aligned with
        the inputs on this page.
      </p>

      <h2
        id="ratios"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Currency-to-Deposit and Reserve-to-Deposit Ratios
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>c = Currency / Deposits</p>
        <p>r = Reserves / Deposits</p>
        <p>m = (1 + c) / (r + c)</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The currency-deposit ratio c rises when the public prefers cash relative
        to deposits, which increases both M and B but typically lowers m for a
        fixed r. The reserve-deposit ratio r rises when banks hold more reserves
        per deposit, which increases B and lowers m. The formula m = (1+c)/(r+c)
        rearranges the same definitions of M and B; it assumes positive deposits
        and the simplified aggregates above. It does not guarantee that banks
        will lend until excess reserves disappear.
      </p>

      <h2
        id="simple-multiplier"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Simple Money Multiplier Formula
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>m_d = 1 / r</p>
        <p>Example: r = 0.10 → m_d = 10</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The simple deposit multiplier applies most cleanly in textbook problems
        that ignore public currency holdings (c = 0) and assume banks hold
        exactly fraction r of deposits as reserves with no other binding
        constraints. When c &gt; 0, m = (1+c)/(r+c) is generally smaller than
        1/r. Displaying m and m_d separately prevents mixing an accounting
        money-supply ratio with an idealized deposit-expansion factor.
      </p>

      <h2
        id="how-to-calculate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate the Money Multiplier
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Use the teaching example: checkable deposits = 1,000,000; reserve ratio =
        10%; currency in circulation = 200,000.
      </p>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          Convert the reserve ratio: 10% = 0.10. Bank reserves = 1,000,000 ×
          0.10 = 100,000.
        </li>
        <li>Monetary base B = 200,000 + 100,000 = 300,000.</li>
        <li>Money supply M = 200,000 + 1,000,000 = 1,200,000.</li>
        <li>Money multiplier m = 1,200,000 / 300,000 = 4.00×.</li>
        <li>
          Also c = 200,000/1,000,000 = 20%, r = 10%, and m_d = 1/0.10 = 10×
          (theoretical deposit multiplier).
        </li>
      </ol>

      <h2
        id="example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Money Multiplier Calculation Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Second example: deposits = 500,000; reserve ratio = 25%; currency =
        125,000. Reserves = 500,000 × 0.25 = 125,000. Base B = 125,000 + 125,000 =
        250,000. Supply M = 125,000 + 500,000 = 625,000. Multiplier m = 625,000 /
        250,000 = 2.50×. Here c = 125,000/500,000 = 25% and r = 25%, so (1+c)/(r+c)
        = 1.25/0.50 = 2.5, matching M/B. The simple deposit multiplier 1/0.25 = 4
        exceeds m because the public holds substantial currency relative to
        deposits.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use the Money Multiplier Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Enter checkable deposits and currency in circulation. Choose whether the
        reserve ratio or bank reserves is authoritative: editing the ratio
        recalculates reserves; editing reserves recalculates the ratio. Results
        show monetary base, money supply, money multiplier, c, r, and the
        separate simple deposit multiplier. Use Clear to blank editable fields,
        Reload to restore defaults, and Share/Copy to export a text summary.
 Currency selection changes denomination labels only; amounts are not
        converted across exchange rates.
      </p>

      <h2
        id="what-affects"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Affects the Money Multiplier?
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <strong className="font-semibold text-accent">
            Reserve-to-deposit ratio:
          </strong>{' '}
          Higher r raises B relative to M and lowers m.
        </li>
        <li>
          <strong className="font-semibold text-accent">
            Currency-to-deposit ratio:
          </strong>{' '}
          Higher c usually compresses m toward 1 in the (1+c)/(r+c) form.
        </li>
        <li>
          <strong className="font-semibold text-accent">
            Bank reserve preferences:
          </strong>{' '}
          Precautionary or regulatory liquidity holdings can lift r above any
          statutory floor.
        </li>
        <li>
          <strong className="font-semibold text-accent">
            Central bank policy:
          </strong>{' '}
          Rate corridors, QE, and reserve remuneration change the opportunity
          cost of holding reserves.
        </li>
        <li>
          <strong className="font-semibold text-accent">
            Deposit and credit demand:
          </strong>{' '}
          Weak loan demand can leave reserves idle even when r looks low.
        </li>
        <li>
          <strong className="font-semibold text-accent">
            Uncertainty and funding conditions:
          </strong>{' '}
          Stress can raise cash demand (c) and desired liquid buffers.
        </li>
        <li>
          <strong className="font-semibold text-accent">
            Changes in the monetary base:
          </strong>{' '}
          Base expansions that are not matched by deposits reduce measured m.
        </li>
      </ul>

      <h2
        id="monetary-policy"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Money Multiplier and Monetary Policy
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Historically, multiplier language appeared in discussions of how changes
        in the monetary base might map into broader money aggregates. Central
        banks influence reserves and the base through open-market operations,
        lending facilities, and large-scale asset purchases. Commercial bank
        lending responds to policy rates, credit standards, borrower demand, and
 capital rules; not only to a fixed r.
      </p>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Quantitative easing can inflate bank reserves and the base while deposit
        growth follows a different path, so measured multipliers may fall.
        Remunerating reserves changes banks’ willingness to hold central-bank
        balances. Contemporary frameworks often target short-term interest rates
        (sometimes with abundant reserves) rather than steering M through a
        stable multiplier. Do not read this calculator as claiming that central
        banks mechanically control money supply via a constant m.
      </p>

      <h2
        id="inflation"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is the Relationship Between the Money Multiplier and Inflation?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Inflation links prices to spending relative to the economy’s productive
        capacity, expectations, and relative price shocks. A larger monetary base
        or a higher multiplier does not mechanically guarantee a particular
        inflation rate. Velocity of money, fiscal conditions, supply constraints,
        and policy reaction functions all matter. Use the multiplier to
        understand stock relationships among M and B; pair it with broader
 macro analysis, and tools such as an{' '}
        <Link
          href="/tools/inflation-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          inflation calculator
        </Link>{' '}
 when studying price-level questions.
      </p>

      <h2
        id="vs-deposit"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Money Multiplier vs. Deposit Multiplier
      </h2>
      <div className="my-4 overflow-x-auto">
        <table className="w-full min-w-[28rem] border-collapse text-left text-sm text-foreground/90">
          <thead>
            <tr className="border-b border-border text-accent">
              <th className="py-2 pr-3 font-semibold">Topic</th>
              <th className="py-2 pr-3 font-semibold">Money supply multiplier</th>
              <th className="py-2 font-semibold">Simple deposit multiplier</th>
            </tr>
          </thead>
          <tbody className="align-top">
            <tr className="border-b border-border">
              <td className="py-2 pr-3 font-medium text-accent">Definition</td>
              <td className="py-2 pr-3">Ratio of money supply to monetary base</td>
              <td className="py-2">Idealized deposit expansion factor 1/r</td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-2 pr-3 font-medium text-accent">Formula</td>
              <td className="py-2 pr-3">m = M/B or (1+c)/(r+c)</td>
              <td className="py-2">m_d = 1/r</td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-2 pr-3 font-medium text-accent">Assumptions</td>
              <td className="py-2 pr-3">
                Simplified M and B definitions; nonnegative stocks
              </td>
              <td className="py-2">
                Often c = 0, no excess reserves, unlimited lending
              </td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-2 pr-3 font-medium text-accent">Use cases</td>
              <td className="py-2 pr-3">
                Compare aggregates; teach base–supply links
              </td>
              <td className="py-2">Classroom deposit-expansion arithmetic</td>
            </tr>
            <tr>
              <td className="py-2 pr-3 font-medium text-accent">Limitations</td>
              <td className="py-2 pr-3">
                Not official M1/M2; ignores many banking constraints
              </td>
              <td className="py-2">
                Rarely predicts real deposit paths when c &gt; 0 or banks hold
                excess reserves
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations of the Money Multiplier Model
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The model simplifies assumptions about how banks choose portfolios and
        how the public chooses cash versus deposits. Lending is endogenous:
        creditworthy demand and bank risk appetite matter as much as spare
        reserves. Capital requirements, liquidity coverage rules, and funding
        markets can bind before a textbook reserve ratio does. Money demand and
        velocity shift with technology and confidence. Central-bank operating
 frameworks (scarce versus abundant reserves) change what “more base”
        means for rates and credit. Official monetary aggregates differ from the
        simplified M used here. Treat results as educational accounting, not a
        complete description of modern money creation.
      </p>

      <h2
        id="relevance"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Relevance of the Money Multiplier in Macroeconomics
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Despite limitations, the multiplier remains a clear introductory way to
        connect reserves, currency, deposits, base, and supply in one set of
        identities. Students can see why cash leakage and higher reserve
        holdings shrink m relative to 1/r, and why base expansions need not map
        one-for-one into M. When analyzing modern systems with interest on
        reserves and endogenous credit, keep the multiplier as an accounting
        lens rather than a structural constant that policy “sets.”
      </p>

      <h2
        id="applications"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Money Multiplier Examples and Practical Applications
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Instructors use these identities in banking and intermediate macro
        courses. Analysts compare simplified M and B to build intuition before
        reading official aggregate tables. Classroom exercises vary r and c to
        show sensitivity. Comparing m with 1/r highlights the role of currency
        holdings. Pair this tool with growth and price-level calculators when
 framing broader macroeconomic scenarios; always noting that this page
        does not estimate national statistics or policy outcomes.
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
            href="/tools/inflation-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Inflation Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/cpi-inflation-calculator"
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
      </ul>

      <h2
        id="money-multiplier-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion faqs={[...MONEY_MULTIPLIER_FAQS]} />
      </div>
    </article>
  );
}
