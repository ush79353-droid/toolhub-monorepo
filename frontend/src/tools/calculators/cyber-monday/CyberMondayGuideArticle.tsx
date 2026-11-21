import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { getCyberMondayDate } from './calculation';
import { CYBER_MONDAY_FAQS } from './content';

export function CyberMondayGuideArticle() {
  const year = new Date().getFullYear();
  const thisYear = getCyberMondayDate(year);
  const nextYear = getCyberMondayDate(year + 1);
  const cm2026 = getCyberMondayDate(2026);

  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Cyber Monday Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Use this Cyber Monday Calculator to turn an advertised deal into a clear
        merchandise price, tax estimate, shipping cost, and final checkout total.
        Choose percentage, fixed, stacked, BOGO, Buy X Get Y, or percent-plus-coupon
 promotions, then compare what you actually pay, not just the headline
        percentage. Currency labels are denomination only.
      </p>

      <h2
        id="what-is"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is Cyber Monday?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Cyber Monday is an online-focused shopping event traditionally held the
        Monday after Thanksgiving in the United States. Retailers promote
        ecommerce discounts, coupons, and limited-time offers, often overlapping
        with Black Friday and Cyber Week.
      </p>

      <h2
        id="when"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        When Is Cyber Monday?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Cyber Monday is the Monday following U.S. Thanksgiving. For 2026 it is{' '}
        <strong>{cm2026.isoDate}</strong> (November {cm2026.day}, 2026). This
        year ({year}): <strong>{thisYear.isoDate}</strong>. Next year:{' '}
        <strong>{nextYear.isoDate}</strong>. Dates are computed from the calendar
        rule (Black Friday + 3 days).
      </p>

      <h2
        id="how-works"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Does the Cyber Monday Calculator Work?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Enter unit price and quantity, pick a deal type, then optionally enable
        sales tax (exclusive or tax-included), shipping, and a free-shipping
        threshold based on after-discount merchandise. Results show merchandise
        savings, effective discount %, tax, shipping, and final checkout.
      </p>

      <h2
        id="how-discount"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Cyber Monday Discounts
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>DiscountAmount = P × D / 100</p>
        <p>DiscountedPrice = P − DiscountAmount</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Example: $200 at 25% off → save $50 → $150 merchandise.
      </p>

      <h2
        id="multiple"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Multiple Discounts
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Stacked percentages multiply residual factors. Adding the percentages
        overstates savings. Always apply discounts in the order your retailer
        allows.
      </p>

      <h2
        id="double"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate a Double Discount
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Final = P × (1 − d₁) × (1 − d₂). Example: $200 with 20% then 10% → $144
        (28% effective, not 30%).
      </p>

      <h2
        id="triple"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate a Triple Discount
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Final = P × (1 − d₁) × (1 − d₂) × (1 − d₃). Example: $300 with 20%, 10%,
        5% → $205.20.
      </p>

      <h2
        id="bogo"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
 Buy One Get One Free; BOGO Deals
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        For identical free BOGO items, paid quantity ≈ ceil(Q / 2). Three items
        at $40 → pay for 2 → $80. Second-item-discount BOGO charges the second
        of each pair at a reduced rate; leftovers stay full price.
      </p>

      <h2
        id="buy-x-get-y"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Buy X Get Y Free Promotions
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Complete groups of size X+Y grant Y free items each. Unmatched items are
        paid. Buy 2 Get 1 Free on 6 units → 2 free → pay for 4.
      </p>

      <h2
        id="coupons"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Coupons Affect Cyber Monday Prices
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Percentage and fixed coupons may require minimum spend, exclude brands,
        or cap savings. Default stacking order here is percentage then fixed
        coupon; switch order only when your offer allows it. Coupons cannot drive
        merchandise below zero in this model.
      </p>

      <h2
        id="tax"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Sales Tax on Discounted Products
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Tax-exclusive default: Tax = Discounted × rate/100. Tax-inclusive:
        PreTax = Inclusive ÷ (1 + t). Shipping taxability and coupon tax bases
 vary by jurisdiction, treat results as estimates.
      </p>

      <h2
        id="shipping"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Does Shipping Affect Your Savings?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Yes. Free-shipping thresholds (default: after-discount merchandise) can
        change which store wins. Always compare final checkout amounts.
      </p>

      <h2
        id="vs-bf"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Cyber Monday vs. Black Friday
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
 Compare entered checkout totals for the same item, neither event is
        universally cheaper. Use the optional Black Friday comparison field or
        the{' '}
        <Link
          href="/tools/black-friday-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Black Friday Calculator
        </Link>
        .
      </p>

      <h2
        id="genuine"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Find Genuine Cyber Monday Deals
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Check recent price history when available.</li>
        <li>Read exclusions and max discount caps.</li>
        <li>Verify shipping, tax, and return terms.</li>
        <li>Confirm product specs match what you want.</li>
      </ul>

      <h2
        id="mistakes"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Common Cyber Monday Shopping Mistakes
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Judging deals by % off alone.</li>
        <li>Ignoring shipping and tax.</li>
        <li>Assuming every coupon stacks.</li>
        <li>Buying unneeded “deals.”</li>
        <li>Trusting inflated “was” prices.</li>
      </ul>

      <h2
        id="save-more"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Save More Money on Cyber Monday
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Set a budget, compare retailers on final checkout, use legitimate
        coupons, hit free-shipping thresholds intentionally, and confirm warranty
        or return policies before you buy.
      </p>

      <h2
        id="examples"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Cyber Monday Calculator Examples
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>$200 · 25% · 8% tax · $10 ship → merchandise $150 · tax $12 · final $172.</li>
        <li>$200 · 20% then 10% → $144 merchandise (28% effective).</li>
        <li>BOGO $40 × 4 → pay $80.</li>
      </ul>

      <h2
        id="related"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related Calculators
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Explore{' '}
        <Link href="/tools/black-friday-calculator" className="font-medium text-primary underline-offset-2 hover:underline">
          Black Friday
        </Link>
        ,{' '}
        <Link href="/tools/discount-calculator" className="font-medium text-primary underline-offset-2 hover:underline">
          Discount
        </Link>
        ,{' '}
        <Link href="/tools/percentage-discount-calculator" className="font-medium text-primary underline-offset-2 hover:underline">
          Percentage Discount
        </Link>
        ,{' '}
        <Link href="/tools/cash-back-calculator" className="font-medium text-primary underline-offset-2 hover:underline">
          Cash Back
        </Link>
        ,{' '}
        <Link href="/tools/vat-calculator" className="font-medium text-primary underline-offset-2 hover:underline">
          VAT
        </Link>
        , and{' '}
        <Link href="/tools/savings-calculator" className="font-medium text-primary underline-offset-2 hover:underline">
          Savings
        </Link>
        .
      </p>

      <h2
        id="cm-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion items={[...CYBER_MONDAY_FAQS]} />
      </div>
    </article>
  );
}
