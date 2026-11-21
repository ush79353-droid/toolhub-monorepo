import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { GIFT_OF_EQUITY_FAQS } from './content';

export function GiftOfEquityGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-gift-of-equity"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Gift of Equity? Gift of Equity Definition
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A gift of equity is the difference between a property&apos;s market value
 and a lower agreed sales price. Sellers; often in qualifying family
 transactions; may intentionally sell below market value so the buyer
        receives that equity gap as part of the deal. Accurate valuation matters
        because the mathematical discount is only as reliable as the market value
        figure behind it. A calculated difference is not automatically an eligible
        gift under every lender, tax, or legal framework.
      </p>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Gift of Equity = Market Value − Sales Price</p>
      </div>

      <h2
        id="how-to-calculate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Gift of Equity
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Determine the property&apos;s market value.</li>
        <li>Determine the agreed sales price.</li>
        <li>Subtract sales price from market value.</li>
        <li>Review the calculated equity difference.</li>
      </ol>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Property market value = $600,000</p>
        <p>Property sales price = $550,000</p>
        <p>Gift of equity = 600,000 − 550,000 = $50,000</p>
      </div>

      <h2
        id="gift-of-equity-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Gift of Equity Formula
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>GOE = MV − SP</p>
        <p>MV = property market value</p>
        <p>SP = property sales price</p>
        <p>GOE = gift of equity (signed mathematical difference)</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Keep both amounts in the same currency. Example: market value $800,000 and
        sales price $600,000 → gift of equity $200,000. Equal values produce $0.
        When sales price is higher, the signed result is negative and should not be
        described as a positive gift.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use the Gift of Equity Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter the property market value.</li>
        <li>Select the display currency (denomination only).</li>
        <li>Enter the agreed sales price.</li>
        <li>Review the calculated gift of equity.</li>
        <li>Adjust inputs to compare transaction scenarios.</li>
        <li>
          Optionally switch modes to solve for sales price or market value.
        </li>
        <li>Clear the calculator to start a new estimate.</li>
      </ol>

      <h2
        id="vs-down-payment"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Gift of Equity vs. Down Payment
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
 <strong>Down payment</strong>: buyer cash (or other qualifying funds)
          contributed toward the purchase price, usually settled at closing
        </li>
        <li>
 <strong>Gift of equity</strong>: below-market discount measured as
          market value minus sales price in a qualifying sale
        </li>
      </ul>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Some lenders may treat a qualifying gift of equity toward purchase funding
        requirements, but mortgage program rules differ. A gift of equity does not
        automatically eliminate every cash requirement at closing.
      </p>

      <h2
        id="as-down-payment"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Can a Gift of Equity Be Used as a Down Payment?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Qualifying gift-of-equity amounts may be accepted toward certain
        home-purchase funding requirements depending on the mortgage program,
        lender policies, property valuation, seller–buyer relationship, required
        documentation, and applicable jurisdiction. Do not assume every lender
        accepts gifts of equity as down-payment substitutes.
      </p>

      <h2
        id="vs-home-equity"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Gift of Equity vs. Home Equity
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
 <strong>Home equity</strong>: difference between property value and
          outstanding debt secured against it (for example, $600,000 value with a
          $400,000 mortgage → about $200,000 home equity)
        </li>
        <li>
 <strong>Gift of equity</strong>: difference between market value and an
          agreed below-market sales price in a qualifying transaction (for
          example, $600,000 market value sold for $500,000 → $100,000 gift of
          equity)
        </li>
      </ul>

      <h2
        id="negative-gift"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Can a Gift of Equity Be Negative?
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Market value = $500,000</p>
        <p>Sales price = $550,000</p>
        <p>Difference = 500,000 − 550,000 = −$50,000</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A negative difference means sales price exceeds market value. It does not
        represent a positive gift of equity, and it does not mean the buyer
        received “negative equity” as a gift. This calculator preserves the signed
        result and shows a warning so the math stays clear.
      </p>

      <h2
        id="appraisals"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Gift of Equity and Property Appraisals
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Reliable valuation supports gift-of-equity estimates. Appraisals may be
        required by lenders or transaction rules. Estimated market value can differ
        from appraised value, and that gap can affect whether a lender accepts the
        stated gift amount. Avoid relying solely on an informal estimate for
        financing or documentation decisions.
      </p>

      <h2
        id="tax-legal"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Tax and Legal Considerations
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Gifts of equity can raise tax and legal issues depending on jurisdiction.
        Parties may need gift documentation, gift-tax reporting where applicable,
        proper property transfer paperwork, and lender-required disclosures. This
        guide does not provide universal tax thresholds or claim a transaction is
        tax-free. For significant transfers, obtain advice from qualified tax,
        legal, and mortgage professionals.
      </p>

      <h2
        id="gift-of-equity-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...GIFT_OF_EQUITY_FAQS]} />
      </div>
    </article>
  );
}
