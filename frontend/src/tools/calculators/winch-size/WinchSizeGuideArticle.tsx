import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { WS_FAQS } from './content';

export function WinchSizeGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Winch Size Calculator – Calculate Required Winch Pulling Capacity
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Estimate pulling force from vehicle or load mass, terrain or drag
        resistance, slope, and a planning safety factor. Compare with the common
        1.5× vehicle-weight guideline. Results are planning aids — not a
        certified recovery design.
      </p>

      <h2 id="what-winch" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        What Is a Winch?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A winch is a powered drum that winds rope or cable to pull a load toward
        an anchor or the vehicle.
      </p>

      <h2 id="how-works" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How Does a Winch Work?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A motor and gearbox turn the drum; rope winds under tension through a
        fairlead. Brakes and controls manage payout and hold.
      </p>

      <h2 id="used-for" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        What Is a Vehicle Winch Used For?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Common uses include off-road self-recovery, assisting another vehicle,
        and carefully controlled pulling tasks within rated limits.
      </p>

      <h2 id="what-size" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        What Size Winch Do I Need?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Consider mass, ground conditions, slope, duty cycle, mounting, power
        supply, and rope ratings — then apply manufacturer guidance.
      </p>

      <h2 id="formula" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Winch Size Formula
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        F_r = C·m·g·cosθ &nbsp;·&nbsp; F_s = m·g·sinθ &nbsp;·&nbsp; F_req = (F_r+F_s)×SF
      </p>

      <h2 id="capacity-vs-weight" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Winch Capacity vs. Vehicle Weight
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A common guideline sizes nominal capacity at about 1.5× vehicle weight.
        It is separate from the resistance-based estimate and neither guarantees
        a successful recovery.
      </p>

      <h2 id="how-calc" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Calculate Required Winch Pulling Force
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Convert mass to kilograms, choose C and θ, compute F_r and F_s in
        newtons, multiply by SF, then convert to lbf, kgf, or kN.
      </p>

      <h2 id="rolling" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        What Is Rolling Resistance?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Resistance opposing rolling motion from surface and tire deformation.
        Load-moving mode uses a related drag/friction form with its own
        coefficient meaning.
      </p>

      <h2 id="terrain" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How Terrain Affects Winch Size
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Hard ground uses low illustrative C; mud, sand, and soft soil use higher
        values. Field conditions vary widely — edit C as needed.
      </p>

      <h2 id="slope" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How Slope Affects Winch Capacity
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Steeper uphill angles increase the gravity component along the slope and
        change the normal force used in rolling resistance.
      </p>

      <h2 id="choose" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Choose a Vehicle Winch
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Match capacity, duty cycle, electrical or hydraulic supply, mounting
        kit, and accessories to the vehicle and intended use.
      </p>

      <h2 id="electric-hydraulic" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Electric vs. Hydraulic Winches
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Electric units are common on recreational 4×4s; hydraulic systems suit
        some commercial setups with continuous hydraulic power.
      </p>

      <h2 id="single-double" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Single-Line vs. Double-Line Pull
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Double-line setups can change mechanical advantage when correctly rated
        and rigged. Friction and component limits still apply — never assume
        twice the usable capacity.
      </p>

      <h2 id="line-pull" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        What Is Winch Line Pull?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Rated line pull is often specified on the first drum layer. Outer layers
        typically deliver less force.
      </p>

      <h2 id="snatch" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        What Is a Snatch Block?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A recovery pulley that redirects the line and may alter mechanical
        advantage when used with suitably rated gear.
      </p>

      <h2 id="working-load" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        What Is Winch Working Load?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Distinguish stamped winch capacity, rope minimum breaking strength, and
        working-load limits of hooks and shackles — the lowest applicable limit
        governs.
      </p>

      <h2 id="cable-rope" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Winch Cable vs. Synthetic Rope
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Steel cable is abrasion-resistant but heavy; synthetic rope is lighter
        with different failure behavior and needs sleeve protection.
      </p>

      <h2 id="too-small" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Can a Winch Be Too Small?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Undersizing risks stalled pulls, overheating, and equipment or recovery
        failure when loads exceed ratings.
      </p>

      <h2 id="too-large" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Can a Winch Be Too Large?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Oversizing without matching mounts, power, and technique can overload
        other components. Balance the full system.
      </p>

      <h2 id="safety" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Winch Safety Precautions
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Keep clear of the line path, use rated gear, dampen the rope as
        recommended, and follow manufacturer and qualified recovery procedures.
      </p>

      <h2 id="how-use" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Use the Winch Size Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Choose recovery vs load-moving operation.</li>
        <li>Enter mass or pick an illustrative vehicle type.</li>
        <li>Select terrain (or custom C), slope, and safety factor.</li>
        <li>Optional: adjust line-pull % and single/double-line.</li>
        <li>Compare resistance estimate, weight guideline, and tier list.</li>
      </ol>

      <h2 id="example" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Winch Sizing Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        2,000 kg · mud C=0.35 · 10° · SF 1.5 → about 10.17 kN total resistance,
        ~15.25 kN (~3,428 lbf) after SF, while the 1.5× weight guideline is ~6,614
        lbf. Prefer the more conservative planning figure and verify in the field.
      </p>

      <h2 id="limits" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Limitations of Winch Size Calculations
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This tool cannot predict suction, obstacles, stalled wheels, drum-layer
        derating, electrical sag, or poor anchors. It is not a substitute for
        manufacturer ratings or professional recovery practice.
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
          <Link href="/tools/horsepower-calculator">Horsepower Calculator</Link>
        </li>
        <li>
          <Link href="/tools/fuel-cost-calculator">Fuel Cost Calculator</Link>
        </li>
        <li>
          <Link href="/tools/carpooling-calculator">Carpooling Calculator</Link>
        </li>
      </ul>

      <h2 id="ws-faq" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion faqs={[...WS_FAQS]} />
      </div>
    </article>
  );
}
