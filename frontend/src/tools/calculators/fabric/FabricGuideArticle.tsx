import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { FABRIC_FAQS } from './content';

export function FabricGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Fabric Calculator – Calculate Fabric Yardage and Cutting Requirements
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Estimate pieces across, cutting rows, fabric length, and yardage for
        identical rectangular pieces. This is a uniform-orientation grid model —
        not a claim of globally minimal waste.
      </p>

      <h2 id="what" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        What Is a Fabric Calculator?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A planning tool that turns fabric width, piece size, and quantity into
        length and yardage estimates.
      </p>

      <h2 id="how" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How Does a Fabric Calculator Work?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        It counts how many pieces fit across, how many rows you need, then
        multiplies by piece length.
      </p>

      <h2 id="yardage" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Calculate Fabric Yardage
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        yards = length_inches / 36
      </p>

      <h2 id="meas" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        What Measurements Do You Need?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Fabric width, piece width, piece length, and number of pieces.
      </p>

      <h2 id="width" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Measure Fabric Width
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Measure selvage to selvage, then subtract unusable edge allowance if
        needed.
      </p>

      <h2 id="piece" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Measure Fabric Piece Dimensions
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Include seam allowances in the piece rectangle you enter.
      </p>

      <h2 id="across" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Calculate Pieces Across Fabric Width
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        P = floor((F+G)/(W+G))
      </p>

      <h2 id="rows" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Calculate the Number of Cutting Rows
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        R = ceil(N/P)
      </p>

      <h2 id="length" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Calculate Total Fabric Length
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        M = R×L (+ gaps between rows)
      </p>

      <h2 id="in-yd" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Convert Fabric Inches to Yards
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Divide inches by 36.
      </p>

      <h2 id="cm-m" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Convert Fabric Centimeters to Meters
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Divide centimeters by 100.
      </p>

      <h2 id="by-hand" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Calculate Fabric Yardage by Hand
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Compute P and R, multiply by L, convert units, then add shrinkage/extra.
      </p>

      <h2 id="layout" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Fabric Cutting Layout Explained
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Pieces tile in rows across the width. The last row may be partial —
        unused cells are leftover within the rectangle, not purchase padding.
      </p>

      <h2 id="waste" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Minimize Fabric Waste
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Adjust piece sizes, gaps, and orientation when grain allows. Nested
        packing can beat this grid.
      </p>

      <h2 id="usable" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Understanding Fabric Width and Usable Width
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Usable width = fabric width − edge allowances on both sides.
      </p>

      <h2 id="grain" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Understanding Fabric Grain and Cutting Direction
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Grain and nap often fix orientation even if rotation would save length.
      </p>

      <h2 id="rotate" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Can Fabric Pieces Be Rotated?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Optional 90° comparison picks the shorter uniform layout when both fit —
        not mixed-orientation nesting.
      </p>

      <h2 id="shrink" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Calculate Fabric Shrinkage Allowance
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        M_buy = M / (1 − S/100)
      </p>

      <h2 id="extra" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How Much Extra Fabric Should You Buy?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Extra % multiplies length after shrinkage — distinct from layout unused
        area.
      </p>

      <h2 id="common-w" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Common Fabric Widths
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Presets include 36, 44, 45, 54, 58, 60, and 72 inches.
      </p>

      <h2 id="sewing" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Calculate Fabric for Sewing Projects
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Break the project into identical rectangles (or use a dedicated garment
        calculator when shapes differ).
      </p>

      <h2 id="quilt" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Calculate Fabric for Quilting
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Enter strip/block cut sizes and counts; add matching allowance separately.
      </p>

      <h2 id="curtains" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Calculate Fabric for Curtains
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Prefer Curtain Panel Calculator for drops and fullness; use this tool for
        simple panels treated as rectangles.
      </p>

      <h2 id="cushions" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Calculate Fabric for Cushion Covers
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Enter one cover&apos;s cut size × quantity.
      </p>

      <h2 id="table" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Calculate Fabric for Tablecloths
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        One large piece or joined widths — set N and piece size accordingly.
      </p>

      <h2 id="multi" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Calculate Fabric for Multiple Identical Pieces
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This calculator&apos;s primary use case: one rectangle × N.
      </p>

      <h2 id="examples" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Fabric Yardage Calculation Examples
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        60 in fabric · 12×18 in pieces · 12 pcs → 5 across · 3 rows · 54 in =
        1.5 yd · ~80% utilization.
      </p>

      <h2 id="mistakes" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Common Fabric Measurement Mistakes
      </h2>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-foreground/90">
        <li>Forgetting seam allowances</li>
        <li>Ignoring selvages</li>
        <li>Rotating napped fabric</li>
        <li>Confusing layout leftover with purchase extra</li>
      </ul>

      <h2 id="limits" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Fabric Calculator Limitations
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        No print matching, no mixed rotations, no irregular shapes, no cost
        engine.
      </p>

      <h2 id="tips" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Tips for Buying the Right Amount of Fabric
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Round purchase up at the counter, add matching/shrink pads, and verify
        usable width on the bolt.
      </p>

      <h2 id="related" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Related Calculators
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Related tools load from the catalog when developed — see{' '}
        <Link href="/tools" className="font-medium text-primary hover:underline">
          Omega Calculators
        </Link>
        .
      </p>

      <h2 id="fab-faq" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion faqs={[...FABRIC_FAQS]} />
      </div>
    </article>
  );
}
