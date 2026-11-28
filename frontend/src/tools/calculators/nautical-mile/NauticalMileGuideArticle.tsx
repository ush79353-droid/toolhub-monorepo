import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { NM_FAQS } from './content';

export function NauticalMileGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Nautical Mile Calculator – Convert Nautical Miles, Knots and Travel
        Distance
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Convert nautical miles to kilometers and statute miles, and calculate
        distance, speed, or time using knots and other units.
      </p>

      <h2
        id="what-is"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is a Nautical Mile?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        An international unit of distance for marine and aviation navigation.
        One international nautical mile is exactly 1,852 meters.
      </p>

      <h2
        id="why"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Why Are Nautical Miles Used?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        They relate historically to angular latitude: about one minute of
        latitude ≈ one nautical mile. That link makes chart-based navigation
        convenient. The modern definition is the fixed 1,852 m length.
      </p>

      <h2
        id="vs-statute"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Nautical Mile vs. Statute Mile
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A statute (land) mile is 1,609.344 m. A nautical mile is longer at 1,852
        m — about 1.1508 statute miles.
      </p>

      <h2
        id="to-km"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Nautical Miles to Kilometers
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        km = nmi × 1.852
      </p>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Example: 10 nmi × 1.852 = 18.52 km.
      </p>

      <h2
        id="to-mi"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Nautical Miles to Miles
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        mi = nmi × (1852 / 1609.344) ≈ nmi × 1.150779. Example: 10 nmi ≈ 11.5078
        mi.
      </p>

      <h2
        id="from-km"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Kilometers to Nautical Miles
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        nmi = km ÷ 1.852
      </p>

      <h2
        id="from-mi"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Miles to Nautical Miles
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        nmi ≈ mi × 0.868976. Example: 100 mi ≈ 86.898 nmi.
      </p>

      <h2
        id="knot"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is a Knot?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A knot is one nautical mile per hour — the standard speed unit at sea and
        in the air.
      </p>

      <h2
        id="kn-mph"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Knots vs. Miles per Hour
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        mph uses statute miles; knots use nautical miles. 1 kn ≈ 1.1508 mph.
      </p>

      <h2
        id="kn-kmh"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Knots to km/h
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        km/h = kn × 1.852
      </p>

      <h2
        id="kn-mph-conv"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Knots to mph
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        mph ≈ kn × 1.150779. Example: 20 kn ≈ 23.02 mph.
      </p>

      <h2
        id="distance"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Distance Using Speed and Time
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        Distance = Speed × Time
      </p>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Example: 15 kn × 4 h = 60 nmi.
      </p>

      <h2
        id="travel-time"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Nautical Travel Time
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        Time = Distance ÷ Speed
      </p>

      <h2
        id="speed-calc"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Speed in Knots
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        Speed = Distance ÷ Time
      </p>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Example: 120 nmi ÷ 6 h = 20 kn.
      </p>

      <h2
        id="marine"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Nautical Miles in Marine Navigation
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Charts, voyage planning, and vessel speed logs commonly use nmi and
        knots for consistency with latitude-based measures.
      </p>

      <h2
        id="aviation"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Nautical Miles in Aviation
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Flight plans, ATC clearances, and aircraft performance data often use
        nautical miles and knots.
      </p>

      <h2
        id="great-circle"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Great-Circle Distance
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The shortest path on a sphere between two points. This calculator’s
        coordinate tool uses a spherical haversine estimate for education — not
        certified navigation.
      </p>

      <h2
        id="table"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Nautical Mile Conversion Table
      </h2>
      <div className="mt-3 overflow-x-auto not-prose">
        <table className="w-full min-w-[24rem] border-collapse text-left text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="px-2 py-2 font-semibold text-accent">nmi</th>
              <th className="px-2 py-2 font-semibold text-accent">mi (approx.)</th>
              <th className="px-2 py-2 font-semibold text-accent">km</th>
            </tr>
          </thead>
          <tbody className="text-foreground/90">
            {[
              ['1', '1.1508', '1.852'],
              ['2', '2.3016', '3.704'],
              ['5', '5.7539', '9.260'],
              ['10', '11.5078', '18.520'],
              ['20', '23.0156', '37.040'],
              ['50', '57.5390', '92.600'],
              ['100', '115.0779', '185.200'],
              ['200', '230.1559', '370.400'],
              ['500', '575.3897', '926.000'],
              ['1,000', '1,150.7794', '1,852.000'],
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
        Limitations and Disclaimer
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This tool provides unit conversions and basic constant-speed travel
        estimates. It is not navigational advice and does not replace certified
        marine or aviation planning systems.
      </p>

      <h2
        id="related"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related Calculators
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <Link href="/tools/miles-to-hours-converter">
            Miles to Hours Converter
          </Link>
        </li>
        <li>
          <Link href="/tools/boat-speed-calculator">Boat Speed Calculator</Link>
        </li>
        <li>
          <Link href="/tools/crosswind-calculator">Crosswind Calculator</Link>
        </li>
        <li>
          <Link href="/tools/drive-time-calculator">Drive Time Calculator</Link>
        </li>
      </ul>

      <h2
        id="nm-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion faqs={[...NM_FAQS]} />
      </div>
    </article>
  );
}
