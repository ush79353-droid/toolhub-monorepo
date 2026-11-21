import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { NAV_FAQS } from './content';

export function NavGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Net Asset Value (NAV)?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Net asset value is a fund’s assets minus its liabilities — a measure of
        the fund’s net worth under the valuation rules it uses. Mutual funds and
        ETFs both report NAV concepts, but trading behavior differs. Total NAV
        is the fund-level figure; NAV per share divides that amount by shares
        outstanding.
      </p>

      <h2
        id="fund-assets"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Are Fund Assets?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Fund assets typically include investment holdings, cash and cash
        equivalents, and receivables. This calculator uses those three
        categories as a simplified model. Real fund statements may include more
        line items; avoid double-counting the same asset in more than one input.
      </p>

      <h2
        id="fund-liabilities"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Are Fund Liabilities?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Liabilities are amounts the fund owes — short-term items such as
        payables or accrued fees, and longer-term obligations. Actual fund
        accounting can be more detailed than the short-term plus long-term split
        used here.
      </p>

      <h2
        id="nav-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        NAV Formula
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Fund Assets (FA) = Investments + Cash + Receivables</p>
        <p>Fund Liabilities (FL) = Short-term + Long-term</p>
        <p>NAV = FA − FL</p>
      </div>

      <h2
        id="nav-per-share"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        NAV per Share Formula
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>NAV per share = NAV ÷ Outstanding shares</p>
        <p>Shares must be greater than zero</p>
      </div>

      <h2
        id="how-to-calculate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate NAV
      </h2>
      <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Sum investments, cash, and receivables → fund assets.</li>
        <li>Sum short-term and long-term liabilities → fund liabilities.</li>
        <li>Subtract liabilities from assets → NAV.</li>
        <li>Divide NAV by outstanding shares (if shares &gt; 0) → NAV per share.</li>
      </ol>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Investments 1,500,000 + Cash 250,000 + AR 50,000 = FA 1,800,000</p>
        <p>STL 50,000 + LTL 20,000 = FL 70,000</p>
        <p>NAV = 1,800,000 − 70,000 = 1,730,000</p>
        <p>100,000 shares → NAV/share = 17.30</p>
      </div>

      <h2
        id="mutual-funds"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How NAV Is Used in Mutual Funds
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Mutual funds use NAV to value the portfolio and often to price
        subscriptions and redemptions under fund rules. Fees and expenses reduce
        assets over time. Valuation is typically struck at defined times — not
        continuously — according to the fund’s prospectus.
      </p>

      <h2
        id="nav-vs-price"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        NAV vs Market Price
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        NAV reflects net assets under the fund’s valuation approach. ETF and
        closed-end market prices are set by trading and can sit above NAV
        (premium) or below NAV (discount). Do not treat market price and NAV as
        identical.
      </p>

      <h2
        id="performance"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Measure Investment Fund Performance Using NAV
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Comparing NAV across dates helps track changes in fund net worth, but
        investor total return should include reinvested distributions and fees.
        Distributions can lower NAV without meaning investors lost the
        distributed amount.
      </p>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations of NAV
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        NAV depends on market valuations, timing, liquidity of holdings,
        accounting adjustments, distributions, fees, and fund-specific
        calculation policies. This tool is a simplified educational model, not a
        substitute for official fund statements.
      </p>

      <h2
        id="nav-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion items={[...NAV_FAQS]} />
      </div>
    </article>
  );
}
