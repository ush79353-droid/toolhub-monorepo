import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { CURTAIN_SIZE_FAQS } from './content';

export function CurtainSizeGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Curtain Size Calculator – Curtain Width &amp; Length
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Estimate finished curtain length and flat width from window size,
        curtain style, fullness, and optional rod settings. These are finished
        dimensions — not fabric cutting sizes.
      </p>

      <h2 id="what-calc" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        What Is a Curtain Size Calculator?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A planning tool for recommended finished length and combined flat width
        before you buy or sew panels.
      </p>

      <h2 id="measure" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Measure Your Window for Curtains
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Measure opening width and height, then decide rod height, extensions,
        and style.
      </p>

      <h2 id="measure-w" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Measure Window Width
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Measure horizontally from one side of the frame to the other.
      </p>

      <h2 id="measure-h" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Measure Window Height
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Measure from the top of the opening to the sill. Curtain drop may differ
        once the rod is mounted.
      </p>

      <h2 id="choose-len" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Choose the Right Curtain Length
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Match sill, café, or floor length to the room and how much glass you
        want covered.
      </p>

      <h2 id="types-len" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Different Types of Curtain Lengths
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Sill-length, café-length, and extra-long (floor) are the styles modeled
        here.
      </p>

      <h2 id="sill" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        What Are Sill-Length Curtains?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Curtains ending near the sill — useful in kitchens, baths, and casual
        rooms.
      </p>

      <h2 id="cafe" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        What Are Café Curtains?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Curtains covering a portion of the window (default half). The café rod
        is assumed at the top of the covered area.
      </p>

      <h2 id="extra" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        What Are Extra-Long Curtains?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Floor-length or puddled panels. Window height alone is not enough — enter
        rod height above the floor.
      </p>

      <h2 id="calc-len" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Calculate Curtain Length
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        Sill: H+M+S · Café: H×C · Floor: Hr−Cf+P
      </p>

      <h2 id="calc-w" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Calculate Curtain Width
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        R = W+2E · Wc = R×F · Wp = Wc/N
      </p>

      <h2 id="fullness" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        What Is Curtain Fullness?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        How much flat fabric width you provide relative to the rod.
      </p>

      <h2 id="fullness-types" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Standard vs. Deluxe vs. Ultra Fullness
      </h2>
      <div className="mt-3 overflow-x-auto">
        <table className="min-w-[280px] text-sm">
          <thead>
            <tr>
              <th className="border-b px-2 py-1 text-left">Type</th>
              <th className="border-b px-2 py-1 text-right">Multiplier</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-2 py-1">Standard</td>
              <td className="px-2 py-1 text-right">1.5×</td>
            </tr>
            <tr>
              <td className="px-2 py-1">Deluxe</td>
              <td className="px-2 py-1 text-right">2.0×</td>
            </tr>
            <tr>
              <td className="px-2 py-1">Ultra</td>
              <td className="px-2 py-1 text-right">2.5×</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="choose-f" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Choose the Right Fullness Ratio
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Heavier fabric and grommets often need less; sheers and gathers often
        need more. Override with custom fullness anytime.
      </p>

      <h2 id="how-wide" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How Wide Should Curtains Be?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Aim for total flat width ≈ rod × fullness, then split across panels.
      </p>

      <h2 id="how-long" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How Long Should Curtains Be?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Match style: sill, café coverage, or floor clearance / puddle.
      </p>

      <h2 id="panels" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How Many Curtain Panels Do I Need?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Two is typical for a pair; use one or more as needed.
      </p>

      <h2 id="per-panel" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Calculate Curtain Width Per Panel
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Divide total flat width by panel count.
      </p>

      <h2 id="rod-ext" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How Far Should Curtain Rods Extend Beyond Windows?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Extensions let open curtains clear more glass. Default example: 15 cm
        each side.
      </p>

      <h2 id="rod-high" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How High Should Curtain Rods Be Installed?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Often above the frame for height. For sill length, mounting height adds
        to window height.
      </p>

      <h2 id="floor" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Measure Floor-Length Curtains
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Measure from hanging reference to floor, subtract clearance, add puddle
        if desired.
      </p>

      <h2 id="living" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Measure Curtains for a Living Room
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Floor-length is common; check furniture and radiator clearance.
      </p>

      <h2 id="bedroom" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Measure Curtains for a Bedroom
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Often floor-length for light control; measure carefully around nightstands.
      </p>

      <h2 id="kitchen" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Measure Curtains for a Kitchen
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Sill or café lengths keep fabric away from counters and sinks.
      </p>

      <h2 id="cafe-m" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Measure Café Curtains
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Choose coverage ratio (default 0.5) and place the café rod at the top of
        that zone.
      </p>

      <h2 id="window-types" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Choose Curtain Size for Different Window Types
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This calculator models a single rectangular opening. Complex shapes need
        section-by-section planning.
      </p>

      <h2 id="common" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Common Curtain Sizes
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Ready-made lengths vary by market. Always verify against your measured
        drop.
      </p>

      <h2 id="examples" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Curtain Size Calculation Examples
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Window 150×120 cm · sill · deluxe 2× · extension 15 · mount 15 · 2
        panels → rod 180 · total width 360 · per panel 180 · length 135 cm.
      </p>

      <h2 id="mistakes" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Standard Curtain Measurement Mistakes
      </h2>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-foreground/90">
        <li>Using glass width without rod extensions</li>
        <li>Assuming floor length from window height alone</li>
        <li>Confusing finished width with fabric cutting width</li>
        <li>Ignoring panel count when shopping singles</li>
      </ul>

      <h2 id="tips" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Practical Tips for Choosing Curtains
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Measure twice, decide fullness for the look you want, then use Curtain
        Panel Calculator for fabric yardage.
      </p>

      <h2 id="related" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Related Calculators
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Related sewing tools load from the catalog when developed — see{' '}
        <Link href="/tools" className="font-medium text-primary hover:underline">
          Omega Calculators
        </Link>
        .
      </p>

      <h2 id="cs-faq" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion faqs={[...CURTAIN_SIZE_FAQS]} />
      </div>
    </article>
  );
}
