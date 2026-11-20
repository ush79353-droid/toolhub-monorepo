import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { FREE_FLOAT_FAQS } from './content';

export function FreeFloatGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Free Float?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Free float is the number of a company&apos;s outstanding shares that are
        generally available for public trading. It usually excludes restricted
        shares and strategically held shares that are not treated as freely
        tradable. Definitions can vary across exchanges, index providers, and
        data vendors.
      </p>

      <h2
        id="definition"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Free Float Shares Definition
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Free float shares are the residual public float after subtracting shares
        that cannot, or typically do not, trade freely. This calculator uses a
        simple three-input model: outstanding, restricted, and closely held.
      </p>

      <h2
        id="outstanding-vs-float"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Outstanding Shares vs. Free Float Shares
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Outstanding shares cover all issued shares currently held by investors.
        Free float is a subset of those shares — the portion considered freely
        available to the public market after exclusions.
      </p>

      <h2
        id="restricted"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Restricted Shares Explained
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Restricted shares face legal, contractual, or lockup limitations that
        prevent free trading. Common examples include post-IPO lockups and
        certain employee equity awards before vesting or release.
      </p>

      <h2
        id="closely-held"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Closely Held Shares Explained
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Closely held shares are typically held by founders, executives,
        controlling shareholders, or strategic investors. Even when legally
        transferable, they are often excluded from public float estimates.
        Restricted and closely held categories must not overlap in this
        calculator — count each share only once.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Free Float Formula
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>FF = OS − RS − CHS</p>
        <p>FF = free float · OS = outstanding · RS = restricted · CHS = closely held</p>
      </div>

      <h2
        id="percentage-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Free Float Percentage Formula
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>FF% = (FF ÷ OS) × 100</p>
      </div>

      <h2
        id="how-to-calculate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Free Float Shares
      </h2>
      <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter outstanding shares.</li>
        <li>Enter restricted shares (use 0 if none).</li>
        <li>Enter closely held shares without double-counting restricted shares.</li>
        <li>Subtract both exclusions from outstanding shares.</li>
        <li>Divide free float by outstanding shares and multiply by 100.</li>
      </ol>

      <h2
        id="example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Free Float Calculation Example
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Company Alpha</p>
        <p>Outstanding = 10,000</p>
        <p>Restricted = 2,000</p>
        <p>Closely held = 1,000</p>
        <p>FF = 10,000 − 2,000 − 1,000 = 7,000</p>
        <p>FF% = 7,000 ÷ 10,000 × 100 = 70%</p>
      </div>

      <h2
        id="why-matters"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Why Free Float Matters
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Free float helps describe how many shares are available for public
        trading. Analysts use it when discussing liquidity, market
        participation, institutional ownership, index eligibility, and
        float-adjusted market capitalization. A high or low float alone does
        not determine whether a stock is a good investment.
      </p>

      <h2
        id="liquidity"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Free Float and Stock Liquidity
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        More freely tradable shares can support liquidity, but actual liquidity
        also depends on volume, investor demand, market makers, and market
        conditions. Low float can coincide with limited supply, wider spreads,
        or sharper moves around large orders — none of which are guaranteed.
      </p>

      <h2
        id="volatility"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Free Float and Stock Volatility
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Smaller free floats can leave prices more sensitive to shifts in demand,
        concentrated ownership, or thin trading. Free float is only one factor;
        sentiment, news, and overall market risk also matter.
      </p>

      <h2
        id="vs-market-cap"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Free Float vs. Market Capitalization
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>MarketCap = Price × OutstandingShares</p>
        <p>FloatAdjustedMarketCap = Price × FreeFloatShares</p>
        <p>Example: $50 × 10,000 = $500,000 total</p>
        <p>$50 × 7,000 = $350,000 float-adjusted</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Index providers often prefer float-adjusted market capitalization so
        index weights reflect shares that can actually trade.
      </p>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations of Free Float
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Definitions of restricted and strategic holdings differ</li>
        <li>Ownership disclosures can lag</li>
        <li>Issuance, buybacks, and lockup expirations change float</li>
        <li>Excluded categories can overlap if misclassified</li>
        <li>This tool estimates math only — it does not verify ownership data</li>
      </ul>

      <h2
        id="ff-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion items={[...FREE_FLOAT_FAQS]} />
      </div>
    </article>
  );
}
