import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { CR_FAQS } from './content';

export function CompressionRatioGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Compression Ratio Calculator – Calculate Engine Compression Ratio
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Calculate geometric static compression ratio from bore, stroke, chamber,
        gasket, deck, and piston volumes — plus optional dynamic CR from intake
        valve closing ABDC.
      </p>

      <h2 id="what-is" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        What Is a Compression Ratio?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        It compares how much the cylinder volume shrinks as the piston moves from
        bottom dead center to top dead center.
      </p>

      <h2 id="engine-cr" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        What Is Engine Compression Ratio?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Engine CR is the geometric ratio VBDC / VTDC for each cylinder, usually
        written as N:1.
      </p>

      <h2 id="formula" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Compression Ratio Formula
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        CR = (Vs + Vc) / Vc
      </p>

      <h2 id="how-to" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Calculate Compression Ratio
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Example: Vs = 450 cc, Vc = 50 cc → CR = 500 / 50 = 10:1.
      </p>

      <h2 id="displacement" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Calculate Engine Displacement
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        Vs(cc) = π D² L / 4000 (D, L in mm); Engine = Vs × N
      </p>

      <h2 id="swept" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        What Is Swept Volume?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The volume the piston sweeps each stroke — cylinder displacement.
      </p>

      <h2 id="clearance" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        What Is Clearance Volume?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Volume above the piston at TDC from the chamber, gasket, deck, and piston
        crown (dish or dome).
      </p>

      <h2 id="bore" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How Does Bore Affect Compression Ratio?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Larger bore increases Vs. Deck and gasket volumes also scale with bore²,
        so net CR depends on the full geometry.
      </p>

      <h2 id="stroke" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How Does Stroke Affect Compression Ratio?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Longer stroke increases Vs; with fixed Vc, CR increases.
      </p>

      <h2 id="static" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        What Is Static Compression Ratio?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The conventional geometric CR using the full piston stroke.
      </p>

      <h2 id="dynamic" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        What Is Dynamic Compression Ratio?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        An estimate using the effective stroke after the intake valve closes,
        via crank-slider geometry.
      </p>

      <h2 id="static-vs-dynamic" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Static vs. Dynamic Compression Ratio
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Static ignores valve timing. Dynamic is usually lower when IVC occurs
        after BDC. Neither equals measured compression pressure.
      </p>

      <h2 id="good-cr" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        What Is a Good Compression Ratio?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Suitable ratios depend on fuel octane/cetane, boost, chamber design, and
        calibration — avoid one-size-fits-all claims.
      </p>

      <h2 id="too-high" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        What Happens If Compression Ratio Is Too High?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Knock risk, heat, and mechanical stress can rise without matching fuel
        and ignition strategy.
      </p>

      <h2 id="efficiency" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Does Higher Compression Ratio Improve Efficiency?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Theory says yes for Otto cycles; practice is limited by knock, friction,
        and heat transfer.
      </p>

      <h2 id="petrol" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Compression Ratio in Petrol Engines
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Spark-ignition designs balance CR against octane and knock control —
        ranges vary widely by era and application.
      </p>

      <h2 id="diesel" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Compression Ratio in Diesel Engines
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Diesels compress air enough for auto-ignition and often use higher
        geometric ratios than many petrol engines.
      </p>

      <h2 id="turbo" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How Do Turbochargers Affect Compression Ratio?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Boost raises intake pressure; geometric CR stays the same but cylinder
        pressures climb. Do not confuse boost with geometric CR.
      </p>

      <h2 id="pressure" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Compression Ratio vs. Cylinder Pressure
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        CR is a volume ratio. Gauge compression pressure depends on sealing,
        cam timing, cranking speed, and temperature.
      </p>

      <h2 id="limitations" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Limitations of a Compression Ratio Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Geometry ignores heat transfer, blow-by, and combustion. Dynamic CR is a
        crank-slider approximation only.
      </p>

      <h2 id="related" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Related Calculators
      </h2>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm sm:text-base">
        <li>
          <Link href="/tools/boost-horsepower-calculator" className="font-medium text-primary underline-offset-2 hover:underline">
            Boost Horsepower Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/bsfc-calculator" className="font-medium text-primary underline-offset-2 hover:underline">
            BSFC Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/boat-speed-calculator" className="font-medium text-primary underline-offset-2 hover:underline">
            Boat Speed Calculator
          </Link>
        </li>
      </ul>

      <h2 id="cr-faq" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...CR_FAQS]} />
      </div>
    </article>
  );
}
