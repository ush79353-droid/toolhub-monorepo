import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { CHART_SOURCE } from './chart-data';
import { BELT_SIZE_FAQS } from './content';

export function BeltSizeGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Belt Size Calculator – Find Your Perfect Belt Size
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Estimate a recommended belt size from waist circumference, numerical or
        letter belt sizes, an existing belt measurement, or dress/pants labels —
        with inch and centimeter conversions. Woman/Man options select clothing
        chart categories, not identity restrictions.
      </p>

      <h2
        id="what"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is a Belt Size Calculator?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        It helps translate the measurement you already know into a nominal belt
        size suggestion using documented conventions. Exact length conversion
        (inches ↔ centimeters) is separate from approximate clothing-chart
        recommendations.
      </p>

      <h2
        id="how-know"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Do I Know What Belt Size to Buy?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Choose the method that matches your data: body waist at the belt line,
        a pants or dress label, a belt you already wear (fastening point to used
        hole), or a known numerical/letter size. Then confirm on the brand’s
        size chart before ordering.
      </p>

      <h2
        id="how-sizes"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Belt Sizes Work
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Brands may print even inch sizes, centimeter labels, or letter sizes
        (XXS–XXXL). Nominal size often relates to fastening-point-to-hole length,
        not the full tip-to-tip strap.
      </p>

      <h2
        id="mens-chart"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Men&apos;s Belt Size Chart
      </h2>
      <p className="mt-2 text-xs text-muted-foreground">{CHART_SOURCE}</p>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[28rem] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs text-muted-foreground">
              <th className="py-2 pr-3 font-medium">Belt (in)</th>
              <th className="py-2 pr-3 font-medium">General</th>
              <th className="py-2 font-medium">Approx. waist (cm)</th>
            </tr>
          </thead>
          <tbody className="text-foreground/90">
            <tr className="border-b border-border/60">
              <td className="py-1.5 pr-3">28–30</td>
              <td className="py-1.5 pr-3">XS–S</td>
              <td className="py-1.5">66–78</td>
            </tr>
            <tr className="border-b border-border/60">
              <td className="py-1.5 pr-3">32–34</td>
              <td className="py-1.5 pr-3">S–M</td>
              <td className="py-1.5">78–88</td>
            </tr>
            <tr className="border-b border-border/60">
              <td className="py-1.5 pr-3">36–38</td>
              <td className="py-1.5 pr-3">L</td>
              <td className="py-1.5">88–98</td>
            </tr>
            <tr>
              <td className="py-1.5 pr-3">40–44</td>
              <td className="py-1.5 pr-3">XL–XXXL</td>
              <td className="py-1.5">98–118</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2
        id="womens-chart"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Women&apos;s Belt Size Chart
      </h2>
      <p className="mt-2 text-xs text-muted-foreground">{CHART_SOURCE}</p>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[28rem] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs text-muted-foreground">
              <th className="py-2 pr-3 font-medium">Belt (in)</th>
              <th className="py-2 pr-3 font-medium">General</th>
              <th className="py-2 font-medium">Approx. waist (cm)</th>
            </tr>
          </thead>
          <tbody className="text-foreground/90">
            <tr className="border-b border-border/60">
              <td className="py-1.5 pr-3">26–28</td>
              <td className="py-1.5 pr-3">XXS–XS</td>
              <td className="py-1.5">58–70</td>
            </tr>
            <tr className="border-b border-border/60">
              <td className="py-1.5 pr-3">30–32</td>
              <td className="py-1.5 pr-3">S–M</td>
              <td className="py-1.5">70–82</td>
            </tr>
            <tr className="border-b border-border/60">
              <td className="py-1.5 pr-3">34–36</td>
              <td className="py-1.5 pr-3">L–XL</td>
              <td className="py-1.5">82–94</td>
            </tr>
            <tr>
              <td className="py-1.5 pr-3">38–40</td>
              <td className="py-1.5 pr-3">XXL–XXXL</td>
              <td className="py-1.5">94–108</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2
        id="measure-waist"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Measure Waist Circumference
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Wrap a soft tape around the position where you normally wear the belt —
        often at the hips for low-rise pants or nearer the natural waist for
        high-rise styles. Keep the tape snug but not tight. This calculator
        matches direct circumference to the chart without automatically adding 2
        inches.
      </p>

      <h2
        id="measure-belt"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Measure an Existing Belt
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Lay the belt flat. Measure from the buckle fastening point or prong to
        the hole you use most. That length approximates nominal size for many
        brands. Do not use overall tip-to-tip length as the size label.
      </p>

      <h2
        id="vs-pants"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Belt Size vs. Pants Size
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Pants size is a garment label; belt size is a strap convention. For
        men&apos;s inch pants labels, B ≈ P + 2 is a widely cited rule of thumb —
        not a law. Rise, fabric bulk, and brand grading change the sweet spot.
      </p>

      <h2
        id="numerical"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Numerical Belt Sizes
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Inch sizes (28, 30, 32…) and centimeter sizes (70, 80, 85…) are exact
        unit conversions when they refer to the same physical length: 1 in =
        2.54 cm. Chart letter mapping is approximate.
      </p>

      <h2
        id="general"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        General Belt Sizes
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        XXS through XXXL are letter bands. This tool returns the chart&apos;s
        numerical range for a letter rather than inventing a single exact
        measurement when the chart spans a band.
      </p>

      <h2
        id="dress"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Women&apos;s Dress Size to Belt Size
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Dress numbers (US, UK, EU, International) map to estimated waist ranges,
        then to belt suggestions. Do not apply the men&apos;s pants +2 formula
        to dress numbers. Treat results as approximate.
      </p>

      <h2
        id="pants"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Men&apos;s Pants Size to Belt Size
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        B ≈ P + 2 (inches)
      </p>
      <p className="mt-2 text-sm text-foreground/90">
        Example: pants 32 → estimated belt 34 in (86.36 cm). Round to the
        nearest chart size.
      </p>

      <h2
        id="systems"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        US vs. UK vs. EU Belt Sizes
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Clothing-system labels differ even when waist circumference is similar.
        Convert physical length with 2.54; convert clothing labels with
        system-specific charts. EU listings often emphasize centimeters.
      </p>

      <h2
        id="convert"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Convert Belt Sizes
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        cm = in × 2.54 · in = cm ÷ 2.54 · 1 ft = 30.48 cm · 1 cm = 10 mm
      </p>

      <h2
        id="choose"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Choose the Right Belt Length
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Aim for a preferred hole near the middle of the hole set, leave room for
        thicker clothing, and match buckle style to the outfit. When between
        sizes, many people choose the larger belt.
      </p>

      <h2
        id="extra"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Much Extra Length Should a Belt Have?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Nominal size is not the same as dangling strap beyond the buckle.
        Extra strap past the fastening hole is styling and comfort — separate
        from the pants-label +2 heuristic.
      </p>

      <h2
        id="types"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Types of Belts
      </h2>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-foreground/90">
        <li>Dress belts — thinner, formal buckles</li>
        <li>Casual belts — wider straps, varied materials</li>
        <li>Leather belts — stretch and break-in over time</li>
        <li>Fabric / web belts — often more adjustable</li>
        <li>Adjustable / track belts — micro-fit without fixed holes</li>
        <li>Waist / fashion belts — may follow dress sizing more than pants</li>
      </ul>

      <h2
        id="mistakes"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Common Belt Sizing Mistakes
      </h2>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-foreground/90">
        <li>Measuring the entire belt tip-to-tip</li>
        <li>Confusing pants labels with body circumference</li>
        <li>Trusting letter sizes without a brand chart</li>
        <li>Ignoring clothing thickness and rise</li>
        <li>Mixing up inches and centimeters</li>
      </ul>

      <h2
        id="how-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use the Belt Size Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Select Woman or Man for the clothing chart category.</li>
        <li>Choose what you know (numerical, general, waist, existing belt, or dress/pants).</li>
        <li>Enter the value and unit or clothing system.</li>
        <li>Read the recommended size, equivalents, and warnings.</li>
        <li>Verify against the brand before purchase.</li>
      </ol>

      <h2
        id="limits"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations of Belt Size Calculators
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Charts are illustrative consolidations. Brands grade differently;
        stretch, buckle geometry, and personal fit preference matter. Exact unit
        math is precise; clothing mappings remain approximate.
      </p>

      <h2
        id="related"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related Calculators
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Explore other body and apparel tools on{' '}
        <Link href="/tools" className="font-medium text-primary hover:underline">
          Omega Calculators
        </Link>{' '}
        when they are developed and published — related tools load dynamically
        from the catalog when available.
      </p>

      <h2
        id="belt-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion faqs={[...BELT_SIZE_FAQS]} />
      </div>
    </article>
  );
}
