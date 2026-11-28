import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { BSFC_FAQS } from './content';

export function BsfcGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        BSFC Calculator – Brake Specific Fuel Consumption &amp; Engine
        Efficiency
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Calculate brake thermal efficiency from BSFC and fuel lower heating
        value, estimate fuel mass flow from brake power, and solve reverse
        cases for BSFC or required power. Unit conversions cover common power
        and BSFC conventions. Results are educational estimates.
      </p>

      <h2
        id="what-is"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is Brake Specific Fuel Consumption (BSFC)?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        BSFC quantifies how much fuel mass an engine consumes for each unit of
        useful brake power over time. Lower BSFC generally means better
        fuel-use efficiency when fuels and test conditions are comparable.
      </p>

      <h2
        id="what-measures"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Does BSFC Measure?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        It combines fuel mass flow rate with brake power: how many grams of fuel
        per kilowatt of shaft power per hour (or equivalent units).
      </p>

      <h2
        id="how-to-calculate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate BSFC
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Measure or estimate fuel mass flow and brake power, then divide. Example:
        25 kg/h of fuel at 100 kW → 250 g/(kW·h).
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        BSFC Formula
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        BSFC = ṁ_f / P_b
      </p>

      <h2
        id="efficiency-from-bsfc"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Engine Efficiency from BSFC
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        η_b(%) = 360000 / (BSFC × LHV)
      </p>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        With BSFC in g/(kW·h) and LHV in MJ/kg. Power cancels for this conversion
        but is still needed for absolute fuel flow.
      </p>

      <h2
        id="bsfc-and-bte"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        BSFC and Brake Thermal Efficiency
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        For a fixed fuel heating value, efficiency and BSFC move inversely:
        halving BSFC doubles thermal efficiency in this ideal LHV model.
      </p>

      <h2
        id="fuel-type"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Fuel Type Affects BSFC and Efficiency
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Different fuels carry different lower heating values. The same BSFC
        implies different brake thermal efficiency when LHV changes. This tool
        uses representative LHV assumptions you can override with Custom Fuel.
      </p>

      <h2
        id="gasoline"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        BSFC for Gasoline Engines
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Spark-ignition engines often show higher BSFC at light load due to
        throttling. Peak-efficiency islands are typically at moderate-to-high
        load. Treat any single number as illustrative only.
      </p>

      <h2
        id="diesel"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        BSFC for Diesel Engines
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Compression-ignition engines frequently achieve lower BSFC than many
        gasoline engines thanks to higher compression ratios and lean operation,
        but maps still vary strongly with speed and load.
      </p>

      <h2
        id="bsfc-vs-sfc"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        BSFC vs. Specific Fuel Consumption
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        “SFC” is a generic label. BSFC uses brake power; ISFC uses indicated
        power from cylinder work before friction losses.
      </p>

      <h2
        id="load"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Engine Load Affects BSFC
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Operating point on the BSFC map matters more than a single catalog
        figure. Part-load and idle points are often less efficient.
      </p>

      <h2
        id="rpm"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        BSFC and Engine RPM
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Friction and combustion phasing change with speed, so BSFC at fixed torque
        still varies across the RPM range.
      </p>

      <h2
        id="improve"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Improve Engine Fuel Efficiency
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Operate nearer efficient map regions, maintain the engine, reduce parasitic
        loads, and respect thermodynamic limits — efficiency cannot exceed what
        the cycle and fuel allow.
      </p>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations of BSFC Calculations
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Fuel composition, LHV vs HHV basis, accessories, ambient conditions, and
        measurement uncertainty all affect real results. This calculator does not
        replace dyno testing or manufacturer maps.
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
            href="/tools/boost-horsepower-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Boost Horsepower Calculator
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
        id="bsfc-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...BSFC_FAQS]} />
      </div>
    </article>
  );
}
