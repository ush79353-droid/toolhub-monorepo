import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { PAYPAL_FEE_FAQS } from './content';

export function PayPalFeeGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        PayPal Fee Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This PayPal Fee Calculator helps freelancers, online sellers, and small
        businesses estimate transaction processing fees, net amounts received,
        and the gross payment needed to keep a target amount after fees. Choose
        a verified United States or United Kingdom merchant schedule — or enter
        custom rates when your region is not listed. Currency labels are
        denomination only; currency conversion markups are excluded.
      </p>

      <h2
        id="what-are-fees"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Are PayPal Fees?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        PayPal fees are the costs of moving money through PayPal’s network.
        Commercial receiving fees usually combine a percentage of the payment
        with a fixed fee that depends on the currency received. Rates vary by
        country, product (Checkout, cards, QR, goods &amp; services), and
        whether the payment is domestic or international. Personal transfers,
        micropayments, and negotiated enterprise pricing can differ again.
      </p>

      <h2
        id="how-it-works"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Does the PayPal Fee Calculator Work?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Select region and transaction type, choose domestic or international,
        pick a currency, then either enter the amount sent (forward mode) or the
        amount you want to receive (reverse mode). The calculator shows fee
        breakdown, net received, effective fee rate, optional comparison rows,
        and step-by-step math. Verified presets include an effective date and a
        link to PayPal’s fee documentation.
      </p>

      <h2
        id="how-to-calculate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate PayPal Fees
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Identify the applicable percentage and fixed fee.</li>
        <li>Add any international percentage that applies.</li>
        <li>Compute Fee = Gross × (P + I) / 100 + F.</li>
        <li>Compute Net = Gross − Fee.</li>
        <li>Round using the currency’s minor units.</li>
      </ol>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        PayPal Fee Formula
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Fee = Gross × (P + I) / 100 + F</p>
        <p>Net = Gross − Fee</p>
        <p>Gross = (Net + F) / (1 − (P + I) / 100)</p>
        <p>EffectiveRate% = Fee / Gross × 100</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        P = base percentage, I = international add-on (0 when domestic), F =
        fixed fee. Reverse mode also adjusts for rounding so the net after fees
        still meets your target.
      </p>

      <h2
        id="how-much"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Much Does PayPal Charge Per Transaction?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        There is no universal answer. Fees change with country, currency,
        transaction type, payment method, domestic vs international status, and
        your merchant agreement. Example (illustrative US Checkout): 3.49% +
        $0.49 on a $100 payment → about $3.98 fee and $96.02 net. Confirm the
        live schedule for your account.
      </p>

      <h2
        id="goods-services"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate PayPal Fees for Goods and Services
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Commercial “goods and services” payments follow merchant commercial
        rates. In the US schedule, Send/Receive Money for Goods and Services is
        listed at 2.99% without a separate fixed fee in that row, while PayPal
        Checkout uses 3.49% + fixed. Pick the transaction type that matches how
        you actually get paid.
      </p>

      <h2
        id="international"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate PayPal Fees for International Payments
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        International commercial receiving often adds a percentage on top of the
        domestic rate. US schedules commonly add 1.50%. UK schedules distinguish
        EEA senders from other markets. Do not stack the same surcharge twice.
        Example: $200 with 3.49% + 1.50% + $0.49 → fee ≈ $10.47, net ≈ $189.53.
      </p>

      <h2
        id="amount-received"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate the Amount Received After PayPal Fees
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Start with the gross the buyer pays, subtract the total estimated fee,
        and you have unit net before other costs. Fixed fees weigh more heavily
        on small payments — compare effective fee % on $10 vs $1,000 using the
        comparison table in the results panel.
      </p>

      <h2
        id="reverse"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Reverse Calculate PayPal Fees
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        When you know the take-home amount you need, solve for gross with Gross
        = (Net + F) / (1 − total%). Percentage fees at or above 100% cannot be
        inverted. This tool then nudges the gross by currency minor units so
        rounded fees still leave at least your desired net.
      </p>

      <h2
        id="undercharging"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Avoid Undercharging Customers
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Build processing fees into product or service pricing, invoices, and
        contribution-margin targets so net revenue covers cost of goods and
        overhead. Passing fees through as a line-item surcharge may be
        restricted by card-scheme rules or local law — check what is allowed
        before adding a “PayPal fee” charge to customers.
      </p>

      <h2
        id="freelancers"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        PayPal Fees for Freelancers
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Freelancers can use reverse mode to set an invoice total that nets a
        desired take-home after fees, then track effective rates across clients
        and currencies. Keep tax withholding and platform fees outside PayPal
        separate from this estimate.
      </p>

      <h2
        id="sellers"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        PayPal Fees for Online Sellers
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Per-order fees reduce unit contribution. Pair this calculator with{' '}
        <Link
          href="/tools/markup-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Markup
        </Link>{' '}
        or margin tools to see how processing costs change list price and
        profit.
      </p>

      <h2
        id="small-business"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        PayPal Fees for Small Businesses
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Model typical ticket sizes, domestic vs cross-border mix, and currency
        mix when budgeting payment costs. Bookkeeping should record actual
        PayPal statements; this calculator is for planning and quotes.
      </p>

      <h2
        id="domestic-vs-intl"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Domestic vs. International PayPal Fees
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Domestic transactions generally involve the same PayPal market for
        sender and receiver. International transactions may add a percentage and
        can interact with currency conversion when funds settle in another
        currency. Market groupings are defined by PayPal, not by this tool.
      </p>

      <h2
        id="vs-fx"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        PayPal Fees vs. Currency Conversion Fees
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Processing fees and FX conversion markups are different costs. This
        calculator does not invent exchange rates or apply a global conversion
        fee. If your payout converts currencies, obtain the applicable rate or
        markup from PayPal and model it separately.
      </p>

      <h2
        id="estimate-accurately"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Estimate PayPal Fees Accurately
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Match region, currency, and transaction type to your account.</li>
        <li>Check the schedule’s effective date and official source link.</li>
        <li>Toggle domestic vs international correctly.</li>
        <li>Use Custom mode when presets do not cover your product.</li>
        <li>Reconcile estimates against a recent PayPal transaction.</li>
      </ul>

      <h2
        id="mistakes"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Common PayPal Fee Calculation Mistakes
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Using outdated or universal “one rate for everywhere.”</li>
        <li>Ignoring fixed fees on small tickets.</li>
        <li>Miscalculating reverse fees or dividing by zero at 100%.</li>
        <li>Mixing FX conversion into processing fee math.</li>
        <li>Applying international add-ons when the payment is domestic.</li>
        <li>Confusing gross charged with net deposited.</li>
        <li>Rounding inconsistently with currency minor units.</li>
      </ul>

      <h2
        id="related"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related Calculators
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <Link
          href="/tools/markup-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Markup
        </Link>
        {' · '}
        <Link
          href="/tools/margin-and-markup-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Margin &amp; Markup
        </Link>
        {' · '}
        <Link
          href="/tools/discount-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Discount
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
          href="/tools/vat-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          VAT
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
        id="pp-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion faqs={[...PAYPAL_FEE_FAQS]} />
      </div>
    </article>
  );
}
