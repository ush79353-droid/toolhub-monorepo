import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { HST_FAQS } from './content';

export function HSTGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Half Square Triangle Calculator – HST Size and Cutting Guide
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Calculate finished and unfinished HST sizes, raw cutting squares,
        diagonals, and project quantities. Traditional shortcuts and geometric
        minimums are labeled separately.
      </p>

      <h2 id="what-hst" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        What Is a Half Square Triangle?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A square quilt block made of two right triangles joined on the diagonal.
      </p>

      <h2 id="what-calc" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        What Is a Half Square Triangle Calculator?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A tool that converts between finished size, raw fabric squares, and
        diagonals for common HST construction methods.
      </p>

      <h2 id="how" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How Does the HST Calculator Work?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Pick a mode (finished→raw, raw→finished, or diagonal→side), method, and
        cutting preference; results update live.
      </p>

      <h2 id="finished" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        What Is a Finished HST Size?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The visible side length after the block is sewn into the quilt.
      </p>

      <h2 id="unfinished" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        What Is an Unfinished HST Size?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Finished size plus outer seam allowances: U = F + 2a.
      </p>

      <h2 id="raw" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        What Is the Difference Between Finished and Raw Square Sizes?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Finished is the quilt unit; raw is the fabric square you cut before
        sewing and cutting on the diagonal.
      </p>

      <h2 id="calc-size" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Calculate Half Square Triangle Size
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Start from finished size, add seams, then apply the method formula or
        shortcut.
      </p>

      <h2 id="formulas" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Half Square Triangle Cutting Formulas
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        Two geo: R=F+2a+a√2 · Trad: R=F+⅞″ · Eight geo: R=2F+4a+a√2 · Trad: R=2F+1¾″
      </p>

      <h2 id="make" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Make Half Square Triangles
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Layer two squares, sew beside the diagonal(s), cut, press, and trim if
        oversized.
      </p>

      <h2 id="tools" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Tools Needed to Make Half Square Triangles
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Rotary cutter, mat, ruler, sewing machine, iron, and marking tool.
      </p>

      <h2 id="two" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Two-at-a-Time HST Method
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        One diagonal; sew both sides; cut once — two HSTs per pair.
      </p>

      <h2 id="eight" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Eight-at-a-Time HST Method
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Both diagonals marked and sewn; cut into eight units — larger raw
        squares.
      </p>

      <h2 id="quilt" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Make Half Square Triangles for Quilting
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Match unfinished sizes across the project so seams nest cleanly.
      </p>

      <h2 id="sew" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Sew Half Square Triangles
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Stitch parallel to the marked diagonal at the seam distance; chain-piece
        for speed.
      </p>

      <h2 id="cut" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Cut HST Fabric Squares
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Cut accurate squares to the calculated raw size before marking.
      </p>

      <h2 id="mark" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Mark Diagonal Sewing Lines
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Draw corner-to-corner (and both diagonals for eight-at-a-time).
      </p>

      <h2 id="seam" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Calculate Seam Allowance
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Outer unfinished add-on is 2a; bias seam geometry also includes a√2 in
        the geometric raw formula.
      </p>

      <h2 id="quarter" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Quarter-Inch Seam Allowance Explained
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Standard quilting seam; traditional ⅞″ / 1¾″ shortcuts assume ≈¼″.
      </p>

      <h2 id="accurate" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Make Accurate HST Quilt Blocks
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Consistent seams, careful pressing, and trim-to-unfinished when needed.
      </p>

      <h2 id="trim" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Trim Oversized Half Square Triangles
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Align the seam on a square ruler&apos;s diagonal and trim to unfinished
        size.
      </p>

      <h2 id="chart" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Half Square Triangle Size Chart
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The calculator chart is generated from the same engine as your live
        results.
      </p>

      <h2 id="diag" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Half Square Triangle Diagonal Formula
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        d = s√2 · s = d/√2
      </p>

      <h2 id="raw-calc" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Calculate Raw Square Size
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Use finished→raw mode with your method and cutting preference.
      </p>

      <h2 id="fin-calc" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Calculate Finished HST Size
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Invert from a known raw square, or derive from a diagonal.
      </p>

      <h2 id="multi" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Make Multiple HST Blocks
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Enter required block count to get pairs, total squares, and surplus.
      </p>

      <h2 id="fabric" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How Much Fabric Is Needed for HST Blocks?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Each pair uses two raw squares of the calculated size — multiply by
        pairs needed.
      </p>

      <h2 id="arrange" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Arrange Half Square Triangles
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Rotate units to form pinwheels, chevrons, and other layouts.
      </p>

      <h2 id="patterns" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Popular Half Square Triangle Quilt Patterns
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Pinwheel, broken dishes, chevron, and many sampler blocks use HSTs.
      </p>

      <h2 id="mistakes" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Common HST Cutting Mistakes
      </h2>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-foreground/90">
        <li>Confusing finished with raw size</li>
        <li>Using eight-at-a-time formulas for two-at-a-time</li>
        <li>Stretching bias edges while pressing</li>
        <li>Rounding cutting sizes downward</li>
      </ul>

      <h2 id="tips" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Tips for Accurate Quilting Measurements
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Measure twice, use consistent seam, and prefer oversized+trim for
        precision.
      </p>

      <h2 id="fabrics" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Best Fabrics for Half Square Triangles
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Quilting cotton is stable and easy to press; match weights when pairing.
      </p>

      <h2 id="press" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Press Half Square Triangle Seams
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Press to set stitches, then open or nest as the pattern directs —
        without dragging the iron.
      </p>

      <h2 id="distort" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Avoid Fabric Distortion
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Support bias edges; starch lightly if needed.
      </p>

      <h2 id="square-up" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Square Up HST Quilt Blocks
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Trim to unfinished size with the seam centered on the diagonal.
      </p>

      <h2 id="limits" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Half Square Triangle Calculator Limitations
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Does not model fabric shrinkage, print matching, or scant-vs-true seam
        technique differences beyond the formulas you select.
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

      <h2 id="hst-faq" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion faqs={[...HST_FAQS]} />
      </div>
    </article>
  );
}
