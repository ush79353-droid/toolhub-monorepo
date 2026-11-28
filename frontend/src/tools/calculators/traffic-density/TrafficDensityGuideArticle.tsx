import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { TD_FAQS } from './content';

export function TrafficDensityGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Traffic Density Calculator – Traffic Flow, Density & Average Speed
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Estimate traffic flow, density, macroscopic stream speed, headway, and
        average spacing from observation counts or by solving q = k × v
        directly. Keep flow and density on the same road scope.
      </p>

      <h2 id="flow" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        What Is Traffic Flow?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Traffic flow q is the number of vehicles passing a fixed point during a
        time interval: q = N / t. Example: 120 vehicles in 5 minutes → 1,440
        vehicles/hour.
      </p>

      <h2 id="flow-formula" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Traffic Flow Formula
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        q = N / t
      </p>

      <h2 id="density" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        What Is Traffic Density?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Density k counts vehicles occupying a road length at an instant.
      </p>

      <h2 id="density-formula" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Traffic Density Formula
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        k = N / L
      </p>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Example: 20 vehicles on 2 km → 10 vehicles/km.
      </p>

      <h2 id="speed" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Calculate Average Travel Speed
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        q = k × v → v = q / k
      </p>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This macroscopic speed is related to space-mean speed under consistent
        observation conditions — not necessarily the arithmetic mean of spot
        speeds.
      </p>

      <h2 id="flow-vs-density" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Traffic Flow vs. Traffic Density
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Flow is a rate past a point; density is occupancy along a length. Both
        are needed for stream speed via q = k × v.
      </p>

      <h2 id="headway" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        What Is Traffic Headway?
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        h = 3600 / q (seconds when q is veh/h)
      </p>

      <h2 id="spacing" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        What Is Vehicle Spacing?
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        s = 1000 / k (meters when k is veh/km)
      </p>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Spacing includes average vehicle length plus gaps — not only clear
        bumper-to-bumper distance.
      </p>

      <h2 id="fundamental" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Fundamental Traffic Flow Relationship
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Flow, density, and speed interact through q = k × v. Congested regimes
        can show high density with low speed and reduced throughput.
      </p>

      <h2 id="how-use" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Use the Traffic Density Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Choose observation mode or a direct solve mode.</li>
        <li>Enter counts, time, and length — or two known stream parameters.</li>
        <li>Read flow, density, speed, headway, and spacing.</li>
      </ol>

      <h2 id="example" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Traffic Density Calculation Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        100 vehicles in 10 minutes → 600 veh/h. 20 vehicles on 2 km → 10 veh/km.
        Speed 60 km/h, headway 6 s, spacing 100 m.
      </p>

      <h2 id="congestion" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How Traffic Congestion Affects Flow and Density
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Density can rise while flow falls once queues form. Do not assume flow
        always increases with density.
      </p>

      <h2 id="capacity" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Traffic Density and Road Capacity
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Capacity is a maximum sustainable flow under defined conditions;
        observed q and k describe operating state, not capacity by themselves.
      </p>

      <h2 id="applications" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Traffic Engineering Applications
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Highway planning and operations</li>
        <li>Signal and corridor studies</li>
        <li>Congestion monitoring</li>
        <li>Transportation research and education</li>
      </ul>

      <h2 id="limits" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Limitations of Traffic Density Calculations
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The identities assume consistent aggregation. Real traffic includes
        vehicle mix, lane changes, bottlenecks, intersections, and
        space–time variation.
      </p>

      <h2 id="related" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Related Calculators
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <Link href="/tools/speed-calculator">Speed Calculator</Link>
        </li>
        <li>
          <Link href="/tools/drive-time-calculator">Drive Time Calculator</Link>
        </li>
        <li>
          <Link href="/tools/carpooling-calculator">Carpooling Calculator</Link>
        </li>
        <li>
          <Link href="/tools/fuel-cost-calculator">Fuel Cost Calculator</Link>
        </li>
        <li>
          <Link href="/tools/miles-to-hours-converter">
            Miles to Hours Converter
          </Link>
        </li>
      </ul>

      <h2 id="td-faq" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion faqs={[...TD_FAQS]} />
      </div>
    </article>
  );
}
