import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { FUEL_COST_FAQS } from './content';

export function FuelCostGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Fuel Cost Calculator – Calculate Fuel Consumption and Trip Expenses
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Estimate fuel used and total trip cost from one-way or round-trip
        distance, fuel economy, and the price at your pump. Currency selection
        labels denomination only — enter prices in that currency (no live FX).
      </p>

      <h2
        id="what-is"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is a Fuel Cost Calculator?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        It converts distance and economy into liters (or gallons) of fuel, then
        multiplies by unit price to budget road trips and everyday driving.
      </p>

      <h2
        id="why-calculate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Why Calculate Fuel Costs Before Traveling?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Pre-trip estimates help compare routes, decide whether to carpool, and
        set a realistic cash or card budget for fuel stops.
      </p>

      <h2
        id="how-works"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Does the Fuel Cost Calculator Work?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Enter one-way distance, optionally enable two-way trip, set economy and
        pump price, then read fuel used, total cost, and cost per km or mile.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Fuel Cost Formula
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        FuelCost = FuelUsed × FuelPrice
      </p>

      <h2
        id="consumption"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Fuel Consumption
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        FuelUsed(L) = Distance(km) × (L/100 km) / 100
      </p>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Or FuelUsed = Distance / (km/L). For mpg, convert carefully between US
        and imperial gallons.
      </p>

      <h2
        id="efficiency"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Understanding Fuel Efficiency
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Lower L/100 km is better. Higher km/L or mpg is better. The calculator
        converts among these systems while keeping one internal L/100 km basis.
      </p>

      <h2
        id="per-km"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Fuel Cost Per Kilometer
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Example: PKR 6,300 ÷ 300 km = PKR 21 per kilometer.
      </p>

      <h2
        id="per-mile"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Fuel Cost Per Mile
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Divide total fuel cost by miles traveled (1 mi = 1.609344 km).
      </p>

      <h2
        id="round-trip"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        One-Way vs. Round-Trip Fuel Costs
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Round trip doubles total distance when outbound and return are the same.
        The one-way field stays unchanged when you toggle two-way trip.
      </p>

      <h2
        id="long-trips"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Fuel Cost for Long Trips
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Worked example: 150 km one-way, round trip on, 7.5 L/100 km, PKR 280/L →
        300 km, 22.5 L, PKR 6,300.
      </p>

      <h2
        id="unknown-mileage"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Estimate Fuel Consumption Without Knowing Your Mileage
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Category presets supply illustrative L/100 km values only. Replace them
        with your measured fill-up economy when you can.
      </p>

      <h2
        id="gas-diesel"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Gasoline vs. Diesel Fuel Costs
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Diesel vehicles often show different economy and different pump prices.
        Enter both explicitly — do not assume a fixed market spread.
      </p>

      <h2
        id="speed"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Does Driving Speed Affect Fuel Consumption?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Aerodynamic drag rises quickly with speed, so sustained high-speed
        cruising often uses more fuel per kilometer than moderate highway speeds.
      </p>

      <h2
        id="road"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Do Road Conditions Affect Fuel Economy?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Hills, rough surfaces, congestion, and frequent stops typically increase
        consumption versus smooth, level highway travel.
      </p>

      <h2
        id="ac"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Does Air Conditioning Affect Fuel Consumption?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        AC adds engine load. Impact is often larger in city traffic and hot
        weather than on long cool highway runs.
      </p>

      <h2
        id="reduce"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Reduce Fuel Costs
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Maintain tires and filters, avoid harsh acceleration, reduce unnecessary
        weight, and plan routes to cut idle and detours.
      </p>

      <h2
        id="per-passenger"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Fuel Cost Per Passenger
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Split total fuel cost equally by passenger count for shared trips. For
        more complex splits, see the Carpooling Calculator.
      </p>

      <h2
        id="road-trips"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Fuel Cost Calculator for Road Trips
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Budget fuel stops by totaling planned segments or using round-trip
        distance with a conservative economy assumption.
      </p>

      <h2
        id="commuting"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Fuel Cost Calculator for Daily Commuting
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Multiply a typical day&apos;s round-trip cost by workdays per month for a
        rough monthly fuel budget.
      </p>

      <h2
        id="why-differ"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Why Actual Fuel Consumption May Differ From Estimates
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Traffic, weather, driving habits, vehicle load, road conditions, tire
        pressure, maintenance, and air conditioning all move real results away
        from a constant average economy.
      </p>

      <h2
        id="related"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related Calculators
      </h2>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-foreground/90 sm:text-base">
        <li>
          <Link href="/tools/drive-time-calculator">Drive Time Calculator</Link>
        </li>
        <li>
          <Link href="/tools/carpooling-calculator">Carpooling Calculator</Link>
        </li>
        <li>
          <Link href="/tools/commute-calculator">Commute Calculator</Link>
        </li>
        <li>
          <Link href="/tools/engine-hours-to-miles-converter">
            Engine Hours to Miles Converter
          </Link>
        </li>
      </ul>

      <h2
        id="fc-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion faqs={[...FUEL_COST_FAQS]} />
      </div>
    </article>
  );
}
