import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { DRIVE_TIME_FAQS } from './content';

export function DriveTimeGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Drive Time Calculator – Travel Time, Arrival Time &amp; Fuel Cost
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Estimate how long a drive will take, when you will arrive or must leave,
        how much fuel you may use, and how to split trip costs. Results are
        mathematical estimates from your inputs — not live traffic routing.
      </p>

      <h2
        id="what-is"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is a Drive Time Calculator?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A tool that converts distance and average speed into driving time, adds
        breaks, optionally schedules departure/arrival, and estimates fuel and
        shared trip costs.
      </p>

      <h2
        id="how-drive-time"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Drive Time
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Use matching units (e.g., km with km/h). Divide distance by average
        speed to get hours, then format as hours and minutes.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Drive Time Formula
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        Time = Distance / Speed
      </p>

      <h2
        id="arrival"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Estimate Arrival Time
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        Arrival = Departure + TotalTripTime
      </p>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        TotalTripTime includes driving plus breaks. Elapsed time is added so
        midnight and multi-day trips roll the calendar correctly.
      </p>

      <h2
        id="departure"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Departure Time
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        Departure = Arrival − TotalTripTime
      </p>

      <h2
        id="breaks"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Include Rest Stops
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Enter the sum of planned stop durations. Breaks do not change fuel used
        in this model unless you also change distance or economy.
      </p>

      <h2
        id="with-breaks"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Driving Time with Breaks
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Example: 300 km at 60 km/h → 5 h driving; 45 min breaks → 5 h 45 min
        total. Depart 10:00 → arrive 15:45.
      </p>

      <h2
        id="avg-speed"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Average Speed vs. Instantaneous Speed
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Trip planning uses average speed over the journey. A 120 km/h cruise on
        open road may still average far less once towns and congestion appear.
      </p>

      <h2
        id="fuel"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Fuel Consumption
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        FuelUsed(L) = Distance(km) × (L/100 km) / 100
      </p>

      <h2
        id="fuel-cost"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Estimate Fuel Costs
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        FuelCost = FuelUsed × FuelPrice
      </p>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Currency selection changes the money label only (denomination). It does
        not apply live exchange rates.
      </p>

      <h2
        id="total-cost"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Total Trip Cost
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        Total = FuelCost + Parking + Tolls + Other
      </p>

      <h2
        id="split"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Split Driving Costs
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        CostPerPerson = Total / Passengers
      </p>

      <h2
        id="per-mile"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Cost Per Mile
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        CostPerMile = Total / DistanceMiles, or convert CostPerKm using 1 mi =
        1.609344 km.
      </p>

      <h2
        id="per-km"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Cost Per Kilometer
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Example: PKR 6,680 over 300 km ≈ PKR 22.27/km.
      </p>

      <h2
        id="faster"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Does Driving Faster Save Time?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Mathematically yes if average speed rises. Practically, limits, traffic,
        and fuel economy often reduce the benefit. This tool does not change
        fuel use when only speed changes.
      </p>

      <h2
        id="traffic"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Traffic Affects Driving Time
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Congestion lowers average speed and can force extra stops. Encode that
        by lowering average speed or increasing break time — there is no live
        traffic API here.
      </p>

      <h2
        id="why-avg"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Why Average Speed Matters
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Arrival estimates fail when cruise speed is mistaken for trip average.
        Use a conservative average for planning buffers.
      </p>

      <h2
        id="road-trip"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Plan a Long Road Trip
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Combine realistic averages, mandatory rest, fuel stops, tolls, and
        shared costs. Recalculate when distance or passenger count changes.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use the Drive Time Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter distance and average speed with units.</li>
        <li>Add total break duration.</li>
        <li>Choose arrival-from-departure or departure-from-arrival.</li>
        <li>Enter fuel economy, price, extras, and passengers.</li>
        <li>Read duration, schedule, fuel, and cost-per-person results.</li>
      </ol>

      <h2
        id="examples"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Drive Time Calculator Examples
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          Assumed 300 km city-to-city at 60 km/h + 45 min breaks → 5 h 45 min;
          7 L/100 km → 21 L; PKR 280/L → PKR 5,880 fuel.
        </li>
        <li>
          Assumed 100 miles at 50 mph → 2 hours driving before stops.
        </li>
      </ul>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations of Drive Time Estimates
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        No live traffic, routing, elevation, or weather model. Fuel economy is
        an assumption, not OBD data. Currency is a label, not an FX conversion.
      </p>

      <h2
        id="related"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related Calculators
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <Link
            href="/tools/commute-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Commute Calculator
          </Link>
        </li>
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
      </ul>

      <h2
        id="drive-time-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion faqs={[...DRIVE_TIME_FAQS]} />
      </div>
    </article>
  );
}
