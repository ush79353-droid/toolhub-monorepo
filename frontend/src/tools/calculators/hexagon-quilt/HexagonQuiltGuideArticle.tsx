import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { HEX_QUILT_FAQS } from './content';

export function HexagonQuiltGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Hexagon Quilt Calculator – Calculate Hexagons for Quilting
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Plan flat-top hexagon quilt layouts: columns, rows, full and half
        hexagons, actual top size, and optional fabric estimates.
      </p>

      <h2 id="what" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        What Is a Hexagon Quilt Calculator?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A planning tool that turns desired quilt dimensions and hexagon size
        into piece counts and finished top measurements.
      </p>

      <h2 id="how" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How Does a Hexagon Quilt Calculator Work?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        It places regular hexagons in a staggered flat-top grid, then counts
        full cells and edge half-hexagon templates.
      </p>

      <h2 id="count" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Calculate the Number of Hexagons for a Quilt
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Do not divide quilt area by one hexagon&apos;s area alone — staggered
        spacing and edges change the count.
      </p>

      <h2 id="layouts" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Understanding Hexagon Quilt Layouts
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This tool uses flat-top hexagons with column spacing 1.5s and row
        spacing √3 s; odd columns offset by half a row.
      </p>

      <h2 id="measure" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Measure a Hexagon for Quilting
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Prefer finished side length. You can also enter point-to-point or
        flat-to-flat and convert.
      </p>

      <h2 id="side-vs-width" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Hexagon Side Length vs. Width
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        W = 2s · H = √3 s · a = (√3/2) s
      </p>

      <h2 id="geometry" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Hexagon Geometry Explained
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A regular hexagon has six equal sides and internal angles of 120°.
      </p>

      <h2 id="area" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Calculate Hexagon Area
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        A = (3√3/2) s² · Example s=5 cm → ≈64.95 cm²
      </p>

      <h2 id="columns" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Calculate Hexagonal Columns
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Grow columns until actual width 2s+(cols−1)×1.5s covers the desired
        width.
      </p>

      <h2 id="rows" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Calculate Hexagonal Rows
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        rows = ceil(length / H). With multiple columns, actual length includes
        an extra H/2 for stagger.
      </p>

      <h2 id="how-many" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How Many Hexagons Do I Need for a Quilt?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Full = columns × rows. Halves finish edges. Equivalent = full + half/2.
      </p>

      <h2 id="half" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        What Is a Half Hexagon?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A true half is cut on a symmetry line of the regular hexagon — not an
        arbitrary clipped edge.
      </p>
      <svg
        viewBox="0 0 280 100"
        className="mt-3 h-auto w-full max-w-md"
        role="img"
        aria-label="Full hexagon and two half-hexagon templates"
      >
        <polygon
          points="50,20 80,20 95,46 80,72 50,72 35,46"
          fill="#dcfce7"
          stroke="#16a34a"
          strokeWidth="2"
        />
        <text x="65" y="92" textAnchor="middle" fontSize="10" fill="#163c43">
          Full
        </text>
        <polygon
          points="130,20 160,20 175,46 160,72 130,72"
          fill="#bbf7d0"
          stroke="#16a34a"
          strokeWidth="2"
        />
        <text x="152" y="92" textAnchor="middle" fontSize="10" fill="#163c43">
          Vertical half
        </text>
        <polygon
          points="210,20 240,20 255,46 210,46"
          fill="#86efac"
          stroke="#16a34a"
          strokeWidth="2"
        />
        <text x="232" y="92" textAnchor="middle" fontSize="10" fill="#163c43">
          Horizontal half
        </text>
      </svg>

      <h2 id="cut-half" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Cut Half Hexagons
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Cut through opposite vertices for vertical halves, or through opposite
        flats for horizontal halves.
      </p>

      <h2 id="straight" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Use Half Hexagons for Straight Quilt Edges
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Vertical halves straighten left/right; horizontal halves help finish
        staggered top/bottom edges.
      </p>

      <h2 id="actual" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Calculate the Actual Size of a Hexagon Quilt
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Actual size comes from the discrete grid — it may be slightly larger
        than the desired size.
      </p>

      <h2 id="chart" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Hexagon Quilt Size Chart
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Use the live results for your hex size; common tops range from baby to
        king once dimensions are entered.
      </p>

      <h2 id="fabric" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How Much Fabric Do I Need for a Hexagon Quilt?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Estimates use cutting-template area × equivalent hexagons × waste,
        divided by fabric width.
      </p>

      <h2 id="yardage" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Calculate Fabric Yardage
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Length = area / fabric width; yards = length / 36 in (91.44 cm).
      </p>

      <h2 id="seam" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How Seam Allowance Affects Hexagon Cutting
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        cutting s = finished s + 2a/√3
      </p>

      <h2 id="template" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Make Hexagon Cutting Templates
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Draft from finished or cutting side length; keep grain consistent when
        possible.
      </p>

      <h2 id="epp" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        English Paper Piecing vs. Machine-Pieced Hexagons
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        EPP uses paper templates and hand stitches; machine piecing needs
        careful Y-seams. Layout math is the same.
      </p>

      <h2 id="arrange" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Arrange Hexagons in Rows
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Sew columns, then join columns with the stagger offset.
      </p>

      <h2 id="sew" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Sew Hexagons Together
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Align sides, sew one seam at a time through Y intersections, and press
        without distorting bias edges.
      </p>

      <h2 id="assemble" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Assemble a Hexagon Quilt Top
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Build columns, join them, add half hexagons for straight edges, then
        square and border if desired.
      </p>

      <h2 id="borders" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Create Straight Quilt Borders
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Half hexagons create a straight perimeter; borders attach afterward.
      </p>

      <h2 id="examples" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Hexagon Quilt Layout Examples
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Default example: 150×200 cm with s=5 cm — open the calculator for live
        column/row counts.
      </p>

      <h2 id="sizes" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Common Hexagon Quilt Sizes
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Baby, lap, twin, queen, and king tops all work — only the entered
        dimensions change.
      </p>

      <h2 id="beginner" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Tips for Beginner Hexagon Quilters
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Start with fewer, larger hexes; practice Y-seams or try EPP first.
      </p>

      <h2 id="mistakes" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Common Hexagon Quilting Mistakes
      </h2>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-foreground/90">
        <li>Confusing side length with flat-to-flat width</li>
        <li>Ignoring half hexagons for edges</li>
        <li>Estimating piece count from area alone</li>
        <li>Applying seam allowance to finished layout size</li>
      </ul>

      <h2 id="waste" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Reduce Fabric Waste
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Nest cutting layouts and tune waste % to your real scrap rate.
      </p>

      <h2 id="limits" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Hexagon Quilt Calculator Limitations
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Assumes one regular hex size and flat-top stagger. Does not optimize
        nested cutting or mixed hex sizes.
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

      <h2 id="hex-faq" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion faqs={[...HEX_QUILT_FAQS]} />
      </div>
    </article>
  );
}
