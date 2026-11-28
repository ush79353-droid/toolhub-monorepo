import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { CIRCLE_SKIRT_FAQS } from './content';

export function CircleSkirtGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Circle Skirt Calculator – Waist Radius &amp; Fabric Length
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Calculate waist radius, finished outer radius, radial cutting length,
        and hem circumference for full, 3/4, half, and quarter circle skirts
        using Math.PI-based sector geometry.
      </p>

      <h2 id="what" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        What Is a Circle Skirt Calculator?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A drafting aid that turns waist circumference, skirt length, and circle
        fraction into pattern radii and cutting dimensions.
      </p>

      <h2 id="how-works" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How Does a Circle Skirt Calculator Work?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The waist opening is an arc of a circle sector. From W = 2πRf it solves
        for R, then adds length for the hem radius.
      </p>

      <h2 id="how-make" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Make a Circle Skirt
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Measure waist and finished length.</li>
        <li>Choose fullness (full / 3/4 / half / quarter).</li>
        <li>Compute R and R+L; add seam/hem allowances for cutting.</li>
        <li>Check fabric width; cut, sew, hang, then finish the hem.</li>
      </ol>

      <h2 id="full" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        What Is a Full Circle Skirt?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A 360° skirt (f = 1) with maximum flare for a given length.
      </p>

      <h2 id="three-q" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        What Is a 3/4 Circle Skirt?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A 270° sector (f = 0.75) — very full with less fabric than a full circle.
      </p>

      <h2 id="half" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        What Is a Half Circle Skirt?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A 180° sector (f = 0.5) with moderate fullness.
      </p>

      <h2 id="quarter" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        What Is a Quarter Circle Skirt?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A 90° sector (f = 0.25) with lighter flare and a larger waist radius.
      </p>

      <h2 id="math" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Circle Skirt Math Explained
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Arc length of a sector is the fraction of the full circumference. That
        arc becomes the waist opening when the sector is sewn into a skirt.
      </p>

      <h2 id="radius-formula" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Circle Skirt Radius Formula
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        R = W / (2πf)
        <br />
        R_outer = R + L
        <br />
        F_radial = L + R + A
        <br />
        C_hem = 2π(R+L)f
      </p>

      <h2 id="measure-waist" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Measure Your Waist
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Measure at the intended waistband position with a level, snug tape.
      </p>

      <h2 id="measure-length" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Measure Skirt Length
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        From waistband line to finished hem. Hem turn-up is separate.
      </p>

      <h2 id="calc-r" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Calculate Waist Radius
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Divide waist by 2πf. Example half circle: W=75 cm → R≈23.87 cm.
      </p>

      <h2 id="calc-outer" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Calculate Outer Skirt Radius
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Add finished length to R. Example: 23.87 + 70 ≈ 93.87 cm.
      </p>

      <h2 id="calc-fabric" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Calculate Fabric Length
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Radial cutting dimension F = L + R + A. Yardage still depends on width
        and how pieces nest on the bolt.
      </p>

      <h2 id="how-much" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How Much Fabric Do You Need?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Full circles often need roughly a square of side 2(R+L). Narrow fabric
        may force seams or panels.
      </p>

      <h2 id="width" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How Fabric Width Affects Cutting
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        If width is less than the needed span, the calculator warns that a
        simple single-piece layout is not supported.
      </p>

      <h2 id="layout" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Circle Skirt Pattern Layout
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Fold fabric to match the sector, mark center, draw R and R+L arcs, then
        cut. Grain and nap affect drape.
      </p>

      <h2 id="compare" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Full Circle vs. Half Circle Skirts
      </h2>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[28rem] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs text-muted-foreground">
              <th className="py-2 pr-3 font-medium">Skirt type</th>
              <th className="py-2 pr-3 font-medium">Fraction</th>
              <th className="py-2 font-medium">Fullness</th>
            </tr>
          </thead>
          <tbody className="text-foreground/90">
            <tr className="border-b border-border/60">
              <td className="py-1.5 pr-3">Full</td>
              <td className="py-1.5 pr-3">100%</td>
              <td className="py-1.5">Very full</td>
            </tr>
            <tr className="border-b border-border/60">
              <td className="py-1.5 pr-3">3/4</td>
              <td className="py-1.5 pr-3">75%</td>
              <td className="py-1.5">Full</td>
            </tr>
            <tr className="border-b border-border/60">
              <td className="py-1.5 pr-3">Half</td>
              <td className="py-1.5 pr-3">50%</td>
              <td className="py-1.5">Moderate</td>
            </tr>
            <tr>
              <td className="py-1.5 pr-3">Quarter</td>
              <td className="py-1.5 pr-3">25%</td>
              <td className="py-1.5">Light</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="chart" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Circle Skirt Measurement Chart
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        For any waist W and length L, compute R from the fraction table above,
        then R_outer = R+L. Use the calculator for exact Math.PI values.
      </p>

      <h2 id="seam" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Add Seam Allowance
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Enter waist seam allowance in advanced options. It increases cutting
        length without changing finished R derived from W.
      </p>

      <h2 id="hem" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Add Hem Allowance
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Add hem allowance for turn-up or binding; finish after bias drop when
        needed.
      </p>

      <h2 id="cut" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Cut a Circle Skirt
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Mark the center, swing R and R+L, cut the sector, and transfer notches
        for seams or zippers.
      </p>

      <h2 id="sew" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Sew a Circle Skirt
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Join seams, attach waistband or elastic, hang the skirt, then level and
        finish the hem.
      </p>

      <h2 id="mistakes" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Common Circle Skirt Sewing Mistakes
      </h2>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-foreground/90">
        <li>Forgetting allowances on cutting only</li>
        <li>Ignoring fabric width limits</li>
        <li>Hemming before the bias settles</li>
        <li>Using f incorrectly for the chosen style</li>
      </ul>

      <h2 id="example" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Circle Skirt Calculator Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Half circle, waist 75 cm, length 70 cm, A=0: R = 75/π ≈ 23.87 cm;
        R_outer ≈ 93.87 cm; radial cut ≈ 93.87 cm; hem ≈ π×93.87 cm.
      </p>

      <h2 id="related" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Related Calculators
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Related sewing and apparel tools appear from the catalog when
        developed — see{' '}
        <Link href="/tools" className="font-medium text-primary hover:underline">
          Omega Calculators
        </Link>
        .
      </p>

      <h2 id="cs-faq" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion faqs={[...CIRCLE_SKIRT_FAQS]} />
      </div>
    </article>
  );
}
