import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { CURTAIN_PANEL_FAQS } from './content';

export function CurtainPanelGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Curtain Panel Calculator – Fabric Yardage &amp; Curtain Size
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Estimate curtain coverage, finished and cut panel sizes, fabric drops,
        and purchase yardage from rod width, fullness, panel count, fabric
        width, and sewing allowances.
      </p>

      <h2 id="what-panel" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        What Is a Curtain Panel?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A finished curtain piece. Multiple panels can share one opening.
      </p>

      <h2 id="what-calc" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        What Is a Curtain Panel Calculator?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A planning tool for flat coverage, cut sizes, joined fabric widths
        (drops), and yardage.
      </p>

      <h2 id="types" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Different Types of Curtain Panels
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Standard, grommet/eyelet, and gathered headings change look and often
        preferred fullness.
      </p>

      <h2 id="standard" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Standard Curtain Panels
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Classic panels with a sewn heading — fullness is adjustable.
      </p>

      <h2 id="grommet" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Grommet and Eyelet Curtains
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Large rings at the top. Allow enough top fabric for placement and
        stack-back.
      </p>

      <h2 id="gathered" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Gathered Curtain Panels
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Extra flat width creates gathers — often higher fullness ratios.
      </p>

      <h2 id="fullness" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        What Is Curtain Fullness?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Flat finished fabric width relative to the rod. More fullness looks
        richer but uses more cloth.
      </p>

      <h2 id="calc-fullness" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Calculate Curtain Fullness
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        W_coverage = rod × fullness
      </p>

      <h2 id="measure-window" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Measure a Window for Curtains
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Measure rod/track and desired finished drop — not only the glass.
      </p>

      <h2 id="rod" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Measure Curtain Rod Width
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Measure the span the curtains will cover, including any stack-back
        beyond the frame if desired.
      </p>

      <h2 id="length" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Determine Curtain Length
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        From heading reference to sill, apron, or floor (kiss, break, or puddle).
      </p>

      <h2 id="how-many" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How Many Curtain Panels Do I Need?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Choose for symmetry and stacking; two is common but not required.
      </p>

      <h2 id="how-wide" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How Wide Should Curtain Panels Be?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Split coverage across panels, then add side hems for cutting.
      </p>

      <h2 id="fabric-req" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Calculate Curtain Fabric Requirements
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Compute cut width, find drops per panel, multiply by panels and cut
        length, then convert units.
      </p>

      <h2 id="yardage" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Calculate Curtain Fabric Yardage
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        yards = meters / 0.9144
      </p>

      <h2 id="two-panels" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How Much Fabric Do You Need for Two Curtain Panels?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Same math with N=2. Worked example below uses a 200 cm rod at 2×
        fullness.
      </p>

      <h2 id="width-formula" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Curtain Panel Width Formula
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        W_panel = (R×F)/N · W_cut = W_panel + 2Hs
      </p>

      <h2 id="length-formula" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Curtain Panel Length Formula
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        L_cut = Lf + Ht + Hb
      </p>

      <h2 id="drops" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Calculate Fabric Drops
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Increase D until joined widths minus joining seams cover W_cut.
      </p>

      <h2 id="what-drop" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        What Is a Fabric Drop?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        One length of fabric cut across the usable bolt width.
      </p>

      <h2 id="cut-len" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Calculate Fabric Cutting Length
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Start from finished length plus allowances; align to vertical repeat if
        needed.
      </p>

      <h2 id="hems" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Add Curtain Hem Allowances
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Add top heading fabric and bottom hem turn-ups to the finished length
        before cutting.
      </p>

      <h2 id="side-hem" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Calculate Side Hem Allowance
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Per side × 2 on the finished panel edges — not on every internal join.
      </p>

      <h2 id="top-bottom" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Calculate Top and Bottom Hem Allowances
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Match heading construction and desired hem depth; grommets may need more
        top fabric.
      </p>

      <h2 id="repeat" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Account for Fabric Pattern Repeat
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        L_repeat = ceil(L_cut / P) × P (when P &gt; 0)
      </p>

      <h2 id="extra" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How Much Extra Fabric Should You Buy?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Round purchase up (¼ yd here) and optionally add shrinkage and waste %.
      </p>

      <h2 id="measure-panels" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Measure Curtain Panels for Your Window
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Confirm rod span, drop, and stack-back before cutting.
      </p>

      <h2 id="sew" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Sew Curtain Panels
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Join drops if needed, finish sides, form heading, hang, then level the
        hem.
      </p>

      <h2 id="hems-sew" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Sew Top and Bottom Hems
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Press and stitch consistent depths; weight hems if fabric curls.
      </p>

      <h2 id="sew-gathered" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Make Gathered Curtains
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Provide enough flat width, then gather or use tape to the rod size.
      </p>

      <h2 id="sew-grommet" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Make Grommet Curtains
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Reinforce the top, space rings evenly, and allow fabric for folds
        between grommets.
      </p>

      <h2 id="choose-fabric" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Choose Curtain Fabric
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Match drape, light control, care, and print direction to the room.
      </p>

      <h2 id="weight" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Curtain Fabric Weight and Fullness
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Heavier cloth often needs less fullness; sheers often need more.
      </p>

      <h2 id="mistakes" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Curtain Measurement Mistakes to Avoid
      </h2>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-foreground/90">
        <li>Using glass width instead of rod width</li>
        <li>Forgetting both side hems</li>
        <li>Confusing panels with fabric drops</li>
        <li>Ignoring pattern repeat or shrinkage</li>
      </ul>

      <h2 id="example" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Worked Curtain Fabric Calculation Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Rod 200 cm · fullness 2 · 2 panels · fabric 140 cm · side 3 · top 10 ·
        bottom 15 · join 1.5: coverage 400 · panel 200 · cut 206 · 2 drops/panel
        · L 245 · 4 drops · 9.8 m ≈ 10.72 yd → buy 10.75 yd.
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

      <h2 id="cp-faq" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion faqs={[...CURTAIN_PANEL_FAQS]} />
      </div>
    </article>
  );
}
