import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { CROSSWIND_FAQS } from './content';

export function CrosswindGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Crosswind Calculator – Calculate Crosswind, Headwind &amp; Tailwind
        Components
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Resolve runway wind into crosswind and headwind/tailwind components
        using runway number (or precise heading), wind direction, and wind
        speed. Results update live with a relative-angle chart and schematic
        diagram. Educational reference only — not aircraft operating limits.
      </p>

      <h2
        id="what-crosswind"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is a Crosswind?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A crosswind is the portion of the wind perpendicular to the runway
        centerline. It creates lateral drift and weathervaning tendencies during
        takeoff and landing.
      </p>

      <h2
        id="what-headwind"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is a Headwind?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A headwind opposes the aircraft along the runway. For a given airspeed,
        it reduces groundspeed and can shorten takeoff and landing rolls when
        other factors allow.
      </p>

      <h2
        id="what-tailwind"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is a Tailwind?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A tailwind blows from behind along the runway direction, increasing
        groundspeed for a given airspeed and typically lengthening runway
        distance required.
      </p>

      <h2
        id="compare"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Crosswind vs. Headwind vs. Tailwind
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Crosswind is lateral (sine of relative angle). Headwind and tailwind are
        longitudinal (cosine). One wind vector produces both families of
        components unless θ is exactly 0°, ±90°, or ±180°.
      </p>

      <h2
        id="runway-number"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is a Runway Number?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Runway numbers 01–36 encode approximate magnetic orientation in tens of
        degrees. They are rounded designators, not always the exact published
        heading.
      </p>

      <h2
        id="runway-heading"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Runway Heading
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        H ≈ R × 10°
      </p>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Examples: 09 → 90°, 18 → 180°, 27 → 270°, 36 → 360°/0°. Use the advanced
        precise-heading option when charts publish a different magnetic value.
      </p>

      <h2
        id="wind-direction"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Understanding Wind Direction
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Aviation wind direction is the direction the wind comes{' '}
        <em>from</em>. A 270° wind comes from the west. Do not treat it as the
        direction the air is traveling toward when applying these formulas.
      </p>

      <h2
        id="how-crosswind"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Crosswind Component
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Convert runway number to heading H (or enter precise H).</li>
        <li>Ensure wind direction W uses the same north reference as H.</li>
        <li>Compute θ = ((W − H + 540) mod 360) − 180.</li>
        <li>Compute X = V × sin(θ).</li>
      </ol>

      <h2
        id="crosswind-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Crosswind Formula
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        Crosswind = WindSpeed × |sin(θ)|
      </p>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Signed form X = V sin(θ): positive = from the right, negative = from the
        left (with this calculator’s θ convention).
      </p>

      <h2
        id="how-headwind"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Headwind Component
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Use the cosine of the same relative angle. Positive results are
        headwind; negative results are interpreted as tailwind.
      </p>

      <h2
        id="headwind-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Headwind Formula
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        HeadwindComponent = WindSpeed × cos(θ)
      </p>

      <h2
        id="how-tailwind"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Tailwind Component
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        Tailwind = max(0, −HeadwindComponent)
      </p>

      <h2
        id="example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Crosswind Calculation Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Runway 27 (H = 270°), wind from 300°, V = 20 kt → θ = 30° → X = 20 ×
        sin(30°) = 10 kt from the right; Hw = 20 × cos(30°) ≈ 17.32 kt headwind.
      </p>

      <h2
        id="ht-examples"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Headwind and Tailwind Calculation Examples
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>RWY 36, wind 000°, 15 kt → 15 kt headwind, 0 crosswind.</li>
        <li>RWY 18, wind 000°, 15 kt → 15 kt tailwind, 0 crosswind.</li>
        <li>RWY 36, wind 090°, 20 kt → 20 kt right crosswind, 0 head/tail.</li>
      </ul>

      <h2
        id="chart"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Read a Crosswind Component Chart
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The chart plots signed crosswind versus θ for the current wind speed.
        Peaks at ±90° equal ±V; zeros at 0° and ±180°. The red marker is your
        current relative angle.
      </p>

      <h2
        id="relative-angle"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is the Relative Wind Angle?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        θ is wind-from direction minus runway heading, wrapped so it stays
        between −180° and +180°. Crossing 0°/360° is handled by the modular
        wrap formula.
      </p>

      <h2
        id="left-right"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Determine Crosswind Direction
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Positive signed crosswind = from the right of the runway heading.
        Negative = from the left. Zero = no lateral component.
      </p>

      <h2
        id="takeoff-landing"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Wind Affects Aircraft Takeoff and Landing
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Headwinds generally reduce ground roll; tailwinds increase it. Crosswinds
        demand coordinated control technique. Surface condition, density
        altitude, weight, and pilot proficiency also matter — beyond this math.
      </p>

      <h2
        id="max-demonstrated"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is a Maximum Demonstrated Crosswind Component?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Many aircraft publish a maximum demonstrated crosswind from flight test.
        It shows what was demonstrated, not a universal “safe for everyone”
        limit. Consult the specific AFM/POH and operator policy.
      </p>

      <h2
        id="gusts"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Wind Gusts and Crosswind Calculations
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Steady-speed components ignore gust peaks. Gusty conditions can raise
        instantaneous crosswind; use official reports and local procedures when
        deciding whether to fly.
      </p>

      <h2
        id="true-magnetic"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        True Wind vs. Magnetic Wind Direction
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Runway numbers are magnetic. METARs often report true wind; tower winds
        are usually magnetic. This calculator can convert true wind with
        east-positive variation: Magnetic = True − Variation. Never mix
        references silently.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use This Crosswind Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Select runway 01–36 (default 36).</li>
        <li>Enter wind-from direction in degrees.</li>
        <li>Enter wind speed and choose kt, km/h, mph, or m/s.</li>
        <li>Optionally set precise heading or true-wind variation.</li>
        <li>Read crosswind, head/tail, θ, diagram, and chart.</li>
      </ol>

      <h2
        id="related"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related Calculators
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
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
            href="/tools/commute-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Commute Calculator
          </Link>
        </li>
      </ul>

      <h2
        id="crosswind-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion faqs={[...CROSSWIND_FAQS]} />
      </div>
    </article>
  );
}
