import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { BOOST_HP_FAQS } from './content';

export function BoostHorsepowerGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Boost Horsepower Calculator – Supercharger Boost &amp; Engine Power
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Estimate ideal boosted engine horsepower from baseline power and added
        turbo or supercharger boost. Convert among common power and pressure
        units, solve for required boost or original horsepower, and review a
        clear formula breakdown. Outputs are educational estimates — not dyno
        guarantees.
      </p>

      <h2
        id="what-is"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is a Boost Horsepower Calculator?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        It applies an absolute-pressure-ratio model to scale naturally aspirated
        (or baseline) horsepower by how much intake pressure rises above ambient.
      </p>

      <h2
        id="supercharger"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Does a Supercharger Work?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A supercharger compresses intake air before it enters the cylinders,
        increasing charge density so more oxygen — and potentially more fuel —
        can support higher power when the engine is calibrated for it.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use the Boost Horsepower Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter current engine power and choose hp, PS, kW, or W.</li>
        <li>Enter boost added (default example 6 psi) and its unit.</li>
        <li>Optionally open Advanced Settings for atmosphere or efficiency η.</li>
        <li>Read ideal boosted power, gain, pressure ratio, and the chart.</li>
      </ol>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Boost Horsepower Formula
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        HP_boosted = HP_current × (P_boost + P_atm) / P_atm
      </p>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        With P_atm ≈ 14.7 psi this is HP × (1 + P_boost / 14.7). The model assumes
        roughly unchanged volumetric efficiency, charge temperature, and
        combustion/mechanical efficiency.
      </p>

      <h2
        id="how-to-calculate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Boosted Engine Horsepower
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Example: 200 hp and 6 psi → absolute pressure 20.7 psi → ratio 20.7/14.7 ≈
        1.408 → boosted ≈ 281.63 hp.
      </p>

      <h2
        id="boost-pressure"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is Boost Pressure?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Boost is gauge pressure above atmosphere in the intake. Absolute intake
        pressure equals boost plus atmospheric pressure.
      </p>

      <h2
        id="pressure-ratio"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is the Pressure Ratio?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Pressure ratio PR = (P_boost + P_atm) / P_atm. Ideal horsepower scales
        with PR in this simplified model.
      </p>

      <h2
        id="turbo-vs-super"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Supercharger vs. Turbocharger
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Superchargers are typically crank-driven; turbochargers harvest exhaust
        energy. Both can raise boost; response, efficiency, and packaging differ.
        The calculator estimates power from gauge boost regardless of drive type.
      </p>

      <h2
        id="six-psi"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Much Horsepower Does 6 PSI of Boost Add?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        On a 200 hp baseline at 14.7 psi atmosphere, the ideal gain is about 81.6
        hp (≈40.8%). Treat this as an upper-bound style estimate under ideal
        assumptions.
      </p>

      <h2
        id="ten-psi"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Much Horsepower Does 10 PSI of Boost Add?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Ideal multiplier ≈ 1 + 10/14.7 ≈ 1.680, so 200 hp → ≈336 hp before
        real-world losses.
      </p>

      <h2
        id="real-vs-ideal"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Why Real Engine Power Gains Differ from Estimates
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Intake temperature, intercooler and compressor efficiency, fuel quality,
        tuning, ignition timing, mechanical losses, airflow restrictions, and
        engine speed all move measured power away from the ideal ratio.
      </p>

      <h2
        id="too-much-boost"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Can Too Much Boost Damage an Engine?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Yes — without proper fueling, cooling, and mechanical strength, high boost
        can cause knock or failure. This tool does not recommend boost levels;
        follow manufacturer and professional tuner guidance.
      </p>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations of the Boost Horsepower Formula
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The default result is an ideal boosted horsepower estimate. Optional
        efficiency η is only a user heuristic for partial gains — not a full
        thermodynamic simulation. Always verify with measurement.
      </p>

      <h2
        id="related"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related Calculators
      </h2>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm sm:text-base">
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
            href="/tools/boat-loan-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Boat Loan Calculator
          </Link>
        </li>
      </ul>

      <h2
        id="boost-hp-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...BOOST_HP_FAQS]} />
      </div>
    </article>
  );
}
