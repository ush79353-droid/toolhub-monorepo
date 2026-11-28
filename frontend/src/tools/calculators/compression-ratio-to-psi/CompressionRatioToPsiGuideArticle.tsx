import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { CR_PSI_FAQS } from './content';

const CHART_ROWS = [
  6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
] as const;

function fmt(n: number): string {
  return n.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function CompressionRatioToPsiGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Compression Ratio to PSI Calculator – Estimate Engine Compression
        Pressure
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Estimate theoretical compression pressure from engine compression ratio
        and atmospheric pressure. Compare a simplified linear model with an
        optional polytropic model, separate absolute (PSIA) from gauge (PSIG)
        results, and reverse-solve for a model-implied volume ratio. Outputs are
        educational estimates — not compression-tester predictions or engine
        diagnoses.
      </p>

      <h2
        id="what-is-cr"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is Compression Ratio?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Compression ratio compares maximum cylinder volume (typically at bottom
        dead center) to minimum volume (at top dead center). A 10:1 ratio means
        the trapped charge is squeezed into one-tenth of its initial volume
        under idealized geometric assumptions.
      </p>

      <h2
        id="what-is-psi"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is PSI?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        PSI — pounds per square inch — measures pressure. Related SI units
        include kPa, bar, MPa, Pa, and atm. This calculator converts among them
        while keeping an internal absolute-pressure basis.
      </p>

      <h2
        id="what-is-pressure"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is Compression Pressure?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Compression pressure is the pressure of the cylinder charge near the end
        of the compression stroke. In workshops, “compression” often means the
        peak cranking pressure on a gauge — which is usually a gauge reading,
        not absolute pressure.
      </p>

      <h2
        id="cr-vs-pressure"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Compression Ratio vs. Compression Pressure
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Compression ratio is dimensionless (volumes). Compression pressure has
        units (psi, bar, kPa, …). Knowing CR alone does not uniquely fix a
        measured PSI without assumptions about atmosphere, heat transfer,
        sealing, and valve timing.
      </p>

      <h2
        id="how-to-convert"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Convert Compression Ratio to PSI
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter ratio as X:Y (for example 10 and 1).</li>
        <li>Set atmospheric absolute pressure (default 14.7 psi).</li>
        <li>Choose simplified or polytropic model.</li>
        <li>
          Read absolute and gauge estimates — labeled clearly as educational.
        </li>
      </ol>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Compression Ratio to PSI Formula
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        Simplified pressure estimate: P_abs = r × P_atm
      </p>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This linear relationship is a convenient approximation used for teaching
        and quick estimates. It is not a complete thermodynamic model of
        cylinder compression and should not be presented as an accurate
        prediction of a compression-tester reading.
      </p>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        Gauge: P_gauge = P_abs − P_atm
      </p>

      <h2
        id="how-to-calculate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Compression Pressure
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Example (simplified): CR = 10:1, P_atm = 14.7 psia → P_abs = 10 × 14.7 =
        147 psia → P_gauge = 147 − 14.7 = 132.3 psig.
      </p>

      <h2
        id="atmospheric"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is Atmospheric Pressure?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Atmospheric pressure is the absolute ambient pressure surrounding the
        engine. Standard sea-level atmosphere is often approximated as 14.7 psi
        (≈101.325 kPa). Altitude and weather change the local value and therefore
        scale any estimate that multiplies by P_atm.
      </p>

      <h2
        id="psia-psig"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Absolute PSI vs. Gauge PSI
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <strong>PSIA</strong> includes atmospheric pressure.{' '}
        <strong>PSIG</strong> is relative to ambient. A mechanical compression
        tester normally displays gauge pressure. Never label an absolute
        estimate as if it were a gauge reading.
      </p>

      <h2
        id="chart"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Compression Ratio to PSI Conversion Chart
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Simplified theoretical estimates at 14.7 psia atmosphere (not measured
        compression-test targets):
      </p>
      <div className="mt-3 overflow-x-auto rounded-lg border border-border">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-muted/40 text-muted-foreground">
            <tr>
              <th className="px-3 py-2 font-medium">CR</th>
              <th className="px-3 py-2 font-medium">Abs (psia)</th>
              <th className="px-3 py-2 font-medium">Gauge (psig)</th>
            </tr>
          </thead>
          <tbody>
            {CHART_ROWS.map((r) => {
              const abs = r * 14.7;
              return (
                <tr key={r} className="border-t border-border">
                  <td className="px-3 py-2 tabular-nums">{r}:1</td>
                  <td className="px-3 py-2 tabular-nums">{fmt(abs)}</td>
                  <td className="px-3 py-2 tabular-nums">
                    {fmt(abs - 14.7)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <h2
        id="dynamic-cr"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is Dynamic Compression Ratio?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Dynamic compression ratio estimates effective compression after the
        intake valve closes. Late closing shortens the trapped stroke relative
        to geometric BDC-to-TDC CR and often reduces cranking PSI versus a
        naive r × P_atm model.
      </p>

      <h2
        id="polytropic"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is a Polytropic Compression Model?
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        P₂ = P₁ × rⁿ
      </p>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        With P₁ = atmospheric absolute pressure and r = volume ratio, choosing
        an exponent n (often near 1.3 for educational demos) yields a higher
        absolute pressure than the linear simplified model. It remains an
        idealized estimate.
      </p>

      <h2
        id="why-different"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Why Is Actual Engine Compression PSI Different?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Real cranking tests reflect intake-valve timing, effective CR, cranking
        speed, ring and valve sealing, cylinder temperature, camshaft profile,
        throttle position, intake restrictions, tester design, and ambient
        pressure. Neither simplified nor polytropic models diagnose engine
        condition by themselves.
      </p>

      <h2
        id="test-factors"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Affects a Compression Test?
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Battery / starter cranking RPM</li>
        <li>Throttle open vs closed procedure</li>
        <li>Warm vs cold engine</li>
        <li>Ring and valve sealing</li>
        <li>Cam timing and IVC</li>
        <li>Altitude and weather (P_atm)</li>
        <li>Tester volume and calibration</li>
      </ul>

      <h2
        id="petrol-diesel"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Petrol vs. Diesel Engine Compression
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Spark-ignition petrol engines typically use lower geometric ratios than
        compression-ignition diesels. Comparing absolute “good PSI” numbers
        across engine families without service data is misleading — follow
        manufacturer procedures.
      </p>

      <h2
        id="altitude"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Does Altitude Affect Compression PSI?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Lower ambient absolute pressure reduces both absolute and gauge
        estimates that scale with P_atm. A 10:1 simplified estimate at 13.5 psi
        atmosphere is 135 psia / 121.5 psig instead of 147 / 132.3 at 14.7 psi.
      </p>

      <h2
        id="diagnose"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Can Compression PSI Diagnose Engine Problems?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Relative cylinder balance and OEM test procedures can help screen for
        sealing issues. A single theoretical PSI from CR is not a diagnosis.
        Leak-down testing often complements compression testing.
      </p>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Why Compression Ratio Cannot Be Converted Directly to Exact PSI
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Geometric CR describes volumes. Measured PSI describes a transient gas
        process with leakage, heat transfer, and incomplete trapping. Use this
        calculator to understand idealized relationships — not to invent
        universal compression-test specifications for every engine.
      </p>

      <h2
        id="related"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related Calculators
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
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
            href="/tools/boost-horsepower-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Boost Horsepower Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/bsfc-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            BSFC Calculator
          </Link>
        </li>
      </ul>

      <h2
        id="cr-psi-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion faqs={[...CR_PSI_FAQS]} />
      </div>
    </article>
  );
}
