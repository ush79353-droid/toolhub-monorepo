import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { CARPOOLING_FAQS } from './content';

export function CarpoolingGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Carpooling Calculator – Split Fuel Costs &amp; Calculate Ride Savings
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Estimate trip fuel use, total cost, and fair passenger contributions.
        Support round trips, optional tolls and parking, driver reimbursement
        modes, and a labeled comparison against separate vehicles.
      </p>

      <h2
        id="what-is"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is Carpooling?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Carpooling is when people traveling a similar route share one vehicle
        and typically share direct trip costs such as fuel and tolls.
      </p>

      <h2
        id="benefits"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Are the Benefits of Carpooling?
      </h2>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm sm:text-base">
        <li>Lower individual travel costs</li>
        <li>Fewer vehicles for the same trips</li>
        <li>Potential emissions reductions</li>
        <li>Less parking demand</li>
        <li>Shared commuting expenses</li>
      </ul>

      <h2
        id="how-to-calculate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Carpooling Costs
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Compute fuel used from distance and economy, multiply by fuel price, add
        optional expenses, then divide by the number of people (or apply another
        payment rule).
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Carpooling Cost Formula
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        CostPerPerson = (FuelCost + AdditionalExpenses) / NumberOfPeople
      </p>

      <h2
        id="fuel-consumption"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Fuel Consumption
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        FuelUsed(L) = Distance(km) × Economy(L/100 km) / 100
      </p>

      <h2
        id="split"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Split Fuel Costs Between Passengers
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Equal split includes the driver. Driver-free mode divides cost among
        passengers only. Custom mode lets the driver pay a fixed amount with the
        remainder split among passengers.
      </p>

      <h2
        id="savings"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Carpooling Savings
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Compare one shared trip cost with N separate trips under stated solo
        economy assumptions. Label results as a scenario — not everyone would
        otherwise drive alone.
      </p>

      <h2
        id="city-highway"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        City vs. Highway Fuel Consumption
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Stop-and-go city driving often uses more fuel per kilometer than steady
        highway cruising. Trip type presets update sample economies accordingly.
      </p>

      <h2
        id="lower-costs"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Lower Your Driving Costs
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Plan efficient routes, maintain tire pressure, avoid unnecessary idling,
        choose efficient vehicles when possible, and share eligible trip costs.
      </p>

      <h2
        id="how-many"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Many People Should Share a Car?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Stay within legal seating capacity and seat belts. More riders generally
        lower cost per person for the same trip cost — never exceed safe
        occupancy.
      </p>

      <h2
        id="ridesharing"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Carpooling vs. Ridesharing
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Carpooling is peer cost sharing. Ridesharing apps typically set fares and
        compensate drivers under platform rules.
      </p>

      <h2
        id="car-sharing"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Carpooling vs. Car Sharing
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Carpooling shares a trip; car sharing shares vehicle access over time
        without necessarily traveling together.
      </p>

      <h2
        id="environment"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Environmental Benefits of Carpooling
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Potential fuel and emission savings depend on whether shared trips
        displace solo driving and on actual vehicle efficiency.
      </p>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations of a Carpooling Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Estimates omit depreciation, insurance, and maintenance. Fuel economy
        varies with conditions; prices change; and not every passenger would
        otherwise drive alone.
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
            href="/tools/boat-speed-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Boat Speed Calculator
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
            href="/tools/boost-horsepower-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Boost Horsepower Calculator
          </Link>
        </li>
      </ul>

      <h2
        id="carpooling-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...CARPOOLING_FAQS]} />
      </div>
    </article>
  );
}
