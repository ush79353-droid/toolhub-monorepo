import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { GAS_FAQS } from './content';

export function GasGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Gas Calculator – Calculate Fuel Cost, Consumption, and Trip Expenses
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Estimate fuel required, total trip cost, cost per person, and cost per
        kilometer from distance, fuel economy, and pump price. Optional tools
        cover driving range, recurring commute costs, and vehicle comparison.
        Currency selection labels denomination only — enter prices in that
        currency (no live FX).
      </p>

      <h2
        id="what-is"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is a Gas Calculator?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        It converts travel distance and vehicle economy into liters or gallons
        of fuel, then multiplies by unit price so you can budget road trips,
        shared rides, and everyday driving.
      </p>

      <h2
        id="how-much-gas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Much Gas Do I Need?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Fuel volume rises with distance and with consumption rate. A 250 km trip
        at 7.5 L/100 km needs 18.75 L before you apply pump price.
      </p>

      <h2
        id="how-cost"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Gas Cost
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        FuelCost = FuelRequired × FuelPricePerLiter
      </p>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Example: 18.75 L × PKR 280/L = PKR 5,250 (illustrative price only).
      </p>

      <h2
        id="efficiency"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is Fuel Efficiency?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Efficiency describes how far you travel per unit of fuel (km/L, mpg) or
        how much fuel you use per distance (L/100 km). Lower L/100 km is better;
        higher km/L or mpg is better.
      </p>

      <h2
        id="consumption"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Fuel Consumption
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        FuelRequired(L) = Distance(km) × (L/100 km) / 100
      </p>

      <h2
        id="per-km"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Fuel Cost Per Kilometer
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Divide total fuel cost by total distance in kilometers. Zero distance
        leaves cost-per-km unavailable rather than dividing by zero.
      </p>

      <h2
        id="road-trip"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Much Gas Does a Road Trip Use?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Use the full planned distance (including side trips), a realistic
        economy for highway and city mix, and current pump prices along the
        route when they differ from home.
      </p>

      <h2
        id="round-trip"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Round-Trip Fuel Cost
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Total distance = one-way × 2 when return travel matches the outbound
        path. Fuel and cost then use that doubled distance.
      </p>

      <h2
        id="per-person"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Gas Cost Per Person
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Split total fuel cost equally by the number of passengers sharing the
        trip, including the driver unless you agree otherwise.
      </p>

      <h2
        id="mpg-convert"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Convert MPG to L/100 km
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        L/100 km ≈ 235.215 / US mpg · L/100 km ≈ 282.481 / UK mpg
      </p>

      <h2
        id="us-uk-mpg"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        US MPG vs. UK MPG
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        US and imperial gallons are different volumes. Never mix US mpg figures
        with UK mpg without converting.
      </p>

      <h2
        id="range"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Estimate Driving Range
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        Range(km) = AvailableFuel(L) × 100 / (L/100 km)
      </p>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Treat range as an engineering estimate — reserve margin for weather,
        traffic, and hills.
      </p>

      <h2
        id="prices"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Gas Prices and Fuel Expenses
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Trip cost scales linearly with pump price for a fixed fuel volume. This
        calculator does not fetch live station prices; enter the price you
        expect to pay.
      </p>

      <h2
        id="speed"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Driving Speed Affects Fuel Consumption
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Aerodynamic drag rises quickly with speed, so very fast highway driving
        often uses more fuel per kilometer than a moderate cruise.
      </p>

      <h2
        id="weight"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Vehicle Weight Affects Fuel Economy
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Extra passengers and cargo increase rolling resistance and the energy
        needed to accelerate, raising fuel use especially in city driving.
      </p>

      <h2
        id="city-highway"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        City vs. Highway Fuel Consumption
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Stop-start city cycles usually consume more fuel per distance than
        steady highway cruising. Use a blended economy when your trip mixes
        both.
      </p>

      <h2
        id="save"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Save Money on Gas
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Smooth acceleration, correct tire pressure, reduced idle, lighter
        loads, carpooling, and combining errands typically cut fuel spend more
        reliably than chasing tiny price differences alone.
      </p>

      <h2
        id="compare"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Compare Fuel Costs Between Vehicles
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Hold distance and fuel price fixed, enter each vehicle’s economy, and
        compare trip costs. Example: over 1,000 km at PKR 280/L, 8 vs 6 L/100 km
        differs by PKR 5,600.
      </p>

      <h2
        id="monthly"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Budget for Monthly Gas Expenses
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Estimate cost per commute trip, multiply by trips per week, then scale
        with weekly × 52 / 12 for an average month (and × 52 for a year).
      </p>

      <h2
        id="why-differ"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Why Actual Fuel Consumption May Differ
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Traffic, weather, speed, AC, tire pressure, maintenance, hills, and
        driving style all move real use away from a simple average. Treat
        results as planning estimates, not guaranteed tank readings.
      </p>

      <h2
        id="related"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related Calculators
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Explore{' '}
        <Link href="/tools/fuel-cost-calculator" className="text-primary underline-offset-2 hover:underline">
          Fuel Cost Calculator
        </Link>
        ,{' '}
        <Link href="/tools/drive-time-calculator" className="text-primary underline-offset-2 hover:underline">
          Drive Time Calculator
        </Link>
        ,{' '}
        <Link href="/tools/commute-calculator" className="text-primary underline-offset-2 hover:underline">
          Commute Calculator
        </Link>
        , and{' '}
        <Link href="/tools/carpooling-calculator" className="text-primary underline-offset-2 hover:underline">
          Carpooling Calculator
        </Link>{' '}
        when those tools are available in the catalog.
      </p>

      <h2
        id="gas-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion faqs={[...GAS_FAQS]} />
      </div>
    </article>
  );
}
