import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { PERCENT_OFF_FAQS } from './content';

export function PercentOffGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Percent Off Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This Percent Off Calculator finds sale prices, savings, and effective
        discount percentages from an original price and one or more percentage
        discounts. Optional sales tax can be applied to the discounted price.
        Reverse modes recover the original price or the discount percentage.
        Currency labels are denomination only.
      </p>

      <h2
        id="what-is"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is Percent Off?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Percent off is a price reduction expressed as a share of the current
        price. A 25% discount on $200 removes $50, leaving $150. Retail tags,
        coupons, and promotions commonly use this form.
      </p>

      <h2
        id="how-it-works"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Does a Percent Off Calculator Work?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Enter original price and percent off to get savings and final price.
        Optionally stack a second sequential discount, open sales tax, or switch
        modes to solve for original price or discount percentage. Results update
        as you type.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Percent Off Formula
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Discount = Original × PercentOff / 100</p>
        <p>Final = Original × (1 − PercentOff / 100)</p>
        <p>Savings = Original − Final</p>
        <p>Final₂ = Original × (1 − D₁/100) × (1 − D₂/100)</p>
      </div>

      <h2
        id="how-to-calculate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Percent Off a Price
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Convert the percent to a decimal (25% → 0.25).</li>
        <li>Multiply original price by that decimal for savings.</li>
        <li>Subtract savings from the original price.</li>
      </ol>

      <h2
        id="final-price"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate the Final Price After a Discount
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Example: $200 with 25% off → discount $50 → final $150.
      </p>

      <h2
        id="savings"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate How Much Money You Save
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Savings equal original price minus final price (or original × discount
        rate for a single discount). With stacked discounts, sum the step
        amounts or use original − final.
      </p>

      <h2
        id="two-discounts"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Two Discounts
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Apply the second percent to what remains after the first. On $100: 20%
        off → $80; then 10% of $80 → $8; final $72; savings $28.
      </p>

      <h2
        id="not-additive"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Why Two Discounts Do Not Simply Add Together
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        20% then 10% yields an effective 28% off, not 30%. Adding percentages
        overstates the discount because the second cut applies to a smaller base.
      </p>

      <h2
        id="original-price"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Find the Original Price Before a Discount
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Original = Sale ÷ (1 − discount%/100). A 100% discount cannot uniquely
        recover the original from a $0 sale price.
      </p>

      <h2
        id="find-percent"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Find the Discount Percentage
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Percent off = (Original − Sale) ÷ Original × 100. Requires a positive
        original price.
      </p>

      <h2
        id="sales-tax"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Sales Tax After a Discount
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This calculator taxes the discounted price by default: Total =
        Discounted × (1 + tax%/100). Jurisdictions differ on taxability and
        rounding — this is arithmetic, not tax advice. Example: $150 after
        discount + 8% tax → $162.
      </p>

      <h2
        id="vs-points"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Percent Off vs. Percentage Points
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Percent off scales a money amount. Percentage points compare two rates
        arithmetically. Confusing them misstates rate changes and savings.
      </p>

      <h2
        id="retailers"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Retailers Use Percentage Discounts
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Stores use percent-off tags for promotions, clearance, and seasonal
        events. Stacked offers (sitewide + coupon) are often sequential —
        always check the order of application.
      </p>

      <h2
        id="black-friday"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Percent Off and Black Friday Discounts
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Holiday promotions frequently advertise large percent-off figures. Compare
        final prices across retailers — see also the{' '}
        <Link
          href="/tools/black-friday-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Black Friday Calculator
        </Link>
        .
      </p>

      <h2
        id="compare"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Compare Different Discount Offers
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Convert each offer to a final price on the same original amount. Effective
        discount % and total savings make stacked vs single discounts comparable.
      </p>

      <h2
        id="psychology"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Psychological and Strategic Aspects of Discounts
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Percentage framing can feel larger than an equivalent dollar cut on
        higher-priced items. Reference prices and “was/now” labels influence
        perceived value; verify the math before assuming a deal is best.
      </p>

      <h2
        id="mistakes"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Common Discount Calculation Mistakes
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Confusing discount amount with final price.</li>
        <li>Adding sequential discounts instead of compounding them.</li>
        <li>Taxing the original price when tax applies after discount.</li>
        <li>Ignoring fixed-dollar coupons alongside percent offs.</li>
        <li>Dividing by zero when reversing a 100% discount.</li>
        <li>Rounding intermediate steps too aggressively.</li>
      </ul>

      <h2
        id="related"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related Calculators
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <Link
          href="/tools/discount-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Discount
        </Link>
        {' · '}
        <Link
          href="/tools/percentage-discount-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Percentage Discount
        </Link>
        {' · '}
        <Link
          href="/tools/black-friday-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Black Friday
        </Link>
        {' · '}
        <Link
          href="/tools/cyber-monday-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Cyber Monday
        </Link>
        {' · '}
        <Link
          href="/tools/sales-tax-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Sales Tax
        </Link>
        {' · '}
        <Link
          href="/tools/markup-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Markup
        </Link>
        {' · '}
        <Link
          href="/tools/cash-back-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Cash Back
        </Link>
      </p>

      <h2
        id="po-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion faqs={[...PERCENT_OFF_FAQS]} />
      </div>
    </article>
  );
}
