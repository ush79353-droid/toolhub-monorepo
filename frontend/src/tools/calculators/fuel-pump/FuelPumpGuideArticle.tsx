import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { FUEL_PUMP_FAQS } from './content';

export function FuelPumpGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Fuel Pump Calculator – Calculate Fuel Flow Rate and Pressure
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Estimate automotive fuel demand from horsepower and BSFC, convert to
        volume with fuel density, and compute rail/outlet pressure from your
        pressure-control assumptions. Suggested BSFC and density are labeled
        estimates — not manufacturer pump specifications.
      </p>

      <h2
        id="what-is-pump"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is a Fuel Pump?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The fuel pump delivers pressurized fuel from the tank to the fuel rail
        or injectors so the engine can meet commanded fuel mass flow.
      </p>

      <h2
        id="what-is-calc"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is a Fuel Pump Calculator?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        It estimates required fuel flow and operating pressure for planning.
        Compare results to manufacturer pressure–flow curves before selecting a
        pump.
      </p>

      <h2
        id="how-works"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Does a Fuel Pump Work?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The pump raises pressure and pushes volume against filters, lines, and
        regulators. Delivered volume typically falls as outlet pressure rises.
      </p>

      <h2
        id="flow-explained"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Fuel Pump Flow Rate Explained
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Engine demand is the fuel mass/volume the engine needs. Pump capacity is
        what the pump can deliver at a stated pressure and voltage.
      </p>

      <h2
        id="how-to-calc"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Fuel Pump Flow Rate
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        Q_L/hr = (HP × BSFC × 0.45359237) / ρ_kg/L
      </p>

      <h2
        id="bsfc"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is BSFC?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Brake-specific fuel consumption links brake power to fuel mass flow.
        Override suggested values with dyno or calibration data when available.
      </p>

      <h2
        id="na"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Fuel Pump Requirements for Naturally Aspirated Engines
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Boost is typically zero. Demand still scales with horsepower and BSFC.
      </p>

      <h2
        id="turbo"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Fuel Pump Requirements for Turbocharged Engines
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Higher power and often richer BSFC estimates raise flow. On 1:1
        referenced systems, boost also raises rail gauge pressure.
      </p>

      <h2
        id="super"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Fuel Pump Requirements for Supercharged Engines
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Plan similarly to turbo applications: power, BSFC, and pressure mode
        drive the estimate.
      </p>

      <h2
        id="gas-diesel"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Gasoline vs. Diesel Fuel Pump Requirements
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Diesel systems often run higher pressures and different pump
        architectures. Use diesel BSFC/density assumptions — do not reuse
        gasoline conversion factors blindly.
      </p>

      <h2
        id="fuel-type"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Fuel Type Affects Required Flow
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Density and BSFC both change volumetric demand. Alcohol blends usually
        need more volume for the same power under typical estimates.
      </p>

      <h2
        id="base-pressure"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Understanding Base Fuel Pressure
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Base pressure is a gauge reference for your regulator strategy. Keep
        gauge vs absolute references consistent.
      </p>

      <h2
        id="boost-pressure"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Boost Pressure Affects Fuel Pressure
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        P_rail = P_base + P_boost (manifold-referenced 1:1)
      </p>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Fixed-rail systems keep rail ≈ base while injector differential pressure
        changes with manifold pressure.
      </p>

      <h2
        id="return"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Return vs. Returnless Fuel Systems
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Not every return system is 1:1 referenced, and not every returnless
        system is fixed pressure. Choose the pressure-control mode that matches
        your hardware.
      </p>

      <h2
        id="choose"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Choose a Fuel Pump
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Size against manufacturer flow at your estimated outlet pressure and
        voltage. Do not invent a curve from a single free-flow number.
      </p>

      <h2
        id="vs-pressure"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Fuel Pump Flow Rate vs. Operating Pressure
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Free-flow capacity overstates delivery at rail/outlet pressure. Always
        read the pressure–flow chart.
      </p>

      <h2
        id="example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Fuel Pump Sizing Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        300 hp · BSFC 0.50 · density 0.745 kg/L → ≈{' '}
        <strong>91.33 L/hr</strong> demand. With base 3 bar and 0 boost on a
        referenced system, rail ≈ 3 bar.
      </p>

      <h2
        id="convert"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Convert L/hr to Gallons per Hour
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        US gal/hr = L/hr ÷ 3.785411784. Example: 91.33 L/hr ≈ 24.13 US gal/hr.
      </p>

      <h2
        id="margin"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Fuel Pump Capacity Safety Margins
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        Q_target = Q_fuel × (1 + Margin/100)
      </p>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Margins are optional and explicit in this calculator (default 0%).
      </p>

      <h2
        id="mistakes"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Common Fuel Pump Sizing Mistakes
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Using free-flow ratings, wrong BSFC/density, assuming every system is
        1:1 with boost, ignoring line losses, and extrapolating pump curves.
      </p>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Fuel Pump Calculator Limitations
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Real systems depend on plumbing, filters, voltage, fuel temperature, and
        regulator design. This tool is for transparent estimates only.
      </p>

      <h2
        id="related"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related Calculators
      </h2>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-foreground/90 sm:text-base">
        <li>
          <Link href="/tools/fuel-injector-calculator">
            Fuel Injector Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/bsfc-calculator">BSFC Calculator</Link>
        </li>
        <li>
          <Link href="/tools/horsepower-calculator">Horsepower Calculator</Link>
        </li>
        <li>
          <Link href="/tools/boost-horsepower-calculator">
            Boost Horsepower Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/fuel-cost-calculator">Fuel Cost Calculator</Link>
        </li>
      </ul>

      <h2
        id="fp-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion faqs={[...FUEL_PUMP_FAQS]} />
      </div>
    </article>
  );
}
