import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { MCAP_FAQS } from './content';

export function MarketCapitalizationGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Market Capitalization – What Is It?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Market capitalization (market cap) is the equity market value of a
        publicly traded company: current share price times shares outstanding.
        Investors use it to describe company size and compare peers. It is not
        the same as revenue, book equity, or enterprise value.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Market Capitalization Formula
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Market Cap = Share Price × Outstanding Shares</p>
        <p>Example: $100 × 10,000,000 = $1,000,000,000 ($1B)</p>
        <p>Example: $25.50 × 50,000,000 = $1,275,000,000 ($1.275B)</p>
      </div>

      <h2
        id="how-to-calculate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Market Capitalization
      </h2>
      <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Find the current share price.</li>
        <li>Find total outstanding shares (exclude treasury shares).</li>
        <li>Multiply price by outstanding shares.</li>
        <li>Review the market capitalization.</li>
        <li>Compare with relevant companies if useful for your analysis.</li>
      </ol>

      <h2
        id="categories"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Market Capitalization Categories
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Size labels are conventions and can differ by market, index provider,
        and time period. Illustrative ranges often used in discussion:
      </p>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Micro-cap — below about $300 million</li>
        <li>Small-cap — about $300 million to $2 billion</li>
        <li>Mid-cap — about $2 billion to $10 billion</li>
        <li>Large-cap — about $10 billion to $200 billion</li>
        <li>Mega-cap — above about $200 billion</li>
      </ul>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Some systems also use nano-cap for particularly small companies. These
        bands are not universal official standards.
      </p>

      <h2
        id="vs-ev"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Market Capitalization vs Enterprise Value
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>EV ≈ Market Cap + Debt − Cash</p>
        <p>Additional adjustments may include preferred equity and minority interests.</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Market cap measures equity value. Enterprise value aims at the value of
        the operating business to all capital providers.
      </p>

      <h2
        id="why-matters"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Why Market Capitalization Matters
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Market cap helps describe company size, supports screening and index
        construction, and frames diversification discussions. It does not by
        itself measure investment quality, profitability, or risk.
      </p>

      <h2
        id="stock-splits"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Stock Splits Affect Market Capitalization
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Before 2-for-1: 100 shares × $100 = $10,000</p>
        <p>After 2-for-1: 200 shares × $50 = $10,000</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A conventional split changes share count and price proportionally, so
        market cap is unchanged at the split. Later trading can move market cap.
      </p>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations of Market Capitalization
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Share prices change continuously</li>
        <li>Issuance and buybacks change share counts</li>
        <li>Outstanding shares differ from public float</li>
        <li>Debt and cash are excluded</li>
        <li>Market cap is not operating performance</li>
        <li>Sentiment can dominate short-term prices</li>
        <li>Multiple share classes can complicate interpretation</li>
        <li>Dilution can change future share counts</li>
      </ul>

      <h2
        id="mcap-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion items={[...MCAP_FAQS]} />
      </div>
    </article>
  );
}
