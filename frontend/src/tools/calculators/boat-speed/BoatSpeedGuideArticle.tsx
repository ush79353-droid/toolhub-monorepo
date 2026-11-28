import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { BOAT_SPEED_FAQS } from './content';

export function BoatSpeedGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Boat Speed Calculator – Crouch&apos;s Formula, Horsepower &amp;
        Displacement
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Estimate boat speed from shaft horsepower, displacement, and an empirical
        Crouch constant. Convert among common power, mass, and speed units, solve
        reverse problems for required power or displacement, and review a clear
        formula breakdown. Results are educational performance estimates — not
        guaranteed measured top speeds.
      </p>

      <h2
        id="what-is-boat-speed"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is Boat Speed?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Boat speed is how fast a vessel moves through the water (or over the
        ground, depending on the instrument). Common units include miles per
        hour, kilometers per hour, knots, meters per second, and feet per second.
      </p>

      <h2
        id="how-calculator-works"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Does the Boat Speed Calculator Work?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        You enter shaft power and displacement (or reverse inputs), choose a boat
        category or custom Crouch constant, and the calculator converts everything
        into the formula&apos;s reference units before evaluating S = C × √(P /
        D).
      </p>

      <h2
        id="crouch-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is Crouch&apos;s Formula?
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        S = C × √(P / D)
      </p>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        S is estimated speed in mph, P is shaft horsepower in mechanical hp, D is
        displacement in pounds, and C is the Crouch constant for a comparable hull
        class.
      </p>

      <h2
        id="shaft-hp"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is Shaft Horsepower?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Shaft horsepower is the mechanical power available at the propeller shaft.
        Advertised engine ratings are often crankshaft figures and can overstate
        power reaching the water after gearbox and driveline losses.
      </p>

      <h2
        id="displacement"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is Boat Displacement?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Displacement here means the vessel&apos;s operating weight — hull, engines,
        fuel, gear, and people. It is treated as a mass-equivalent weight for unit
        conversion, not as a geometric volume.
      </p>

      <h2
        id="crouch-constant"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is the Crouch Constant?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        C is an empirical coefficient that varies with hull form and performance
        class. It is defined for the mph / hp / pound convention used by
        Crouch&apos;s formula and should not be applied unchanged to raw SI inputs.
      </p>

      <h2
        id="boat-types"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Crouch Constant Values for Different Boat Types
      </h2>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm sm:text-base">
        <li>Cruisers / average runabouts / passenger vessels ≈ 150</li>
        <li>Light high-speed cruisers &amp; runabouts ≈ 190</li>
        <li>Racing boats ≈ 210</li>
        <li>Hydroplanes ≈ 220</li>
        <li>Racing catamarans &amp; sea sleds ≈ 230</li>
      </ul>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        These are illustrative reference categories, not universal design
        standards. Use Custom Boat when you have a measured or preferred C.
      </p>

      <h2
        id="how-to-calculate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Boat Speed
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter shaft horsepower and convert to mechanical hp if needed.</li>
        <li>Enter displacement and convert to pounds.</li>
        <li>Select a boat type or enter C manually.</li>
        <li>Compute √(P / D), then multiply by C to get mph.</li>
        <li>Convert mph to knots, km/h, or other units as desired.</li>
      </ol>

      <h2
        id="example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Boat Speed Calculation Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        P = 3,000 hp, D = 6,000 lb, C = 150 → S = 150 × √(0.5) ≈ 106.07 mph
        (about 92.2 kn or 170.7 km/h).
      </p>

      <h2
        id="required-hp"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Required Boat Horsepower
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        P = D × (S / C)². Use the reverse mode in this calculator when you know
        target speed, displacement, and C.
      </p>

      <h2
        id="calc-displacement"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Boat Displacement
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        D = P / (S / C)². This estimates the displacement consistent with a
        measured speed and shaft power under Crouch assumptions.
      </p>

      <h2
        id="knots-vs-mph"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Boat Speed in Knots vs. MPH
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Marine instruments often report knots. Convert with 1 mph ≈ 0.8690 kn and
        1 kn ≈ 1.1508 mph. The calculator stores mph internally for Crouch math.
      </p>

      <h2
        id="what-affects"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Affects a Boat&apos;s Top Speed?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Hull design, propeller efficiency, engine and shaft power, displacement,
        water conditions, wind, aerodynamic and hydrodynamic drag, loading, and
        propulsion losses all influence real top speed beyond the simple formula.
      </p>

      <h2
        id="doubling-hp"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Does Doubling Horsepower Double Boat Speed?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        No. Because S ∝ √P, doubling power multiplies estimated speed by √2 ≈
        1.41 when displacement and C remain fixed. The comparison chart
        illustrates this square-root relationship.
      </p>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations of Crouch&apos;s Formula
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The formula is empirical and works best for comparable planing hulls. It
        may be inappropriate for displacement vessels, extreme loading, or unusual
        hulls. Always treat outputs as estimates and verify with sea trials and
        naval architecture guidance where decisions matter.
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
            href="/tools/speed-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Speed Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/power-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Power Calculator
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
        id="boat-speed-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...BOAT_SPEED_FAQS]} />
      </div>
    </article>
  );
}
