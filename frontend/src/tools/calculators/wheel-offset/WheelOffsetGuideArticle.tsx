import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { WO_FAQS } from './content';

export function WheelOffsetGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Wheel Offset Calculator – Compare Wheel Fitment and Clearance
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Compare your current and replacement wheels by width and offset (ET).
        See how the nominal inner and outer rim edges move relative to the
        hub-mounting plane. Results estimate rim geometry only — not a guarantee
        that a tire and wheel package will clear your vehicle.
      </p>

      <h2 id="what-offset" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        What Is Wheel Offset?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Wheel offset is the distance between the hub-mounting surface and the
        wheel centerline. It controls how far the rim sits inboard or outboard
        for a given width.
      </p>

      <h2 id="what-means" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        What Does Wheel Offset Mean?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Positive, zero, and negative values describe where the mounting pad sits
        relative to the centerline. Stamped ET values are usually millimeters.
      </p>

      <h2 id="positive" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Positive Wheel Offset
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        With positive offset, the mounting surface is toward the outer face. For
        a fixed width, higher positive ET generally tucks the wheel farther
        inward.
      </p>

      <h2 id="negative" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Negative Wheel Offset
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Negative offset places the mounting surface toward the inner face and
        typically pushes the wheel farther outward compared with a higher ET at
        the same width.
      </p>

      <h2 id="zero" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Zero Wheel Offset
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Zero offset aligns the hub-mounting surface with the wheel centerline.
      </p>

      <h2 id="width-vs-offset" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Wheel Width vs. Wheel Offset
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Width sets how far edges sit from the centerline; offset shifts that
        whole package relative to the hub. Always evaluate both together.
      </p>

      <h2 id="how-calc" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Calculate Wheel Offset Changes
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Convert widths and offsets to millimeters, compute inner and outer
        extents for each wheel, then subtract to find clearance and position
        changes.
      </p>

      <h2 id="formula" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Wheel Offset Formula
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        I = W/2 + ET &nbsp;·&nbsp; O = W/2 − ET
      </p>

      <h2 id="clearance" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Wheel Clearance Calculation
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        C = I_current − I_new
      </p>
      <p className="mt-2 text-sm text-foreground/90">
        Positive C: more inner rim-edge clearance. Negative C: less.
      </p>

      <h2 id="position" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Wheel Position Calculation
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        P = O_new − O_current
      </p>
      <p className="mt-2 text-sm text-foreground/90">
        Positive P: farther outward toward the fender. Negative P: farther
        inward.
      </p>

      <h2 id="inner-outer" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Inner Clearance vs. Outer Clearance
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Inner concerns suspension and brake packaging; outer concerns fenders
        and liners. Rim-edge deltas are not the same as tire sidewall clearance.
      </p>

      <h2 id="how-use" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Use the Wheel Offset Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter current wheel width and offset (any supported unit).</li>
        <li>Enter new wheel width and offset.</li>
        <li>Read clearance change, position change, and differences.</li>
        <li>Use the diagram to visualize rim edges vs the hub plane.</li>
        <li>Verify real fitment with tires, brakes, and the vehicle.</li>
      </ol>

      <h2 id="example" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Wheel Offset Calculation Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Current 7.5 in / ET45 → new 8.5 in / ET35: clearance change −2.7 mm
        (less inner clearance), position change +22.7 mm (farther outward),
        width +25.4 mm, offset −10 mm.
      </p>

      <h2 id="backspacing" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        What Is Wheel Backspacing?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Backspacing measures from the mounting pad to the inboard rim flange. It
        depends on overall rim width and offset, not advertised bead-seat width
        alone.
      </p>

      <h2 id="offset-vs-back" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Wheel Offset vs. Backspacing
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Offset uses the centerline; backspacing uses the inner flange. Convert
        carefully using overall width when comparing catalogs.
      </p>

      <h2 id="tire-fitment" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Does Wheel Offset Affect Tire Fitment?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Yes indirectly — offset places the rim, while tire section, profile, and
        brand determine contact with body and suspension.
      </p>

      <h2 id="suspension" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Wheel Offset and Suspension Clearance
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        More inward rim extent reduces space toward control arms, struts, and
        related hardware. Check at full lock and compression.
      </p>

      <h2 id="fender" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Wheel Offset and Fender Clearance
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Greater outward extent increases poke toward fenders and liners,
        especially with wide tires or lowered ride height.
      </p>

      <h2 id="handling" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Does Wheel Offset Affect Handling?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Changes in track width and scrub radius can alter steering feel and
        bearing loads. Treat those as possible effects, not automatic
        improvements.
      </p>

      <h2 id="rubbing" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Can Wheel Offset Cause Rubbing?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Yes — fenders, liners, suspension, brakes, or the well can contact tires
        or lips even when rim-edge math looks modest.
      </p>

      <h2 id="measure" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Measure Wheel Offset
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Locate the hub pad and the wheel centerline (half of overall width), then
        measure the distance between them. Confirm units and overall vs bead-seat
        width.
      </p>

      <h2 id="choose" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Choose the Correct Wheel Offset
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Prefer OEM or trusted fitment data for your vehicle, tire size, and
        suspension setup. Measure clearances and respect manufacturer limits.
      </p>

      <h2 id="limits" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Wheel Offset Calculator Limitations
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This tool estimates nominal rim-edge movement only. Actual fitment
        depends on tire section and profile, brand, wheel lips, brake calipers,
        suspension geometry, fender shape, ride height, steering angle,
        compression, and tolerances. A positive clearance change does not mean
        the wheel is safe to fit.
      </p>

      <h2 id="related" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Related Calculators
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-foreground/90">
        <li>
          <Link href="/tools/tire-size-calculator">Tire Size Calculator</Link>
        </li>
        <li>
          <Link href="/tools/wheel-horsepower-calculator">
            Wheel Horsepower Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/speedometer-gear-calculator">
            Speedometer Gear Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/speed-calculator">Speed Calculator</Link>
        </li>
        <li>
          <Link href="/tools/rpm-calculator">RPM Calculator</Link>
        </li>
      </ul>

      <h2 id="wo-faq" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion faqs={[...WO_FAQS]} />
      </div>
    </article>
  );
}
