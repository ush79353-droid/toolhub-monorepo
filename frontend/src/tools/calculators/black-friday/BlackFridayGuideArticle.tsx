import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { getBlackFridayDate } from './calculation';
import { BLACK_FRIDAY_FAQS } from './content';

export function BlackFridayGuideArticle() {
  const year = new Date().getFullYear();
  const thisYear = getBlackFridayDate(year);
  const nextYear = getBlackFridayDate(year + 1);
  const bf2026 = getBlackFridayDate(2026);

  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Black Friday Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Use this Black Friday Calculator to turn an original price and a discount
        into a clear sale price, savings amount, and optional sales-tax total.
 Comparing final prices matters more than headline percentages; two
        stores can advertise the same “% off” with different list prices, shipping,
        and tax. Enter the original price, choose a percentage or fixed discount,
        optionally stack a second percentage discount, and toggle sales tax on
        the discounted price. Currency labels are denomination only.
      </p>

      <h2
        id="what-is"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is Black Friday?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Black Friday is a major retail shopping event traditionally held the day
        after Thanksgiving in the United States. Promotions now span physical
        stores and online marketplaces, often starting earlier in November and
        overlapping with Cyber Week.
      </p>

      <h2
        id="when"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        When Is Black Friday?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Black Friday is the Friday after U.S. Thanksgiving (the fourth Thursday
        of November). For 2026, Black Friday is{' '}
        <strong>{bf2026.isoDate}</strong> (November {bf2026.day}, 2026). This
        year ({year}): <strong>{thisYear.isoDate}</strong>. Next year:{' '}
        <strong>{nextYear.isoDate}</strong>. Dates are computed from the calendar
 rule; not hard-coded forever as 2026.
      </p>

      <h2
        id="deals"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Black Friday Deals and Shopping Discounts
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Common promotions include percentage discounts, fixed-amount coupons,
        limited-time offers, doorbusters, bundles, free shipping, loyalty
        rewards, cashback, and BOGO. Eligibility, stacking rules, and exclusions
 vary by retailer; always read the offer terms.
      </p>

      <h2
        id="how-discount"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate a Black Friday Discount
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>DiscountAmount = Original × DiscountRate / 100</p>
        <p>DiscountedPrice = Original × (1 − DiscountRate / 100)</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Example: $200 at 35% off → discount $70 → discounted price $130.
      </p>

      <h2
        id="final-price"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate the Final Sale Price
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
 Start with original price, subtract the discount, then (if tax applies) 
        add tax on the discounted price: Final = Discounted × (1 + TaxRate/100).
        Example: $130 after discount with 8% tax → tax $10.40 → final $140.40.
        Local exemptions and tax-inclusive pricing can differ.
      </p>

      <h2
        id="multiple"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Multiple Discounts
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Apply discounts sequentially. $500 with 30% then 20% → $350 then $280.
        Effective discount = 44%, not 50%. General form: Final = P × Π(1 − dᵢ).
      </p>

      <h2
        id="savings-pct"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Savings Percentage
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Savings% = (Original − Discounted) / Original × 100. Use the same
        currency amounts and compare pre-tax figures when isolating the discount.
      </p>

      <h2
        id="cyber-monday"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Black Friday vs. Cyber Monday
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Cyber Monday traditionally highlights online deals on the Monday after
 Thanksgiving. Today both events blur into multi-day online promotions; 
        use the same discount math for either.
      </p>

      <h2
        id="compare"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Compare Black Friday Deals
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Match identical products, then compare final price plus shipping, tax,
        warranty, and return policy. A smaller percentage off a lower list price
        can still win.
      </p>

      <h2
        id="cheapest"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Is Black Friday Always the Cheapest Time to Shop?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Not always. Some categories discount more deeply at other times of year.
        Treat Black Friday as one data point, not a guarantee of the lowest
        historical price.
      </p>

      <h2
        id="misleading"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Avoid Misleading Discounts
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Inflated “was” prices.</li>
        <li>Fake urgency timers and stock claims.</li>
        <li>Impulse buys outside your list.</li>
        <li>Ignoring shipping, fees, and return limits.</li>
        <li>Skipping price-history checks when available.</li>
      </ul>

      <h2
        id="budget"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Create a Black Friday Shopping Budget
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Set a hard spending limit, prioritize needs, estimate discounted totals
        with this tool, and reserve room for tax and shipping. Link items to a{' '}
        <Link
          href="/tools/budget-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Budget Calculator
        </Link>{' '}
        if you track monthly cash flow.
      </p>

      <h2
        id="overspend"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Avoid Overspending
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Stick to a list, compare final prices, track cart totals, skip “deal”
        items you would not buy at full price, and confirm return policies before
        checkout.
      </p>

      <h2
        id="related"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related Calculators
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Explore{' '}
        <Link href="/tools/discount-calculator" className="font-medium text-primary underline-offset-2 hover:underline">
          Discount
        </Link>
        ,{' '}
        <Link href="/tools/percentage-discount-calculator" className="font-medium text-primary underline-offset-2 hover:underline">
          Percentage Discount
        </Link>
        ,{' '}
        <Link href="/tools/double-discount-calculator" className="font-medium text-primary underline-offset-2 hover:underline">
          Double Discount
        </Link>
        ,{' '}
        <Link href="/tools/triple-discount-calculator" className="font-medium text-primary underline-offset-2 hover:underline">
          Triple Discount
        </Link>
        ,{' '}
        <Link href="/tools/vat-calculator" className="font-medium text-primary underline-offset-2 hover:underline">
          VAT
        </Link>
        ,{' '}
        <Link href="/tools/margin-and-markup-calculator" className="font-medium text-primary underline-offset-2 hover:underline">
          Margin &amp; Markup
        </Link>
        ,{' '}
        <Link href="/tools/profit-calculator" className="font-medium text-primary underline-offset-2 hover:underline">
          Profit
        </Link>
        ,{' '}
        <Link href="/tools/budget-calculator" className="font-medium text-primary underline-offset-2 hover:underline">
          Budget
        </Link>
        , and{' '}
        <Link href="/tools/savings-calculator" className="font-medium text-primary underline-offset-2 hover:underline">
          Savings
        </Link>
        .
      </p>

      <h2
        id="bf-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion items={[...BLACK_FRIDAY_FAQS]} />
      </div>
    </article>
  );
}
