import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { HP_FAQS } from './content';

export function HorsepowerGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Horsepower Calculator – Estimate Vehicle HP from Quarter-Mile
        Performance
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Estimate mechanical horsepower from vehicle weight and either
        quarter-mile elapsed time or trap speed. Convert to metric horsepower,
        watts, and kilowatts. Results are empirical performance estimates — not
        dynamometer certifications.
      </p>

      <h2
        id="what-is-hp"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is Horsepower?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Horsepower quantifies power — work per unit time. In vehicles it
        summarizes how quickly an engine or motor can deliver energy to
        accelerate the car.
      </p>

      <h2
        id="mechanical"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is Mechanical Horsepower?
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        1 hp = 745.699871582 W
      </p>

      <h2
        id="metric"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is Metric Horsepower?
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        1 PS = 735.49875 W
      </p>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Do not treat hp and PS as identical. PS = (HP × 745.699871582) /
        735.49875.
      </p>

      <h2
        id="how-works"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Does a Horsepower Calculator Work?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This tool applies two common quarter-mile rules of thumb. Choose
        elapsed-time or trap-speed mode, enter weight, and read an estimated
        mechanical horsepower with unit conversions.
      </p>

      <h2
        id="et-method"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Horsepower from Quarter-Mile Time
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        HP = W / (ET / 5.825)³
      </p>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Example: 3,500 lb and 13.5 s → about 281.2 hp.
      </p>

      <h2
        id="trap-method"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Horsepower from Trap Speed
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        HP = W × (V / 234)³
      </p>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Example: 3,500 lb and 105 mph → about 316.5 hp.
      </p>

      <h2
        id="formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Horsepower Formulas Explained
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>W — vehicle weight in pounds</li>
        <li>ET — quarter-mile elapsed time in seconds</li>
        <li>V — trap speed in mph</li>
        <li>5.825 and 234 — empirical constants, not physical laws</li>
      </ul>

      <h2
        id="to-watts"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Horsepower to Watts Conversion
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        W = HP × 745.699871582
      </p>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        100 hp → about 74,569.99 W.
      </p>

      <h2
        id="to-kw"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Horsepower to Kilowatts Conversion
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        kW = HP × 0.745699871582
      </p>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        150 hp → about 111.85 kW.
      </p>

      <h2
        id="torque"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Horsepower vs. Torque
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        HP = (Torque_lb-ft × RPM) / 5252
      </p>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This relationship uses pound-feet of torque and mechanical horsepower.
        It is separate from the quarter-mile estimators above.
      </p>

      <h2
        id="wheel-hp"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Engine Horsepower vs. Wheel Horsepower
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Drivetrain friction and accessories reduce power at the wheels versus
        crank figures. Quarter-mile estimates roughly reflect whole-vehicle
        performance, not a clean crank dyno.
      </p>

      <h2
        id="bhp"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Brake Horsepower vs. Horsepower
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Brake horsepower historically refers to power measured with a
        brake/dynamometer. Marketing language often blurs hp and bhp — check
        the measurement standard when comparing specs.
      </p>

      <h2
        id="weight"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Vehicle Weight Affects Quarter-Mile Performance
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Both formulas scale estimated HP with weight. Understating race weight
        understates estimated power for the same ET or trap speed.
      </p>

      <h2
        id="why-trap"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Why Trap Speed Is Useful
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Trap speed reflects how hard the car is still accelerating at the
        stripe and is often less sensitive to a soft launch than ET.
      </p>

      <h2
        id="why-differ"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Why Elapsed Time and Trap Speed Give Different Results
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        They use different observables and constants. A great trap with a slow
        60-foot can look “underpowered” on ET and “stronger” on trap — both can
        be consistent with the math.
      </p>

      <h2
        id="factors"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Factors Affecting Horsepower Estimates
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Traction and launch technique</li>
        <li>Vehicle weight and ballast</li>
        <li>Aerodynamic drag</li>
        <li>Transmission gearing and shift losses</li>
        <li>Drivetrain losses</li>
        <li>Weather, altitude, and road surface</li>
      </ul>

      <h2
        id="examples"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Horsepower Calculator Examples
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>3,500 lb · 13.5 s ET → ≈ 281.2 hp</li>
        <li>3,500 lb · 105 mph trap → ≈ 316.2 hp</li>
      </ul>

      <h2
        id="accuracy"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Accurate Is a Quarter-Mile Horsepower Calculator?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Approximate and condition-dependent. Useful for ballpark comparisons —
        not a substitute for controlled dynamometer testing.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use the Horsepower Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Choose elapsed time or trap speed.</li>
        <li>Enter vehicle weight and unit.</li>
        <li>Enter ET (seconds) or trap speed with unit.</li>
        <li>Optionally change output among hp, PS, W, kW.</li>
        <li>Read the estimate and formula breakdown.</li>
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
        <li>
          <Link
            href="/tools/compression-ratio-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Compression Ratio Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/compression-ratio-to-psi-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Compression Ratio to PSI Calculator
          </Link>
        </li>
      </ul>

      <h2
        id="hp-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion faqs={[...HP_FAQS]} />
      </div>
    </article>
  );
}
