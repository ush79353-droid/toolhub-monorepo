import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { BAG_FAQS } from './content';

export function BagGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Bag Calculator – Calculate Fabric Needed for a Tote Bag
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Estimate the width and height of one rectangular fabric piece for a
        folded-bottom tote — flat or with boxed corners — including optional
        seam and hem allowances. Documented construction model only.
      </p>

      <h2 id="what" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        What Is a Bag Calculator?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        It converts finished bag dimensions into cutting dimensions so you can
        plan fabric before sewing.
      </p>

      <h2 id="how-much" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How Much Fabric Do I Need to Make a Tote Bag?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Required fabric depends on finished height, width, whether depth is
        boxed into the cut, seam allowances, and top hems — plus layout on the
        bolt.
      </p>

      <h2 id="measure" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Measure a Tote Bag
      </h2>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-foreground/90">
        <li>Height — base to top edge</li>
        <li>Width — across the front</li>
        <li>Depth — front to back at the base</li>
      </ul>

      <h2 id="formulas" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Bag Measurement Formulas
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        Flat: F_w=W+2S · F_h=2H+2T
        <br />
        Boxed: F_w=W+D+2S · F_h=2H+D+2T
      </p>

      <h2 id="flat" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Calculate Fabric for a Flat Tote Bag
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Fold at the bottom, sew the sides, hem the top. Depth is not added to
        the rectangle when box corners are off.
      </p>

      <h2 id="boxed" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Calculate Fabric for a Boxed-Corner Tote Bag
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        After folding and sewing sides, box the corners to form depth D. The cut
        adds D into both width and height in this model.
      </p>

      <h2 id="what-boxed" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        What Are Boxed Corners?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Corner folds that create a rectangular base so the bag stands with
        depth.
      </p>

      <h2 id="width-depth" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Bag Width vs. Bag Depth
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Width spans the front face; depth is the front-to-back thickness of the
        base or gusset.
      </p>

      <h2 id="seam" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        What Is Seam Allowance?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Extra fabric beyond the finished edge for stitching. Side seams use 2S
        total across the width.
      </p>

      <h2 id="hem" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How Much Top Hem Allowance Is Needed?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Depends on fold method; this tool defaults to 2 cm at each opening edge
        of the folded piece (2T).
      </p>

      <h2 id="area" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Calculate Fabric Area
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        A = F_w × F_h
      </p>
      <p className="mt-2 text-sm text-foreground/90">
        Area is the rectangle only — not necessarily purchase yardage.
      </p>

      <h2 id="types" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Types of Tote Bags
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Flat, boxed-bottom, separately gusseted, lined, canvas shopping totes,
        and more — each may need a different cut plan.
      </p>

      <h2 id="fabrics" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Fabric Types for Tote Bags
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Cotton, canvas, linen, polyester, and recycled textiles are common
        choices depending on strength and care.
      </p>

      <h2 id="choose" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Choose the Right Fabric
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Match durability, thickness, washability, and structure to the bag’s
        expected load and use.
      </p>

      <h2 id="layout" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Tote Bag Cutting Layout
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Respect grain, fold placement, and usable fabric width when nesting the
        rectangle on the bolt.
      </p>

      <h2 id="shrink" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Fabric Shrinkage and Waste
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Pre-wash when needed and allow waste for mistakes, matching, and
        irregular edges.
      </p>

      <h2 id="mistakes" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Common Bag-Making Mistakes
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Confusing finished size with cut size, forgetting allowances, or
        applying flat formulas to a different construction.
      </p>

      <h2 id="how-use" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Use the Bag Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter finished height, width, and depth.</li>
        <li>Choose box corners Yes or No.</li>
        <li>Optionally edit seam and hem in Advanced settings.</li>
        <li>Read fabric width, height, and area.</li>
      </ol>

      <h2 id="example" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Bag Calculator Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        40×35×10 cm, S=1 cm, T=2 cm → flat 37×84 cm; boxed 47×94 cm (area 4418
        cm²).
      </p>

      <h2 id="limits" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Limitations of the Bag Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Does not add handles, lining, pockets, zippers, interfacing, pattern
        matching, or alternate panel constructions.
      </p>

      <h2 id="related" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Related Calculators
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-foreground/90">
        <li>
          <Link href="/tools/speed-calculator">Speed Calculator</Link>
        </li>
        <li>
          <Link href="/tools/tire-size-calculator">Tire Size Calculator</Link>
        </li>
        <li>
          <Link href="/tools/wheel-offset-calculator">
            Wheel Offset Calculator
          </Link>
        </li>
      </ul>

      <h2 id="bag-faq" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion faqs={[...BAG_FAQS]} />
      </div>
    </article>
  );
}
