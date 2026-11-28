import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { SPEED_FAQS } from './content';

export function SpeedGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Speed Calculator – Calculate Speed, Distance &amp; Time
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Calculate speed, distance, or travel time from any two known values.
        Convert among km/h, mph, m/s, knots, and many distance and time units.
        Optional tools compare your speed to illustrative references and compute
        multi-segment average speed.
      </p>

      <h2 id="what-speed" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        What Is Speed?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Speed is distance traveled per unit of time. It answers “how fast?”
        without specifying direction.
      </p>

      <h2 id="sdt" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Speed, Distance, and Time
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The three quantities are linked: knowing any two determines the third
        when motion is described by a single average rate.
      </p>

      <h2 id="formula" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Speed Formula
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        Speed = Distance / Time
      </p>
      <p className="mt-2 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        Distance = Speed × Time · Time = Distance / Speed
      </p>

      <h2 id="how-speed" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Calculate Speed
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Example: 150 km in 3 hours → 150 ÷ 3 = 50 km/h (about 31.07 mph or
        13.89 m/s).
      </p>

      <h2 id="how-distance" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Calculate Distance
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Example: 90 km/h for 3 hours → 90 × 3 = 270 km.
      </p>

      <h2 id="how-time" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Calculate Travel Time
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Example: 300 km at 75 km/h → 300 ÷ 75 = 4 hours.
      </p>

      <h2 id="avg" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        What Is Average Speed?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Average speed is total distance divided by total elapsed time—not
        usually the mean of several speed readings.
      </p>

      <h2 id="avg-how" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Calculate Average Speed
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Segments of 80 km in 1 h and 120 km in 2 h: total 200 km in 3 h →
        average ≈ 66.67 km/h.
      </p>

      <h2 id="velocity" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Average Speed vs Average Velocity
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Average velocity uses displacement (change in position) over time.
        Returning to the start can mean large average speed but near-zero
        average velocity.
      </p>

      <h2 id="instant" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Instantaneous Speed vs Average Speed
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Instantaneous speed is the rate at one moment. This calculator’s basic
        mode gives average speed over the duration you enter.
      </p>

      <h2 id="units" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Common Speed Units
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        m/s (SI), km/h and mph (road), ft/s, and knots (marine/aviation).
      </p>

      <h2 id="kmh-mph" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Convert km/h to mph
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Divide by 1.609344. 100 km/h ≈ 62.14 mph.
      </p>

      <h2 id="mph-kmh" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Convert mph to km/h
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Multiply by 1.609344. 60 mph = 96.56064 km/h.
      </p>

      <h2 id="ms-kmh" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Convert m/s to km/h
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        km/h = m/s × 3.6
      </p>

      <h2 id="kn-kmh" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Convert Knots to km/h
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        km/h = knots × 1.852
      </p>

      <h2 id="sound" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Speed of Sound
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        In air near room temperature, sound travels roughly 343 m/s. Temperature,
        humidity, and medium change the value—comparison tables are approximate.
      </p>

      <h2 id="light" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Speed of Light
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        In vacuum, light travels at exactly 299,792,458 m/s—the defined constant
        c.
      </p>

      <h2 id="road" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Speed and Road Travel
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Trip planning often uses average speed including traffic and stops. The
        formula still applies once you choose which distance and which elapsed
        time to include.
      </p>

      <h2 id="transport" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Speed and Transportation
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Walking, cycling, cars, trains, and aircraft span very different speed
        ranges. The comparison section uses approximate references for scale
        only.
      </p>

      <h2 id="how-to-use" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Use the Speed Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Choose Calculate → Speed, Distance, or Time.</li>
        <li>Enter the two known values and units.</li>
        <li>Optionally open comparisons or multi-segment average speed.</li>
      </ol>

      <h2 id="limits" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Speed Calculator Limitations
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Results assume the distances and times you enter. Real trips vary with
        traffic, terrain, and stops. This tool does not compute vector velocity
        or instantaneous speed from a single average.
      </p>

      <h2 id="related" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Related Calculators
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <Link href="/tools/rpm-calculator" className="text-primary underline-offset-2 hover:underline">
            RPM Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/miles-to-hours-converter" className="text-primary underline-offset-2 hover:underline">
            Miles to Hours Converter
          </Link>
        </li>
        <li>
          <Link href="/tools/nautical-mile-calculator" className="text-primary underline-offset-2 hover:underline">
            Nautical Mile Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/mpg-calculator" className="text-primary underline-offset-2 hover:underline">
            MPG Calculator
          </Link>
        </li>
      </ul>

      <h2 id="speed-faq" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion faqs={[...SPEED_FAQS]} />
      </div>
    </article>
  );
}
