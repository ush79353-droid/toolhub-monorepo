import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { MTH_FAQS } from './content';

export function MilesToHoursGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Miles to Hours Converter – Calculate Travel Time From Distance and
        Speed
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Convert distance and average speed into travel time, or solve for
        distance or required speed. Miles alone cannot become hours without a
        speed.
      </p>

      <h2
        id="what-is"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is a Miles to Hours Converter?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        It is a distance–speed–time calculator. Given any two of distance,
        speed, and time, it computes the third and can show a readable
        duration breakdown.
      </p>

      <h2
        id="how-works"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Does the Miles to Hours Calculator Work?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Choose Calculate Time, Distance, or Speed. Enter the other two fields.
        Units convert internally so mi/mph/h, km/km/h, knots/nmi, and more stay
        consistent.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Miles to Hours Formula
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        Time = Distance ÷ Speed
      </p>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Example: 150 miles ÷ 50 mph = 3 hours.
      </p>

      <h2
        id="how-convert"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Convert Miles to Hours
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Select Calculate → Time.</li>
        <li>Enter distance and choose a unit (default mi).</li>
        <li>Enter average speed (default mph).</li>
        <li>Read time in hours (or switch to min/s/d/wk) and the readable label.</li>
      </ol>

      <h2
        id="mph"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Hours From Miles and MPH
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Keep units matched: miles with mph. Hours = miles ÷ mph. For 120 mi at
        40 mph → 3 hours.
      </p>

      <h2
        id="minutes"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Convert Miles to Minutes
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        Minutes = (Miles ÷ MPH) × 60
      </p>

      <h2
        id="distance"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Distance From Speed and Time
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        Distance = Speed × Time
      </p>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Example: 60 mph × 2.5 h = 150 miles.
      </p>

      <h2
        id="speed"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Required Speed
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        Speed = Distance ÷ Time
      </p>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Example: 240 mi ÷ 4 h = 60 mph average. This is not advice to exceed
        posted limits.
      </p>

      <h2
        id="mph-kmh"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Miles per Hour vs. Kilometers per Hour
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        1 mph = 1.609344 km/h. Use matching distance units (mi with mph, km with
        km/h) or let the converter change units for you.
      </p>

      <h2
        id="examples"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Miles to Hours Conversion Examples
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>100 mi @ 50 mph → 2 h</li>
        <li>150 mi @ 50 mph → 3 h</li>
        <li>300 mi @ 60 mph → 5 h</li>
        <li>75 mi @ 50 mph → 1.5 h (1 hour 30 minutes)</li>
      </ul>

      <h2
        id="table"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Miles to Hours Conversion Table
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Illustrative times at constant average speed with no stops:
      </p>
      <div className="mt-3 overflow-x-auto not-prose">
        <table className="w-full min-w-[32rem] border-collapse text-left text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="px-2 py-2 font-semibold text-accent">Distance</th>
              <th className="px-2 py-2 font-semibold text-accent">30 mph</th>
              <th className="px-2 py-2 font-semibold text-accent">40 mph</th>
              <th className="px-2 py-2 font-semibold text-accent">50 mph</th>
              <th className="px-2 py-2 font-semibold text-accent">60 mph</th>
            </tr>
          </thead>
          <tbody className="text-foreground/90">
            {[
              ['30 miles', '1 hr', '45 min', '36 min', '30 min'],
              ['60 miles', '2 hr', '1 hr 30 min', '1 hr 12 min', '1 hr'],
              ['100 miles', '3 hr 20 min', '2 hr 30 min', '2 hr', '1 hr 40 min'],
              ['120 miles', '4 hr', '3 hr', '2 hr 24 min', '2 hr'],
              ['150 miles', '5 hr', '3 hr 45 min', '3 hr', '2 hr 30 min'],
              ['180 miles', '6 hr', '4 hr 30 min', '3 hr 36 min', '3 hr'],
              ['240 miles', '8 hr', '6 hr', '4 hr 48 min', '4 hr'],
              ['300 miles', '10 hr', '7 hr 30 min', '6 hr', '5 hr'],
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
        id="when"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        When Is It Necessary to Determine Travel Time?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Commuting, road trips, business travel, delivery planning, scheduling,
        fleet estimates, and trip budgeting all use distance–speed–time
        estimates.
      </p>

      <h2
        id="differ"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Why Actual Travel Time May Differ
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Congestion, road conditions, limits, weather, breaks, detours, and the
        gap between average and instantaneous speed all change real arrival
        times.
      </p>

      <h2
        id="tips"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Tips for Estimating Travel Time Accurately
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Use a realistic average speed, not the peak legal limit alone.</li>
        <li>Add planned breaks with the optional breaks section.</li>
        <li>Compare two speeds to see time saved before choosing a pace.</li>
        <li>Leave buffer for traffic when arrival is time-critical.</li>
      </ul>

      <h2
        id="arrival"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Travel Time vs. Arrival Time
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Travel time is duration. Arrival time is clock time = departure +
        duration (plus timezone/DST effects on the calendar). This converter
        focuses on duration.
      </p>

      <h2
        id="dst"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Distance, Speed, and Time Relationship
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The three equations are rearrangements of one relationship: Distance =
        Speed × Time. Knowing any two determines the third when units are
        consistent.
      </p>

      <h2
        id="related"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related Calculators
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <Link href="/tools/drive-time-calculator">Drive Time Calculator</Link>
        </li>
        <li>
          <Link href="/tools/miles-per-year-calculator">
            Miles per Year Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/engine-hours-to-miles-converter">
            Engine Hours to Miles Converter
          </Link>
        </li>
        <li>
          <Link href="/tools/miles-to-dollars-calculator">
            Miles to Dollars Calculator
          </Link>
        </li>
      </ul>

      <h2
        id="mth-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion faqs={[...MTH_FAQS]} />
      </div>
    </article>
  );
}
