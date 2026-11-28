import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { TO_FAQS } from './content';

export function TicketOptimizerGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Ticket Optimizer – Find the Cheapest Public Transport Tickets
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Compare single fares with short- and long-term travel passes for your
        trip frequency and travel window. The optimizer searches valid ticket
        combinations and reports the lowest estimated cost. Currency selection
        changes denomination only — enter prices already in that currency.
      </p>

      <h2
        id="how-works"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Does the Ticket Optimizer Work?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Your inputs define an assumed trip timeline. At each uncovered trip the
        algorithm may buy a single ticket or an enabled pass, then continues
        until every journey is covered. Dynamic programming keeps the search
        exact for realistic schedule sizes.
      </p>

      <h2
        id="step-travel"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step 1: Analyze Your Traveling Style
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Set trips per day or per week and how many days or weeks you need
        tickets. Daily mode multiplies trips by days. Weekly mode distributes
        trips inside each week of the travel window and labels the result as an
        estimate.
      </p>

      <h2
        id="step-prices"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step 2: Input the Ticket Prices
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Enter the single-fare price always. Optionally enable short-term and
        long-term passes with their prices and validity. Months use a fixed
        30-day period, not calendar months.
      </p>

      <h2
        id="step-cheapest"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step 3: Find the Cheapest Option
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Review the recommended quantities, total cost, savings versus all
        singles, and the strategy comparison table when multiple options are
        enabled.
      </p>

      <h2
        id="step-enjoy"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step 4: Enjoy Your Travel
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Use the plan as a budget estimate. Confirm local activation rules,
        zones, and eligibility before you buy.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Ticket Optimizer Formula
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        Cmin = min over valid plans of (ns·Ps + nt·Pt + nl·Pl)
      </p>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Savings S = Cs − Cmin where Cs is the all-singles baseline.
      </p>

      <h2
        id="how-calc"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Public Transportation Ticket Costs
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Example: 2 trips/day for 10 days → 20 trips. Singles at 2.80 cost 56.00.
        Two 5-day passes at 7.00 cost 14.00 — saving 42.00 (75%).
      </p>

      <h2
        id="single-vs-pass"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Single Tickets vs. Travel Passes
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Singles scale linearly with trips. Passes can be cheaper when many trips
        fall inside one validity window — but a pass bought for sparse travel
        can waste money.
      </p>

      <h2
        id="short-vs-long"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Short-Term vs. Long-Term Transport Passes
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Short passes fit tourist clusters and short stays. Long passes suit dense
        commuting over weeks. Mixing both with singles is allowed when enabled.
      </p>

      <h2
        id="savings"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Transportation Savings
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Subtract the optimized total from the singles baseline. Percentage
        savings divide by the baseline when it is positive.
      </p>

      <h2
        id="validity"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Why Ticket Validity Matters
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Coverage starts when a pass is purchased for an uncovered trip and ends
        after its duration (exclusive end). Trips outside that window need
        another ticket.
      </p>

      <h2
        id="tips"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Save Money on Public Transportation
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Cluster trips so pass windows stay full.</li>
        <li>Compare official pass prices against your real trip count.</li>
        <li>Avoid long passes you will not fully use.</li>
        <li>Check time-of-day and zone rules before buying.</li>
      </ul>

      <h2
        id="weekly"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        When Are Weekly Passes Worth It?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Rough break-even: weekly pass price ÷ single fare ≈ trips needed that
        week. Ride more than that and the pass usually wins.
      </p>

      <h2
        id="monthly"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        When Are Monthly Passes Worth It?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Frequent weekday commuting often favors a long pass. Enter your monthly
        (or 30-day) price and trip pattern to verify.
      </p>

      <h2
        id="tourists"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Ticket Optimization for Tourists
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Multi-day city cards can beat stacks of singles on sightseeing days.
        Leave quiet days on singles if a pass would sit idle.
      </p>

      <h2
        id="commuters"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Ticket Optimization for Daily Commuters
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Stable two-trips-per-workday patterns are ideal for long passes. Adjust
        duration for vacation weeks so you do not over-buy.
      </p>

      <h2
        id="limits"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations of Ticket Optimization
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Results assume unlimited travel during each pass window on a transparent
        estimated schedule. Real networks may add peak rules, zones, age
        discounts, transfers, route restrictions, or calendar-month passes that
        this model does not encode. Not every system offers interchangeable
        unlimited passes.
      </p>

      <h2
        id="related"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related Calculators
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <Link href="/tools/commute-calculator">Commute Calculator</Link>
        </li>
        <li>
          <Link href="/tools/carpooling-calculator">Carpooling Calculator</Link>
        </li>
        <li>
          <Link href="/tools/drive-time-calculator">Drive Time Calculator</Link>
        </li>
        <li>
          <Link href="/tools/fuel-cost-calculator">Fuel Cost Calculator</Link>
        </li>
        <li>
          <Link href="/tools/mpg-calculator">MPG Calculator</Link>
        </li>
      </ul>

      <h2
        id="to-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion faqs={[...TO_FAQS]} />
      </div>
    </article>
  );
}
