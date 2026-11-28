import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { RPM_FAQS } from './content';

export function RpmGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        RPM Calculator – Engine RPM, Wheel RPM &amp; Vehicle Speed
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Relate engine revolutions per minute, overall drivetrain ratio, wheel
        RPM, tire diameter, and vehicle speed. Fill any related pair of values
        to solve for the rest under slip-free, nominal-tire assumptions.
      </p>

      <h2 id="what-rpm" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        What Is RPM?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        RPM means revolutions per minute—the rate at which a shaft or wheel
        completes full rotations. It measures rotational speed, not linear
        road speed by itself.
      </p>

      <h2 id="car-rpm" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        What Does RPM Mean in a Car?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Drivers usually see engine RPM on the tachometer. That crankshaft speed
        connects to the wheels through the gearbox and final drive, so gearing
        and tire size sit between tachometer reading and road speed.
      </p>

      <h2 id="engine-rpm" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        What Is Engine RPM?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Engine RPM is how fast the crankshaft turns. It is not the same as mph
        or km/h; converting requires overall ratio and tire circumference.
      </p>

      <h2 id="wheel-rpm" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        What Is Wheel RPM?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Wheel RPM is how fast the driven wheels rotate. Each revolution advances
        the vehicle by about one tire circumference (π × diameter for a
        circular model).
      </p>

      <h2 id="engine-vs-wheel" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Engine RPM vs Wheel RPM
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        With overall ratio R, ERPM = WRPM × R. A ratio of 4 means the engine
        turns four times for each wheel revolution.
      </p>

      <h2 id="ratio" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        What Is a Drivetrain Transmission Ratio?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Overall reduction from engine to wheels. When useful, R = G × F with
        gearbox ratio G and final-drive ratio F, assuming a locked or otherwise
        slip-free path.
      </p>

      <h2 id="how-calc" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Calculate RPM
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Use the two links: gearing (ERPM ↔ WRPM via R) and rolling geometry
        (WRPM ↔ speed via tire diameter). Solve only what those equations
        determine from your inputs.
      </p>

      <h2 id="engine-formula" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Engine RPM Formula
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        ERPM = WRPM × R
      </p>

      <h2 id="wheel-formula" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Wheel RPM Formula
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        WRPM = ERPM / R
      </p>

      <h2 id="speed-formula" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Vehicle Speed Formula
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        mph = WRPM × π × D / 1056
      </p>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        With D in inches. Equivalently in SI: V (m/s) = WRPM × π × D_m / 60.
      </p>

      <h2 id="speed-from-engine" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Calculate Vehicle Speed From Engine RPM
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>WRPM = 3000 / 4 = 750 rpm.</li>
        <li>mph = 750 × π × 26 / 1056 ≈ 58.01 mph (~93.36 km/h).</li>
      </ol>

      <h2 id="engine-from-speed" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Calculate Engine RPM From Vehicle Speed
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        ERPM = (mph × 1056 × R) / (π × D)
      </p>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Example: 60 mph, 26 in, R = 3.73 → about 2894 RPM.
      </p>

      <h2 id="tire-effect" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How Tire Diameter Affects Engine RPM
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Larger tires cover more ground per revolution. At the same road speed
        and gearing, wheel RPM and engine RPM both fall.
      </p>

      <h2 id="ratio-effect" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How Transmission Ratios Affect RPM
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Shorter (numerically higher) overall ratios raise engine RPM at a given
        road speed; taller ratios lower cruising RPM.
      </p>

      <h2 id="fuel" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        RPM and Fuel Consumption
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Engine speed influences fuel use, but load, efficiency islands, gear
        choice, and driving conditions matter as much as RPM alone.
      </p>

      <h2 id="performance" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        RPM and Engine Performance
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Engines produce different torque across the rev range. Operating near
        the useful band affects acceleration and responsiveness.
      </p>

      <h2 id="torque" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        RPM vs Torque
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Torque is twisting force; RPM is rotational speed. They are different
        physical quantities.
      </p>

      <h2 id="horsepower" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        RPM vs Horsepower
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Power combines torque and rotational speed (power ∝ torque × RPM). High
        RPM without torque does not imply high power.
      </p>

      <h2 id="highway" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Engine RPM at Highway Speeds
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Cruising RPM follows from highway speed, top-gear overall ratio, and
        tire diameter—the same formulas this calculator uses.
      </p>

      <h2 id="how-to-use" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Use the RPM Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter engine RPM and overall ratio to get wheel RPM.</li>
        <li>Add tire diameter to estimate vehicle speed.</li>
        <li>Or enter speed, diameter, and ratio to estimate engine RPM.</li>
        <li>Optionally split ratio into gearbox × final drive.</li>
      </ol>

      <h2 id="limits" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        RPM Calculator Limitations
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Assumes constant gearing without slip, nominal circular tires, and
        straight-line travel. Real torque converters, clutches, differentials,
        and rolling circumference can differ. Not a substitute for OEM
        instrumentation.
      </p>

      <h2 id="related" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Related Calculators
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <Link href="/tools/pulse-per-mile-calculator" className="text-primary underline-offset-2 hover:underline">
            Pulse per Mile Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/mpg-calculator" className="text-primary underline-offset-2 hover:underline">
            MPG Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/miles-to-hours-converter" className="text-primary underline-offset-2 hover:underline">
            Miles to Hours Converter
          </Link>
        </li>
      </ul>

      <h2 id="rpm-faq" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion faqs={[...RPM_FAQS]} />
      </div>
    </article>
  );
}
