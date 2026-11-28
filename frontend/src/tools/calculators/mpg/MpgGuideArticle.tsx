import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { MPG_FAQS } from './content';

export function MpgGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        MPG Calculator – Miles Per Gallon and Fuel Economy Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Calculate vehicle fuel economy from distance and fuel used, convert
        between US mpg, Imperial mpg, km/L, and L/100 km, and estimate trip fuel
        cost. Currency labels denomination only — no live FX.
      </p>

      <h2
        id="gas-mileage"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is Gas Mileage?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Gas mileage describes how far a vehicle travels per unit of fuel — a
        measure of fuel economy used for budgeting, comparing vehicles, and
        tracking driving habits.
      </p>

      <h2
        id="what-mpg"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Does MPG Mean?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Miles per gallon. Higher MPG means more distance per gallon. Always note
        whether the gallon is US or Imperial.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        MPG Formula
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        MPG = Miles driven ÷ Gallons used
      </p>

      <h2
        id="how-calc"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate MPG
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Example: fill the tank, reset the trip meter, drive, refill, and record
        gallons added and miles traveled. 300 mi ÷ 10 US gal = 30 US MPG.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use the MPG Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Choose Calculate → Fuel economy (default), Fuel used, or Distance.</li>
        <li>Enter the two known values and units.</li>
        <li>Optionally open Fuel price and trip cost for cost estimates.</li>
        <li>Review US mpg plus L/100 km and km/L conversions.</li>
      </ol>

      <h2
        id="average"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Average MPG
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Average MPG = total miles ÷ total gallons across the period — not the
        mean of several trip MPG readings.
      </p>

      <h2
        id="consumption"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Fuel Consumption
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Fuel consumption is often expressed as L/100 km (lower is better). MPG
        is economy (higher is better). They describe the same efficiency from
        opposite directions.
      </p>

      <h2
        id="mpg-l100"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        MPG vs. L/100 km
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        L/100 km ≈ 235.214583 ÷ US MPG
      </p>

      <h2
        id="us-imp"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        US MPG vs. Imperial MPG
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        1 US gal ≈ 3.785 L; 1 Imperial gal ≈ 4.546 L. Imperial MPG figures are
        larger for the same trip because each gallon contains more fuel.
      </p>

      <h2
        id="convert-l100"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Convert MPG to L/100 km
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        30 US MPG → 235.214583 ÷ 30 ≈ 7.84 L/100 km.
      </p>

      <h2
        id="convert-kml"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Convert MPG to km/L
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        km/L ≈ US MPG × 0.425143707 → 30 US MPG ≈ 12.75 km/L.
      </p>

      <h2
        id="fuel-needed"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Fuel Needed for a Trip
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        Fuel needed = Trip distance ÷ Fuel economy
      </p>

      <h2
        id="fuel-cost"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Fuel Cost
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Trip cost = fuel needed × price per matching volume unit. Example: 10 US
        gal × $3.50 = $35.
      </p>

      <h2
        id="cost-mile"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Fuel Cost per Mile
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Cost per mile = trip fuel cost ÷ trip miles (or price ÷ MPG).
      </p>

      <h2
        id="improve"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Improve Your Vehicle&apos;s MPG
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Keep tires properly inflated.</li>
        <li>Accelerate and brake smoothly.</li>
        <li>Avoid excessive speed and long idling.</li>
        <li>Reduce unnecessary cargo and roof drag.</li>
        <li>Follow maintenance schedules.</li>
      </ul>

      <h2
        id="city-hwy"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        City MPG vs. Highway MPG
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        City driving usually yields lower MPG due to stops and idling; highway
        cruising is often more efficient.
      </p>

      <h2
        id="combined"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Combined MPG
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Combined MPG should use total distance ÷ total fuel — not a simple
        average of city and highway sticker numbers unless those stickers
        already apply a defined weighting.
      </p>

      <h2
        id="real-world"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Why Real-World MPG Differs From Advertised MPG
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Traffic, weather, hills, load, fuel blend, tire condition, and driving
        style all shift results from laboratory cycles.
      </p>

      <h2
        id="examples"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        MPG Calculator Examples
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>300 mi / 10 US gal → 30 US MPG</li>
        <li>450 mi / 15 US gal → 30 US MPG</li>
        <li>300 mi @ 30 MPG · $3.50/gal → $35 trip cost</li>
      </ul>

      <h2
        id="table"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Fuel Economy Conversion Table
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Approximate values (rounded for readability):
      </p>
      <div className="mt-3 overflow-x-auto not-prose">
        <table className="w-full min-w-[20rem] border-collapse text-left text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="px-2 py-2 font-semibold text-accent">US MPG</th>
              <th className="px-2 py-2 font-semibold text-accent">L/100 km</th>
              <th className="px-2 py-2 font-semibold text-accent">km/L</th>
            </tr>
          </thead>
          <tbody className="text-foreground/90">
            {[
              ['10', '23.52', '4.25'],
              ['15', '15.68', '6.38'],
              ['20', '11.76', '8.50'],
              ['25', '9.41', '10.63'],
              ['30', '7.84', '12.75'],
              ['35', '6.72', '14.88'],
              ['40', '5.88', '17.01'],
              ['45', '5.23', '19.13'],
              ['50', '4.70', '21.26'],
              ['60', '3.92', '25.51'],
            ].map((row) => (
              <tr key={row[0]} className="border-b border-border">
                {row.map((cell) => (
                  <td key={cell} className="px-2 py-2 tabular-nums">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2
        id="limits"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        MPG Calculator Limitations
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Results assume constant average economy and accurate odometer/pump
        readings. They do not replace manufacturer data or onboard computers.
      </p>

      <h2
        id="related"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related Calculators
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <Link href="/tools/fuel-cost-calculator">Fuel Cost Calculator</Link>
        </li>
        <li>
          <Link href="/tools/gas-calculator">Gas Calculator</Link>
        </li>
        <li>
          <Link href="/tools/miles-to-hours-converter">
            Miles to Hours Converter
          </Link>
        </li>
        <li>
          <Link href="/tools/idling-fuel-consumption-calculator">
            Idling Fuel Consumption Calculator
          </Link>
        </li>
      </ul>

      <h2
        id="mpg-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion faqs={[...MPG_FAQS]} />
      </div>
    </article>
  );
}
