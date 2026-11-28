import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { IDLING_FAQS } from './content';

export function IdlingFuelGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Idling Fuel Consumption Calculator – Calculate Fuel Used While Idling
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Estimate petrol or diesel burn while idling from engine capacity (or a
        custom measured rate), then calculate fuel used and cost for any
        duration. Estimates are simplified — not guaranteed measured rates.
      </p>

      <h2
        id="what-is"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is Idling Fuel Consumption?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        It is the fuel an engine burns while running without propelling the
        vehicle, usually expressed as volume per hour.
      </p>

      <h2
        id="why-consume"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Why Does an Engine Consume Fuel While Idling?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Combustion keeps the engine turning and powers accessories such as the
        alternator, pumps, and air conditioning even when the wheels are still.
      </p>

      <h2
        id="petrol-diesel"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Petrol vs. Diesel Idling Consumption
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This calculator uses approximate coefficients of 0.6 L/h per liter of
        displacement for petrol and 0.45 for diesel. Real engines vary widely.
      </p>

      <h2
        id="how-much"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Much Fuel Does a Car Use While Idling?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Typical light vehicles often idle near roughly 0.5–2 L/h depending on
        size and load — measure when accuracy matters.
      </p>

      <h2
        id="how-calc"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Idling Fuel Consumption
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Convert displacement to liters, apply the fuel-type coefficient (or use
        a custom L/h rate), convert idle time to hours, then multiply.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Idling Fuel Consumption Formula
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        Petrol: Rate ≈ 0.6 × EngineLiters · Diesel: Rate ≈ 0.45 × EngineLiters
      </p>

      <h2
        id="total-fuel"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Total Fuel Consumed While Idling
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        FuelConsumed = FuelRate × IdlingHours
      </p>

      <h2
        id="cost"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Idling Fuel Cost
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        IdlingCost = FuelConsumed × PricePerLiter
      </p>

      <h2
        id="example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Idling Fuel Consumption Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        2.0 L petrol → 1.2 L/h. For 30 minutes (0.5 h): 0.6 L. At PKR 280/L the
        cost is PKR 168.
      </p>

      <h2
        id="2l"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Much Fuel Does a 2.0 L Engine Use While Idling?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Petrol estimate ~1.2 L/h; diesel estimate ~0.9 L/h under the simplified
        model.
      </p>

      <h2
        id="10min"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Much Fuel Does a Car Consume in 10 Minutes of Idling?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        At 1.2 L/h: about 0.2 L.
      </p>

      <h2
        id="30min"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Much Fuel Does a Car Consume in 30 Minutes of Idling?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        At 1.2 L/h: about 0.6 L.
      </p>

      <h2
        id="1hour"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Much Fuel Does a Car Consume in One Hour of Idling?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Approximately the hourly rate itself (e.g. 1.2 L for the 2.0 L petrol
        estimate).
      </p>

      <h2
        id="engine-size"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Does Engine Size Affect Idling Fuel Consumption?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Larger engines often idle with higher absolute fuel flow, but
        efficiency, calibration, and loads also matter.
      </p>

      <h2
        id="ac"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Does Air Conditioning Increase Idling Fuel Consumption?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Yes. Compressor load raises engine demand and typically increases idle
        fuel use.
      </p>

      <h2
        id="cold"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Does Cold Weather Increase Fuel Consumption While Idling?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Cold enrichment and higher friction can increase fuel use until the
        engine reaches normal temperature.
      </p>

      <h2
        id="temp"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Does Engine Temperature Affect Idling Consumption?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Warm engines usually idle leaner and more efficiently than cold engines.
      </p>

      <h2
        id="restart"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Does Idling Consume More Fuel Than Restarting?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        For longer stops, shutting off often saves fuel on modern cars; very
        short stops may differ. Follow local rules and safety needs.
      </p>

      <h2
        id="reduce"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Reduce Unnecessary Idling
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Turn off when parked safely, avoid long warm-ups in mild weather, and
        limit accessory use at idle when practical.
      </p>

      <h2
        id="co2"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Idling Fuel Consumption and CO₂ Emissions
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Direct (tank-to-wheel) CO₂ scales with liters burned. Optional estimates
        use approximate factors and exclude upstream fuel production.
      </p>

      <h2
        id="monthly"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Daily and Monthly Idling Costs
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Recurring idle patterns add up. Use the long-term section to project
        weekly and annual costs from a typical daily idle duration.
      </p>

      <h2
        id="why-differ"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Why Idling Fuel Estimates May Differ From Actual Consumption
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Accessories, temperature, RPM, hybrids/start-stop, and calibration all
        move real idle burn away from a simple displacement formula.
      </p>

      <h2
        id="related"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related Calculators
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        See{' '}
        <Link
          href="/tools/fuel-cost-calculator"
          className="text-primary underline-offset-2 hover:underline"
        >
          Fuel Cost Calculator
        </Link>
        ,{' '}
        <Link
          href="/tools/gas-calculator"
          className="text-primary underline-offset-2 hover:underline"
        >
          Gas Calculator
        </Link>
        , and{' '}
        <Link
          href="/tools/bsfc-calculator"
          className="text-primary underline-offset-2 hover:underline"
        >
          BSFC Calculator
        </Link>{' '}
        when available.
      </p>

      <h2
        id="idle-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion faqs={[...IDLING_FAQS]} />
      </div>
    </article>
  );
}
