import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { PPM_FAQS } from './content';

export function PulsePerMileGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Pulse per Mile Calculator – Vehicle Speed Sensor PPM Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Estimate wheel rotations per mile and vehicle speed sensor pulses per
        mile from axle ratio, reluctor tooth count, and tire diameter. Useful
        for understanding theoretical VSS scaling—not a substitute for
        manufacturer calibration procedures.
      </p>

      <h2
        id="what-ppm"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is Pulse per Mile (PPM)?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Pulses per mile counts how many sensor pulses occur while the vehicle
        travels one statute mile. Modules and speedometers often treat PPM as a
        calibration constant relating pulse rate to road speed.
      </p>

      <h2
        id="vss"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Pulse per Mile and Vehicle Speed Sensors
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A reluctor (tone) wheel turns with a shaft or hub. Each tooth passing
        the sensor can produce a pulse. Over one mile of travel, the total pulse
        count depends on how many times the wheels rotate, how the sensed shaft
        gears to those wheels, and how many teeth (or edges) are counted.
      </p>

      <h2
        id="what-vss"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is a Vehicle Speed Sensor (VSS)?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A VSS converts rotational motion into an electrical pulse train. Powertrain
        and chassis controllers use that signal for indicated speed, cruise
        control, transmission shift strategies, and related functions.
      </p>

      <h2
        id="location"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Where Is a Vehicle Speed Sensor Located?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Locations vary by platform: transmission or transfer-case output,
        differential, ABS wheel hub, or other drivetrain points. Sensor placement
        changes whether axle ratio belongs in a simple PPM estimate.
      </p>

      <h2
        id="axle"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is an Axle Ratio?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Axle (final drive) ratio is driveshaft or pinion revolutions per one
        wheel revolution. A 3.42 axle means about 3.42 shaft turns for each tire
        turn—raising shaft-mounted pulse rates relative to the road.
      </p>

      <h2
        id="reluctor"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is a Reluctor Wheel?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A toothed ring that modulates the sensor’s magnetic field. Tooth count
        and whether the electronics count one or both edges determine pulses per
        revolution of that shaft.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        The Pulse per Mile Formula
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        WRM = 63,360 / (π × TD)
      </p>
      <p className="mt-2 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        PPM = WRM × AR × NT = (63,360 × AR × NT) / (π × TD)
      </p>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        TD is tire diameter in inches, AR axle ratio, NT tooth count. 63,360 is
        the number of inches in one statute mile.
      </p>

      <h2
        id="wrm-how"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Wheel Rotations per Mile
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        For a 26-inch tire: WRM = 63,360 / (π × 26) ≈ 775.7 revolutions per mile.
        This assumes the tire advances one circumference (πD) per revolution.
      </p>

      <h2
        id="ppm-how"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Pulses per Mile
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Multiply WRM by axle ratio and tooth count without rounding the
        intermediate WRM. Example: 775.7 × 3.42 × 20 ≈ 53,058 pulses per mile.
      </p>

      <h2
        id="tire-effect"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Tire Diameter Affects PPM
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Larger tires cover more ground per revolution, so WRM and PPM fall.
        Smaller tires raise both. Always convert diameter to inches before using
        the formulas.
      </p>

      <h2
        id="axle-effect"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Axle Ratio Affects PPM
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        For a sensor on a shaft geared by the axle ratio, a numerically higher
        ratio increases shaft revolutions per wheel revolution and therefore
        expected PPM.
      </p>

      <h2
        id="teeth-effect"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Reluctor Tooth Count Affects PPM
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        More teeth (or counting both edges) means more pulses per shaft
        revolution. PPM scales with the effective pulses-per-revolution used by
        the electronics.
      </p>

      <h2
        id="example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Pulse per Mile Calculator Example
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Axle ratio 3.42, 20 teeth, 26 in diameter.</li>
        <li>WRM = 63,360 / (π × 26) ≈ 775.7 rev/mi.</li>
        <li>PPM = 775.7 × 3.42 × 20 ≈ 53,058 pulses/mi.</li>
      </ol>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use the Pulse per Mile Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter axle ratio (decimal allowed).</li>
        <li>Enter a positive whole-number tooth count.</li>
        <li>Enter tire diameter and choose in, cm, mm, or ft.</li>
        <li>Read WRM and PPM; optionally open circumference or frequency tools.</li>
      </ol>

      <h2
        id="rolling"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Tire Diameter vs. Rolling Circumference
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Nominal overall diameter times π is a geometric estimate. Loaded rolling
        circumference depends on inflation, load, construction, and wear, so
        measured revolutions per mile can differ from theory.
      </p>

      <h2
        id="calibration"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Vehicle Speed Sensor Calibration
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Controllers store tire size, axle, or pulses-per-mile parameters so
        indicated speed matches road speed. After tire or gearing changes,
        follow OEM relearn or programming guidance—this page only estimates the
        geometric relationship.
      </p>

      <h2
        id="causes"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Common Causes of Incorrect PPM Readings
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Wrong tire diameter or rolling circumference assumption</li>
        <li>Incorrect axle ratio or tooth count</li>
        <li>Sensor mounted where axle ratio does not apply</li>
        <li>Edge counting or electronic scaling different from one pulse per tooth</li>
        <li>Wiring, interference, or outdated calibration settings</li>
      </ul>

      <h2
        id="limits"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations of the Pulse per Mile Formula
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The calculator assumes a shaft-mounted reluctor turning at axle-ratio ×
        wheel speed with one counted pulse per tooth, and a circular tire of the
        entered diameter. It is not navigational guidance and does not replace
        certified diagnostic or calibration tools.
      </p>

      <h2
        id="related"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related Calculators
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
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
        <li>
          <Link href="/tools/miles-per-year-calculator" className="text-primary underline-offset-2 hover:underline">
            Miles per Year Calculator
          </Link>
        </li>
      </ul>

      <h2
        id="ppm-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion faqs={[...PPM_FAQS]} />
      </div>
    </article>
  );
}
