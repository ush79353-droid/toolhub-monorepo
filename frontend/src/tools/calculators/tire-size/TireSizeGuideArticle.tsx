import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { TS_FAQS } from './content';

export function TireSizeGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Tire Size Calculator – Tire Dimensions & Comparison
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Decode sidewall markings, compute theoretical unloaded tire dimensions,
        and optionally compare a replacement size for diameter, clearance, and
        speedometer estimates.
      </p>

      <h2 id="how-sizes" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How Do Tire Sizes Work?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Metric passenger tire codes combine section width, aspect ratio,
        construction type, and rim diameter into one marking that describes the
        tire’s geometry on a matching rim.
      </p>

      <h2 id="numbers" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        What Do Tire Size Numbers Mean?
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Width — section width (usually mm).</li>
        <li>Aspect ratio — sidewall height as % of width.</li>
        <li>Construction — R, B, or D in this tool.</li>
        <li>Rim diameter — typically inches in the code.</li>
        <li>Load index / speed rating — optional markings (not capacity claims here).</li>
      </ul>

      <h2 id="read-size" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Read a Tire Size
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Example <span className="font-mono">225/65 R17</span>: 225 mm wide, 65%
        profile, radial, 17-inch rim.
      </p>

      <h2 id="how-calc" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Calculate Tire Size
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Convert width to millimeters if needed.</li>
        <li>Compute sidewall height H = W × A / 100.</li>
        <li>Convert rim diameter to mm (× 25.4 from inches).</li>
        <li>Overall diameter D = R_mm + 2H; circumference C = πD.</li>
      </ol>

      <h2 id="sidewall" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Tire Sidewall Height Formula
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        H = W × A / 100
      </p>

      <h2 id="diameter" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Tire Diameter Formula
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        D = 25.4 × R_in + 2H
      </p>

      <h2 id="circ" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Tire Circumference Formula
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        C = π × D
      </p>

      <h2 id="how-use" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Use the Tire Size Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Enter width, profile ratio, construction, and rim diameter — or paste a
        code like 225/65R17. Open additional parameters for optional load index
        and speed rating letters. Enable comparison to evaluate a second size.
      </p>

      <h2 id="compare" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Compare Tire Sizes
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The tool computes both geometries independently, then diameter and
        sidewall deltas, theoretical clearance change (ΔD/2), and speedometer
        correction from the diameter ratio.
      </p>

      <h2 id="speedo" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How Tire Size Changes Affect Speedometer Readings
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        V_actual ≈ V_indicated × (D_new / D_original) when the instrument is
        calibrated to the original size. Larger tires usually mean faster actual
        speed than shown.
      </p>

      <h2 id="clearance" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Tire Size and Ground Clearance
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A simple estimate is half the overall-diameter change. It is not a
        guarantee of real-world clearance under load.
      </p>

      <h2 id="fuel" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Tire Size and Fuel Economy
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Diameter and width can influence effective gearing and rolling
        resistance. This calculator does not promise fuel savings.
      </p>

      <h2 id="handling" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Tire Size and Vehicle Handling
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Lower aspect ratios often feel firmer; wider tires change contact patch
        shape. Always stay within suspension and fender limits.
      </p>

      <h2 id="rim" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Tire Size and Rim Compatibility
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Matching rim diameter is required but not sufficient — rim width, offset,
        and tire width range also matter.
      </p>

      <h2 id="consider" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Changing Tire Size – What to Consider
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Wheel diameter and width</li>
        <li>Clearance and rubbing risk</li>
        <li>Speedometer / odometer accuracy</li>
        <li>Load and speed ratings</li>
        <li>Manufacturer specifications</li>
      </ul>

      <h2 id="example" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Tire Size Comparison Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Original 225/65 R17 ≈ 724.3 mm diameter. A 235/60 R18 replacement is
        typically slightly taller; use the compare mode for exact deltas and
        speed estimates at your indicated speed.
      </p>

      <h2 id="related" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Related Calculators
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <Link href="/tools/speed-calculator">Speed Calculator</Link>
        </li>
        <li>
          <Link href="/tools/speedometer-gear-calculator">
            Speedometer Gear Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/rpm-calculator">RPM Calculator</Link>
        </li>
        <li>
          <Link href="/tools/mpg-calculator">MPG Calculator</Link>
        </li>
        <li>
          <Link href="/tools/fuel-cost-calculator">Fuel Cost Calculator</Link>
        </li>
      </ul>

      <h2 id="ts-faq" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion faqs={[...TS_FAQS]} />
      </div>
    </article>
  );
}
