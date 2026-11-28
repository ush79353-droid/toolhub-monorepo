import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { CROSS_STITCH_FAQS } from './content';

export function CrossStitchGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Cross-Stitch Calculator – Pattern Size &amp; Fabric Requirements
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Calculate finished embroidery dimensions, fabric cutting size with
        margins, stitch density, and optional floss estimates from chart size,
        fabric count, and stitch-over.
      </p>

      <h2 id="what-xs" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        What Is Cross-Stitch?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A counted-thread embroidery technique that forms X-shaped stitches on
        evenweave, linen, or Aida fabric.
      </p>

      <h2 id="what-calc" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        What Is a Cross-Stitch Calculator?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A planning tool that converts stitch counts into physical sizes and
        fabric requirements.
      </p>

      <h2 id="how-works" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How Does a Cross-Stitch Calculator Work?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        It computes D = C/O, then W = Sw/D and H = Sh/D, adds 2A margins for
        cutting, and optionally estimates floss from coverage assumptions.
      </p>

      <h2 id="fabric-count" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        What Is Cross-Stitch Fabric Count?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Count is threads or squares per inch. Always use the manufacturer’s
        stated count for your fabric.
      </p>

      <h2 id="aida-even" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        What Is the Difference Between Aida and Evenweave?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Aida shows clear holes (usually stitch over 1). Evenweave/linen is a
        thread grid often stitched over 2.
      </p>

      <h2 id="count-vs-stitch" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        What Is the Difference Between Fabric Count and Stitch Count?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Fabric count describes the cloth; stitch count (density) is C/O after
        choosing stitch-over.
      </p>

      <h2 id="calc-size" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Calculate Cross-Stitch Size
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Divide each chart dimension by D, then convert units as needed.
      </p>

      <h2 id="width" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Calculate Finished Pattern Width
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        W_in = S_w / D
      </p>

      <h2 id="height" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Calculate Finished Pattern Height
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        H_in = S_h / D
      </p>

      <h2 id="fabric-size" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Calculate Required Fabric Size
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        F_w = W + 2A · F_h = H + 2A
      </p>

      <h2 id="extra" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How Much Extra Fabric Should You Leave?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Leave enough for framing, hoops, and finishing. Margins are personal —
        larger projects often need more.
      </p>

      <h2 id="measure" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Measure Cross-Stitch Fabric
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Measure cut fabric flat; verify count by counting threads/squares in one
        inch if unsure of the label.
      </p>

      <h2 id="formula" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Cross-Stitch Size Formula
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        D = C/O · W = S_w/D · H = S_h/D · S = S_w×S_h
      </p>

      <h2 id="to-in" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Convert Stitches to Inches
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Divide by stitches per inch (D).
      </p>

      <h2 id="to-cm" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Convert Stitches to Centimeters
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Convert to inches, then multiply by 2.54.
      </p>

      <h2 id="density" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Calculate Stitch Density
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Density D = fabric count ÷ threads covered per stitch.
      </p>

      <h2 id="over" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Stitching Over One vs. Over Two Threads
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Over 1 on 14-count Aida → 14 spi. Over 2 on 28-count evenweave → also 14
        spi.
      </p>

      <h2 id="14" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        What Is 14-Count Aida?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Popular beginner fabric with 14 squares per inch when stitched over one.
      </p>

      <h2 id="16" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        What Is 16-Count Aida?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Finer than 14-count; same chart finishes smaller.
      </p>

      <h2 id="18" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        What Is 18-Count Aida?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Still finer; often paired with thinner needles and fewer floss strands.
      </p>

      <h2 id="28" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        What Is 28-Count Evenweave?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Common evenweave; over two threads behaves like 14-count Aida for size.
      </p>

      <h2 id="needles" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Cross-Stitch Needle Size Chart
      </h2>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[22rem] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs text-muted-foreground">
              <th className="py-2 pr-3 font-medium">Fabric</th>
              <th className="py-2 font-medium">Common tapestry needle</th>
            </tr>
          </thead>
          <tbody className="text-foreground/90">
            <tr className="border-b border-border/60">
              <td className="py-1.5 pr-3">8-count Aida</td>
              <td className="py-1.5">20</td>
            </tr>
            <tr className="border-b border-border/60">
              <td className="py-1.5 pr-3">11-count Aida</td>
              <td className="py-1.5">22–24</td>
            </tr>
            <tr className="border-b border-border/60">
              <td className="py-1.5 pr-3">14-count Aida</td>
              <td className="py-1.5">24</td>
            </tr>
            <tr className="border-b border-border/60">
              <td className="py-1.5 pr-3">16-count Aida</td>
              <td className="py-1.5">24–26</td>
            </tr>
            <tr className="border-b border-border/60">
              <td className="py-1.5 pr-3">18-count Aida</td>
              <td className="py-1.5">26</td>
            </tr>
            <tr className="border-b border-border/60">
              <td className="py-1.5 pr-3">28-count evenweave</td>
              <td className="py-1.5">24–26</td>
            </tr>
            <tr className="border-b border-border/60">
              <td className="py-1.5 pr-3">32-count evenweave</td>
              <td className="py-1.5">26</td>
            </tr>
            <tr>
              <td className="py-1.5 pr-3">36-count linen</td>
              <td className="py-1.5">26–28</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        Starting points only — strand count and preference matter.
      </p>

      <h2 id="choose-needle" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Choose the Correct Needle
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The needle should pass without forcing holes open too wide or shredding
        floss.
      </p>

      <h2 id="floss" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Estimate Embroidery Floss
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Use coverage × positions × length per cross × working strands, add
        waste, then divide by available strand-equivalent length per skein.
      </p>

      <h2 id="stitch-count" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How Many Cross-Stitches Are in a Pattern?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Chart width × height counts positions. Blank cells, fractional stitches,
        and backstitch change material needs.
      </p>

      <h2 id="choose-fabric" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Choose Fabric for Cross-Stitch
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Match the pattern recommendation, desired finished size, and your
        comfort with Aida vs evenweave.
      </p>

      <h2 id="mistakes" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Common Cross-Stitch Measurement Mistakes
      </h2>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-foreground/90">
        <li>Forgetting stitch-over on linen/evenweave</li>
        <li>Adding margin only once instead of both sides</li>
        <li>Assuming every chart cell is a full cross</li>
        <li>Ignoring framing allowances</li>
      </ul>

      <h2 id="example" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Cross-Stitch Calculator Worked Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        100×80 on 14-count over 1 with 8 cm margins: D=14; W≈7.14 in (18.14 cm);
        H≈5.71 in (14.51 cm); fabric ≈34.14×30.51 cm; positions=8,000.
      </p>

      <h2 id="compare" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Cross-Stitch Fabric Size Comparison
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The results panel compares common counts for your current stitch-over —
        higher density yields a smaller finished piece.
      </p>

      <h2 id="tips" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Tips for Preparing Cross-Stitch Fabric
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Square the cut, secure edges, find the center, and leave planned margins
        before starting.
      </p>

      <h2 id="related" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Related Calculators
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Related sewing and craft tools load from the catalog when developed —
        see{' '}
        <Link href="/tools" className="font-medium text-primary hover:underline">
          Omega Calculators
        </Link>
        .
      </p>

      <h2 id="xs-faq" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion faqs={[...CROSS_STITCH_FAQS]} />
      </div>
    </article>
  );
}
