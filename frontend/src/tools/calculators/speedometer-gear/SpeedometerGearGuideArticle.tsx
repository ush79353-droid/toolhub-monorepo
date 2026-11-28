import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { SG_FAQS } from './content';

export function SpeedometerGearGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Speedometer Gear Calculator – Calculate Driven Gear Teeth
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Estimate the mechanical speedometer driven-gear tooth count from tire
        diameter (or measured revolutions per mile), axle ratio, and driving-gear
        teeth. Uses the practical R ≈ 20168/D relationship and cable calibration
        C (default 1000 rev/mi).
      </p>

      <h2 id="what-gear" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        What Is a Speedometer Gear?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        In a cable-driven speedometer, a small gearset scales transmission
        output so the cable turns at the rate the instrument expects for true
        road speed.
      </p>

      <h2 id="how-mech" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How Does a Mechanical Speedometer Work?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Wheel rotation, through the axle and transmission, turns a driving
        gear. The driven gear spins the cable; the speedometer head is built for
        a stated number of cable revolutions per mile.
      </p>

      <h2 id="drive-vs-driven" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Driving Gear vs Driven Gear
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The driving gear is turned by the transmission. The driven gear meshes
        with it and turns the cable. Changing driven teeth is a common way to
        retune indication after tire or axle changes.
      </p>

      <h2 id="rev-mi" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        What Is Tire Revolutions per Mile?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        How many times a tire rotates while covering one mile. It depends on
        effective rolling circumference, not just nominal diameter.
      </p>

      <h2 id="calc-rev" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Calculate Tire Revolutions per Mile
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        R ≈ 20168 / D (D in inches)
      </p>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Example: 30 in → 20168/30 ≈ 672.27 rev/mi. An ideal circle would use
        63360/(πD); measured OEM values may differ.
      </p>

      <h2 id="axle" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        What Is Axle Ratio?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Final-drive reduction between the driveshaft and wheels. Higher
        numerical ratios increase shaft revolutions per mile.
      </p>

      <h2 id="ratio-formula" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Speedometer Gear Ratio Formula
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        G = A × R / C
      </p>

      <h2 id="teeth-formula" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Driven Gear Tooth Count Formula
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        Td = A × R × Tg / C
      </p>

      <h2 id="how-calc" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Calculate Speedometer Gear Teeth
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Find R from diameter or a measured/OEM rev/mi value.</li>
        <li>Enter axle ratio A and driving teeth Tg.</li>
        <li>Use calibration C (often 1000).</li>
        <li>Compute Td and round to a whole tooth; verify the part exists.</li>
      </ol>

      <h2 id="example" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Example: Speedometer Gear Calculation
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        30 in, A=3.73, Tg=8, C=1000 → R≈672.27, G≈2.5076, Td≈20.06 → suggest 20
        teeth.
      </p>

      <h2 id="tire-size" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How Does Tire Size Affect Speedometer Accuracy?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Changing diameter changes revolutions per mile. Without a gear or
        electronic correction, indicated speed drifts from true speed.
      </p>

      <h2 id="axle-effect" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How Does Axle Ratio Affect Speedometer Readings?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Axle changes alter shaft revolutions per mile, so the same gearset no
        longer matches cable calibration.
      </p>

      <h2 id="why-matter" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Why Does Speedometer Gear Tooth Count Matter?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Correct teeth keep indicated speed and odometer distance aligned with
        the road for mechanical systems.
      </p>

      <h2 id="choose" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Choose the Correct Driven Gear
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Use the calculated tooth count, then confirm OEM charts, physical fit,
        and mesh with the driving gear. Availability beats pure math.
      </p>

      <h2 id="wrong-gear" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        What Happens If the Wrong Speedometer Gear Is Installed?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Speed and distance indications run high or low. Traffic enforcement and
        trip planning both suffer.
      </p>

      <h2 id="mech-vs-elec" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Mechanical vs Electronic Speedometers
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This calculator is for mechanical cable gearing with known C. Electronic
        speedometers typically need tire-size/axle programming or VSS
        recalibration instead.
      </p>

      <h2 id="limits" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Speedometer Gear Calculator Limitations
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        20168/D is approximate; rolling radius, pressure, and wear matter. C is
        not universal. Rounded teeth may be unavailable. Not a substitute for
        OEM fitment data.
      </p>

      <h2 id="how-to-use" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Use the Speedometer Gear Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter tire diameter or enable manual revolutions.</li>
        <li>Enter axle ratio and driving-gear teeth.</li>
        <li>Optionally set calibration C under Advanced.</li>
        <li>Read theoretical Td and the suggested whole-tooth gear.</li>
      </ol>

      <h2 id="related" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Related Calculators
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <Link href="/tools/speed-calculator" className="text-primary underline-offset-2 hover:underline">
            Speed Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/rpm-calculator" className="text-primary underline-offset-2 hover:underline">
            RPM Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/pulse-per-mile-calculator" className="text-primary underline-offset-2 hover:underline">
            Pulse per Mile Calculator
          </Link>
        </li>
      </ul>

      <h2 id="sg-faq" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion faqs={[...SG_FAQS]} />
      </div>
    </article>
  );
}
