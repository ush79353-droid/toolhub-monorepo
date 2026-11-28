import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { WINDSOCK_FAQS } from './content';

export function WindsockGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Windsock Calculator – Estimate Wind Speed from Windsock Segments
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Estimate wind speed from the number of extended windsock segments using
        a simplified ≈3 kn per segment model, and convert between knots, mph,
        km/h, m/s, and ft/s. Approximate visual guide only — not a calibrated
        anemometer.
      </p>

      <h2 id="what" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        What Is a Windsock?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A windsock is a tapered fabric tube mounted on a mast so it can rotate
        freely and fill with moving air.
      </p>

      <h2 id="how-works" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How Does a Windsock Work?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Wind pressure inflates the cone. Stronger flow lifts and extends more of
        the fabric along the mast’s pivot.
      </p>

      <h2 id="measures" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        What Does a Windsock Measure?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Direction is shown by orientation; speed is only roughly suggested by
        how fully the sock extends.
      </p>

      <h2 id="how-read" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Read a Windsock
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Face the open end into the wind mentally: air enters the wide mouth and
        exits the tip. Count extended bands for a rough speed cue.
      </p>

      <h2 id="formula" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Windsock Wind Speed Formula
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        V_kn = 3 × n
      </p>

      <h2 id="knots-per" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How Many Knots Does Each Windsock Segment Represent?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        About three knots in this common rule of thumb. Specifications and sock
        designs differ — do not treat 3 kn/segment as universal law.
      </p>

      <h2 id="estimate" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Estimate Wind Speed from a Windsock
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Observe how many segments look filled or extended.</li>
        <li>Enter that integer (0–5) in the calculator.</li>
        <li>Read knots and converted units.</li>
        <li>Remember gusts and partial fills blur the count.</li>
      </ol>

      <h2 id="conversion" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Windsock Wind Speed Conversion
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Knots convert with fixed factors: mph ≈ kn×1.15078, km/h = kn×1.852,
        m/s ≈ kn×0.51444, ft/s ≈ kn×1.68781.
      </p>

      <h2 id="full" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        What Does a Fully Extended Windsock Mean?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        In this model, five segments ≈ 15 kn. Stronger winds may keep the sock
        fully out without finer segment resolution.
      </p>

      <h2 id="colors" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Windsock Colors and Their Meaning
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Orange or alternating red/white stripes improve visibility. Color
        patterns are for contrast, not a coded speed scale.
      </p>

      <h2 id="where" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Where Are Windsocks Used?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Airports, helipads, industrial and chemical sites, roadside locations,
        and outdoor activity areas that need a quick wind cue.
      </p>

      <h2 id="aviation" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Windsocks in Aviation
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        They help observe surface wind near runways and landing areas alongside
        official weather information.
      </p>

      <h2 id="direction" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Windsock Wind Direction
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The open, wider end faces into the wind; the narrow end points downwind.
      </p>

      <h2 id="vs-anemometer" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Windsock vs. Anemometer
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Anemometers provide instrumented speed (and often direction). Windsocks
        provide immediate visual orientation with coarse speed bands.
      </p>

      <h2 id="vs-vane" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Windsock vs. Weather Vane
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Weather vanes emphasize direction; windsocks add a sense of strength via
        extension.
      </p>

      <h2 id="accuracy" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How Accurate Is a Windsock?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Direction is usually clear; speed is approximate and site-dependent.
      </p>

      <h2 id="factors" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Factors Affecting Windsock Accuracy
      </h2>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-foreground/90">
        <li>Dimensions and fabric stiffness</li>
        <li>Installation height and freeness to rotate</li>
        <li>Turbulence, gusts, and nearby obstacles</li>
        <li>Damage, wet fabric, and maintenance</li>
      </ul>

      <h2 id="how-use" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Use the Windsock Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter segments 0–5, or edit any speed field.</li>
        <li>Switch imperial (mph/ft/s) or metric (km/h/m/s) units as needed.</li>
        <li>Review conversions, reference table, and schematic.</li>
      </ol>

      <h2 id="example" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Windsock Calculation Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Three extended segments → 9 kn ≈ 10.36 mph ≈ 16.67 km/h ≈ 4.63 m/s.
      </p>

      <h2 id="limits" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Limitations of Windsock-Based Wind Speed Estimation
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This tool does not replace calibrated wind instruments, official weather
        reports, or aviation decision procedures. Above ~15 kn the five-segment
        model no longer resolves unique segment counts.
      </p>

      <h2 id="related" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Related Calculators
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-foreground/90">
        <li>
          <Link href="/tools/crosswind-calculator">Crosswind Calculator</Link>
        </li>
        <li>
          <Link href="/tools/speed-calculator">Speed Calculator</Link>
        </li>
        <li>
          <Link href="/tools/nautical-mile-calculator">
            Nautical Mile Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/flight-radiation-calculator">
            Flight Radiation Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/miles-to-hours-converter">
            Miles to Hours Converter
          </Link>
        </li>
      </ul>

      <h2 id="windsock-faq" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion faqs={[...WINDSOCK_FAQS]} />
      </div>
    </article>
  );
}
