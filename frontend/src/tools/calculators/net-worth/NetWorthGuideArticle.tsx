import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import {
  AGE_BENCHMARKS,
  ALL_FAMILIES_BENCHMARK,
  INCOME_BENCHMARKS,
  SCF_SOURCE,
} from './benchmarks';
import { formatMoneyWithSymbol } from './calculation';
import { NET_WORTH_FAQS } from './content';

export function NetWorthGuideArticle() {
  const usd = (v: number) => formatMoneyWithSymbol(v, 'USD');

  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <p className="text-sm leading-relaxed text-foreground/90 sm:text-base">
        Net worth is a snapshot of financial position: what you own minus what
        you owe. Tracking it helps you see progress, spot debt pressure, and
        plan wealth-building steps. This calculator totals your assets and
        liabilities, then optionally compares your result with US household
        benchmarks from the Federal Reserve Survey of Consumer Finances (SCF)
        2022. Household statistics are not the same as individual finances.
      </p>

      <h2
        id="what-is-net-worth"
        className="mt-8 text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What is net worth? Definition
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>NetWorth = TotalAssets − TotalLiabilities</p>
      </div>
      <h3 className="mt-4 text-base font-semibold text-accent">
        What assets are included in net worth?
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Typical assets include your primary residence, holiday homes, other
        real estate, stocks and financial investments, motor vehicles, savings
        and checking accounts, retirement and other investments, and other
        valuable possessions you can reasonably value.
      </p>
      <h3 className="mt-4 text-base font-semibold text-accent">
        What liabilities are included in net worth?
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Liabilities include mortgage balances, car loans, personal loans,
        student loans, lease-purchase obligations, consumer loans, credit card
        and store-card debt, and other outstanding debts.
      </p>
      <h3 className="mt-4 text-base font-semibold text-accent">
        What is excluded from net worth?
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Future salary and other unearned future income are not current assets.
 Treat personal possessions and debts consistently if you count an
        item&apos;s value, also count any loan tied to it.
      </p>

      <h2
        id="how-to-calculate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to calculate net worth?
      </h2>
      <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Calculate the value of all assets.</li>
        <li>Calculate all outstanding liabilities.</li>
        <li>Subtract total liabilities from total assets.</li>
      </ol>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Example: assets {usd(480_000)} − liabilities {usd(200_000)} = net worth{' '}
        {usd(280_000)}. Positive net worth means assets exceed debts; negative
        means debts exceed assets; zero means they are equal.
      </p>

      <h2
        id="net-worth-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What net worth formula is applied in our calculator?
      </h2>
      <div className="my-4 overflow-x-auto rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>TotalAssets = A₁ + A₂ + ⋯ + A₉</p>
        <p className="mt-2">TotalLiabilities = L₁ + L₂ + ⋯ + L₈</p>
        <p className="mt-2">NetWorth = TotalAssets − TotalLiabilities</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Each Aᵢ is one asset field (home, investments, cash, vehicles, and so
        on). Each Lⱼ is one liability field (mortgage, loans, credit cards, and
        so on). The calculator sums both sides, then subtracts.
      </p>

      <h2
        id="average-us-net-worth"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Average net worth in the US
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        US household net worth varies with age, income, housing status, and
        wealth distribution. The Federal Reserve SCF reports both{' '}
        <strong>median</strong> (typical family) and <strong>mean/average</strong>{' '}
        (pulled upward by high-wealth households). For all families in 2022:
        median {usd(ALL_FAMILIES_BENCHMARK.medianUsd)}, mean{' '}
        {usd(ALL_FAMILIES_BENCHMARK.meanUsd)} (2022 dollars).
      </p>
      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full text-left text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-border text-accent">
              <th className="py-2 pr-3 font-semibold">Group (SCF 2022)</th>
              <th className="py-2 pr-3 font-semibold">Median</th>
              <th className="py-2 font-semibold">Mean (average)</th>
            </tr>
          </thead>
          <tbody className="text-foreground/90">
            <tr className="border-b border-border/70">
              <td className="py-2 pr-3">All families</td>
              <td className="py-2 pr-3 tabular-nums">
                {usd(ALL_FAMILIES_BENCHMARK.medianUsd)}
              </td>
              <td className="py-2 tabular-nums">
                {usd(ALL_FAMILIES_BENCHMARK.meanUsd)}
              </td>
            </tr>
            {AGE_BENCHMARKS.map((row) => (
              <tr key={row.id} className="border-b border-border/70">
                <td className="py-2 pr-3">{row.label}</td>
                <td className="py-2 pr-3 tabular-nums">{usd(row.medianUsd)}</td>
                <td className="py-2 tabular-nums">{usd(row.meanUsd)}</td>
              </tr>
            ))}
            {INCOME_BENCHMARKS.map((row) => (
              <tr key={row.id} className="border-b border-border/70">
                <td className="py-2 pr-3">{row.label}</td>
                <td className="py-2 pr-3 tabular-nums">{usd(row.medianUsd)}</td>
                <td className="py-2 tabular-nums">{usd(row.meanUsd)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
        Source: {SCF_SOURCE}
      </p>

      <h2
        id="increase-net-worth"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to increase your net worth
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Reduce unnecessary expenses and high-interest debt.</li>
        <li>Build an emergency fund and increase savings contributions.</li>
        <li>Invest consistently and diversify within your risk tolerance.</li>
        <li>Grow earning potential and review goals periodically.</li>
        <li>Avoid accumulating unnecessary liabilities.</li>
        <li>Track asset values and debt balances over time.</li>
      </ul>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Building net worth generally means both growing assets and managing
        liabilities. This page does not promise investment returns.
      </p>

      <h2
        id="related-calculators"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related calculators
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Explore related tools such as{' '}
        <Link
          href="/tools/millionaire-calculator"
          className="text-primary underline-offset-2 hover:underline"
        >
          Millionaire Calculator
        </Link>
        ,{' '}
        <Link
          href="/tools/emergency-fund-calculator"
          className="text-primary underline-offset-2 hover:underline"
        >
          Emergency Fund Calculator
        </Link>
        ,{' '}
        <Link
          href="/tools/savings-calculator"
          className="text-primary underline-offset-2 hover:underline"
        >
          Savings Calculator
        </Link>
        , and{' '}
        <Link
          href="/tools/fire-calculator-financial-independence-retire-early"
          className="text-primary underline-offset-2 hover:underline"
        >
          FIRE Calculator
        </Link>
        .
      </p>

      <h2
        id="net-worth-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently asked questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion items={[...NET_WORTH_FAQS]} />
      </div>
    </article>
  );
}
