import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { PTB_FAQS } from './content';

export function PriceToBookGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-book"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Book Value of Equity?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Book value of equity is the accounting residual of assets over
 liabilities on the balance sheet; shareholders&apos; equity. Preferred
        equity may be deducted so remaining common book equity reflects claims
        of common shareholders.
      </p>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Equity ≈ Assets − Liabilities</p>
        <p>Common book equity = Total stockholder equity − Preferred equity</p>
      </div>

      <h2
        id="tangible"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is Tangible Book Value?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Tangible common equity starts from common book equity and subtracts
        goodwill and other intangible assets. Analysts use it when intangible
        carrying amounts are hard to verify or may not support liquidation
 value, with clear limitations of its own.
      </p>

      <h2
        id="bvps"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Book Value per Share and Tangible Book Value per Share
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>BVPS = Common book equity ÷ Common shares</p>
        <p>TBVPS = Tangible common equity ÷ Common shares</p>
      </div>

      <h2
        id="what-is-pb"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is the Price-to-Book Ratio?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The price-to-book ratio compares market price per share with accounting
        book value per common share. It is a simple equity valuation multiple
        used especially for asset-intensive businesses, with important industry
        and accounting caveats.
      </p>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>P/B = Market price per share ÷ Book value per share</p>
      </div>

      <h2
        id="how-to-calculate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Price-to-Book Ratio
      </h2>
      <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Take total stockholder equity and subtract preferred equity.</li>
        <li>Divide by common shares outstanding to get BVPS.</li>
        <li>Divide share price by BVPS (when BVPS is positive).</li>
        <li>Optionally subtract goodwill and other intangibles for tangible book.</li>
      </ol>

      <h2
        id="book-vs-market"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Book Value vs Market Value
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Book value follows historical accounting rules; market value reflects
        investor expectations about profitability, growth, intangibles, and
        risk. They often diverge, especially for asset-light businesses.
      </p>

      <h2
        id="interpret"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Interpret Price-to-Book Ratio
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>P/B &lt; 1; price below reported BVPS (discount, not automatic value).</li>
        <li>P/B ≈ 1; price near book.</li>
        <li>P/B &gt; 1; price above book (premium that may reflect ROE or growth).</li>
        <li>Negative book equity; conventional P/B is not meaningful.</li>
      </ul>

      <h2
        id="example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Worked Example
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Equity 500,000 − Preferred 50,000 = Common 450,000</p>
        <p>Shares 10,000 → BVPS 45 · Price 90 → P/B 2.00×</p>
        <p>Minus goodwill 60,000 and intangibles 40,000 → Tangible 350,000</p>
        <p>TBVPS 35 · P/TBV ≈ 2.57×</p>
      </div>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Advantages and Limitations
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        P/B is simple and uses widely reported equity figures. Limitations
        include accounting distortions, goodwill, intangibles, buybacks,
        negative equity, industry differences, and the fact that book value is
        not the same as economic value or liquidation proceeds.
      </p>

      <h2
        id="ptb-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion items={[...PTB_FAQS]} />
      </div>
    </article>
  );
}
