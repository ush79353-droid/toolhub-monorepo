import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { MTD_FAQS } from './content';

export function MilesToDollarsGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Miles to Dollars Calculator – Find the Value of Your Airline Miles
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Estimate the dollar value of airline loyalty miles, compare an award
        booking with a cash fare, and compute actual cents-per-mile redemption
        value. This tool values loyalty currency — not geographic driving
        miles.
      </p>

      <h2
        id="what-is"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is a Miles to Dollars Calculator?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        It turns an assumed value per mile into a dollar estimate for a mile
        balance or award, then compares that estimate with paying cash for the
        same trip (including taxes and fees).
      </p>

      <h2
        id="airline-miles"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Airline Miles and Their Value
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Airline miles (or points) are loyalty units. They are not the same as
        statute miles flown, and they usually cannot be exchanged for a fixed
        cash rate. Value appears when you redeem — typically for award flights.
      </p>

      <h2
        id="how-get"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Get Airline Miles
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Common ways include flying eligible flights, co-branded or transferable
        credit cards, shopping portals, hotel and car partners, and temporary
        promotions. Earnings rates change; check your program for current
        offers rather than relying on a fixed published rate here.
      </p>

      <h2
        id="how-much"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Much Is an Airline Mile Worth?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Worth varies by cabin, route, award type, taxes, and availability. A
        planning assumption (for example 1.5¢/mi) helps compare options but is
        not a market quote.
      </p>

      <h2
        id="why-change"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Why Do Airline Mile Values Change?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Dynamic award pricing, chart changes, fuel surcharges, partner awards,
        and program devaluations all shift effective cents per mile over time.
      </p>

      <h2
        id="fees"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Fees When Redeeming Award Flights
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Award tickets usually still require cash for government taxes and
        sometimes carrier surcharges or booking fees. Those fees reduce
        effective redemption value and are entered separately in this
        calculator.
      </p>

      <h2
        id="avg-price"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Where to Find the Average Price per Mile
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Third-party blogs sometimes publish average valuations. Methodologies
        differ and go stale quickly. Prefer calculating your own redemption
        value for a specific itinerary over relying on an undated average.
      </p>

      <h2
        id="estimated"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Estimated Value of a Mile
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This calculator uses a user-editable illustrative cents- or
        dollars-per-mile figure for every program. We do not invent current
        airline-by-airline market rates. Edit the field to match your own
        planning assumption.
      </p>

      <h2
        id="book"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Do You Book a Flight With Miles?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Typical steps: search award inventory in the loyalty portal (or a
        partner), select the award, pay taxes/fees, and confirm traveler
        details. Availability and prices are controlled by the airline — not by
        this calculator.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use the Miles to Dollars Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Select a loyalty program for context.</li>
        <li>Enter or adjust the assumed miles value (¢ or $ per mile).</li>
        <li>Enter miles required and award taxes/fees.</li>
        <li>Enter the comparable cash ticket price.</li>
        <li>
          Review award-equivalent cost, savings, and actual cents per mile.
        </li>
      </ol>

      <h2
        id="40k"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Much Is 40,000 Airline Miles Worth?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        At 1¢/mi → $400; at 1.5¢/mi → $600; at 2¢/mi → $800. These are
        illustrative math results, not cash you can withdraw.
      </p>

      <h2
        id="choose"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Choosing the Right Redemption Option
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Compare cash fare, award miles, and fees. Higher ¢/mi is not always the
        same as lower cash outlay or lower total economic cost — check all
        three.
      </p>

      <h2
        id="cpm"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Cents per Mile
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        ¢/mi = ((Cash price − Fees) ÷ Miles) × 100
      </p>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Example: ($600 − $50) ÷ 25,000 × 100 = 2.20¢/mi.
      </p>

      <h2
        id="good-value"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is a Good Redemption Value?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A “good” redemption beats the cash alternative you would actually buy
        and your personal opportunity cost for those miles. No universal
        cutoff applies to every airline.
      </p>

      <h2
        id="cash-or-miles"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Is It Better to Pay Cash or Use Miles?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Prefer miles when estimated economic cost and ¢/mi look strong versus
        cash, and when you do not need the miles for a higher-value trip soon.
        Prefer cash when fees are high, ¢/mi is weak, or you value liquidity.
      </p>

      <h2
        id="save"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        When Should You Save Airline Miles?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Saving can make sense for a known future award, but balances face
        devaluation and expiration risk. Balance patience against program
        change risk.
      </p>

      <h2
        id="expire"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Airline Miles Expiration
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Expiration and activity rules are program-specific and may change.
        Always verify current terms in your loyalty account.
      </p>

      <h2
        id="limits"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Important Calculator Assumptions
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Assumed ¢/mi is illustrative and user-editable.</li>
        <li>Award inventory and dynamic prices are not simulated.</li>
        <li>Miles earned on cash bookings are not modeled.</li>
        <li>Amounts display in USD; no live currency conversion.</li>
        <li>Results are estimates for education — not financial advice.</li>
      </ul>

      <h2
        id="related"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related Calculators
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <Link href="/tools/miles-per-year-calculator">
            Miles per Year Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/fuel-cost-calculator">Fuel Cost Calculator</Link>
        </li>
        <li>
          <Link href="/tools/drive-time-calculator">Drive Time Calculator</Link>
        </li>
        <li>
          <Link href="/tools/flight-radiation-calculator">
            Flight Radiation Calculator
          </Link>
        </li>
      </ul>

      <h2
        id="mtd-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion faqs={[...MTD_FAQS]} />
      </div>
    </article>
  );
}
