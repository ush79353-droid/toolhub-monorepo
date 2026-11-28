import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { COMMUTE_FAQS } from './content';

export function CommuteGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Commute Calculator – Calculate Driving Costs &amp; Compare Transport
        Expenses
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Estimate daily through yearly commuting expenses for car and public
        transport, split car costs among riders, and compare which option is
        cheaper under your inputs.
      </p>

      <h2
        id="what-is"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is a Commute Calculator?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        It turns distance, frequency, fuel, fees, and ticket prices into
        estimated commuting costs so you can plan budgets and mode choices.
      </p>

      <h2
        id="how-to"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Commuting Costs
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Combine distance-based fuel, optional parking/tolls and wear, or transit
        fares/passes, then annualize with a clear week/month convention.
      </p>

      <h2
        id="daily"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Daily Driving Costs
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Round-trip distance × fuel economy gives fuel used; multiply by fuel
        price and add day-based fees.
      </p>

      <h2
        id="monthly"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Monthly Commuting Costs
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Multiply round-trip costs by your commuting days per month, or enter
        monthly fees directly.
      </p>

      <h2
        id="annual"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Annual Commuting Costs
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This tool uses monthly × 12 and weekly × 52. Adjust frequency for unpaid
        leave or remote days.
      </p>

      <h2
        id="fuel"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Fuel Consumption for Commuting
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        FuelUsed(L) = Distance(km) × Economy(L/100 km) / 100
      </p>

      <h2
        id="driving-cost"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is the Cost of Driving to Work?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Direct costs include fuel and tolls; wear is an optional estimate. Full
        ownership costs (insurance, depreciation) need separate accounting.
      </p>

      <h2
        id="carpool-save"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Much Does Carpooling Save?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Cost per person = total car cost ÷ occupants (equal split). Charts show
        how occupancy changes your share.
      </p>

      <h2
        id="carpool-good"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Is Carpooling a Good Solution?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        It can cut personal cost and cars on the road when schedules align. Stay
        within legal seating capacity.
      </p>

      <h2
        id="transit"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Commute Cost When Using Public Transport
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Support per-ride, per-day, and time-based passes. Pass validity is
        calendar time — not automatically equal to commute days.
      </p>

      <h2
        id="compare"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Car vs. Public Transportation: Which Is Cheaper?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Compare your car cost share with transit. Positive savings means transit
        is cheaper under those inputs — never assumed by default.
      </p>

      <h2
        id="distance"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Does Commute Distance Affect Cost?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Longer round trips raise fuel and per-km wear. Tolls may also increase
        with distance or route.
      </p>

      <h2
        id="economy"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Does Fuel Economy Affect Commute Cost?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Better economy lowers liters (or gallons) for the same kilometers.
        Convert units carefully (L/100 km vs mpg).
      </p>

      <h2
        id="lower"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Lower Your Commuting Costs
      </h2>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm sm:text-base">
        <li>Carpooling</li>
        <li>Public transportation passes</li>
        <li>Remote or hybrid work</li>
        <li>Route optimization</li>
        <li>Fuel-efficient driving</li>
        <li>Fewer unnecessary trips</li>
        <li>Aligned commuting schedules</li>
      </ul>

      <h2
        id="environment"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Environmental Impact of Commuting
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Fewer solo car kilometers can reduce fuel use and emissions when trips
        are truly displaced — depends on occupancy and mode mix.
      </p>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations of a Commute Cost Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Results follow your inputs. Traffic, irregular schedules, transfers, and
        unmodeled ownership costs can differ from estimates.
      </p>

      <h2
        id="related"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related Calculators
      </h2>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm sm:text-base">
        <li>
          <Link
            href="/tools/carpooling-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Carpooling Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/bsfc-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            BSFC Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/boat-speed-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Boat Speed Calculator
          </Link>
        </li>
      </ul>

      <h2
        id="commute-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...COMMUTE_FAQS]} />
      </div>
    </article>
  );
}
