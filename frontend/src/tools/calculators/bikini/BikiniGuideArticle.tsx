import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { BIKINI_FAQS } from './content';

export function BikiniGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Bikini Calculator – Find Bikini Styles for Your Body Shape
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Explore approximate proportion categories from bust, waist, high-hip,
        and hip measurements, then review optional bikini top and bottom ideas.
        Categories are styling references — not beauty standards. Measurements
        are processed in your browser and are not stored by this tool.
      </p>

      <h2 id="what" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        What Is a Bikini Calculator?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        It helps you translate four circumferences into documented heuristic
        labels and non-prescriptive style suggestions so shopping feels more
        informed — never mandatory.
      </p>

      <h2 id="how-works" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How Does the Bikini Calculator Work?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Inputs convert to centimeters. The engine computes bust-to-hip,
        waist-to-hip, and waist-to-bust ratios plus bust/hip, high-hip, and
        waist-definition differences, then applies a priority-ordered rule set
        (see calculation steps in the results panel).
      </p>

      <h2 id="measure" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Measure Your Body for a Bikini
      </h2>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-foreground/90">
        <li>Bust — fullest part, tape level</li>
        <li>Waist — natural narrowest torso point</li>
        <li>High hip — below waist, above fullest hip</li>
        <li>Hip — fullest hips and buttocks</li>
      </ul>

      <h2 id="categories" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Understanding Body Shape Categories
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Labels such as hourglass, spoon, or rectangle overlap. Mixed
        proportions are valid. No category is better than another.
      </p>

      <h2 id="hourglass" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        What Is an Hourglass Body Shape?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Here: bust and hip relatively similar with a more defined waist under
        documented thresholds.
      </p>

      <h2 id="hourglass-styles" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Best Bikinis for an Hourglass Shape
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Many cuts work. Adjustable halters, underwire or balconette tops, and
        classic, high-waisted, high-leg, or tie-side bottoms are common
        optional starting points — choose by support and coverage preference.
      </p>

      <h2 id="top-hourglass" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Best Bikinis for a Top Hourglass Shape
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Prioritize support and strap comfort up top; bottoms can be classic,
        patterned, high-waisted, or adjustable.
      </p>

      <h2 id="bottom-hourglass" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Best Bikinis for a Bottom Hourglass Shape
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Comfortable hip coverage (high-waisted or classic briefs) plus tops you
        enjoy — bandeau, ruffle, print, or halter — remain optional choices.
      </p>

      <h2 id="spoon" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Best Bikinis for a Spoon Shape
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        High-waisted or wider-side bottoms often feel steady when the high-hip
        is fuller; structured or adjustable tops help with security.
      </p>

      <h2 id="triangle" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Best Bikinis for a Triangle Shape
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Hip-focused bottoms with adjustable sides, plus tops with print or
        structure if you want more upper interest — always optional.
      </p>

      <h2 id="inverted" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Best Bikinis for an Inverted Triangle Shape
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Bust is only a proxy for upper width. Adjustable triangles, scoop
        necks, and wide straps are support-oriented options; patterned or
        ruffled bottoms are styling choices.
      </p>

      <h2 id="rectangle" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Best Bikinis for a Rectangle Shape
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Texture, wrap tops, high-waisted rises, and ruched bottoms can add
        interest if desired — comfort still comes first.
      </p>

      <h2 id="tops" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Bikini Tops Explained
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Triangle, halter, bandeau, balconette, underwire, scoop neck, and sport
        tops differ in coverage, lift, and security. Match construction to
        activity more than to a shape name.
      </p>

      <h2 id="bottoms" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Bikini Bottoms Explained
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        High-waisted, high-leg, classic, full coverage, tie-side, boyshort, and
        ruched designs change coverage and mobility — pick what feels right.
      </p>

      <h2 id="coverage" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Choose Bikini Coverage
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Coverage is personal. Use optional filters here only to reorder ideas,
        not to judge appropriateness.
      </p>

      <h2 id="support" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Choose a Supportive Bikini Top
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Look for stable bands, adjustable straps, and cup construction suited
        to swimming or sports when you need more hold.
      </p>

      <h2 id="choose-bottoms" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Choose Bikini Bottoms
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Prioritize hip comfort, rise height, and whether ties or fixed sides
        suit your day.
      </p>

      <h2 id="shape-vs-size" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Body Shape vs. Bikini Size
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Shape labels describe relative proportions. Garment size comes from
        brand charts and construction — they are not the same thing.
      </p>

      <h2 id="find-size" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Find Your Bikini Size
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Compare your measurements to the seller’s size guide. Mix top and
        bottom sizes when needed.
      </p>

      <h2 id="fit-problems" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Common Bikini Fit Problems
      </h2>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-foreground/90">
        <li>Tight bands or digging waistbands</li>
        <li>Loose straps or cup gaping</li>
        <li>Bottoms slipping or riding up</li>
        <li>Insufficient support for activity</li>
      </ul>

      <h2 id="how-use" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Use the Bikini Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Measure bust, waist, high hip, and hip.</li>
        <li>Enter values in cm or in.</li>
        <li>Optionally set coverage, support, style, and activity.</li>
        <li>Read the heuristic category and style ideas.</li>
        <li>Check brand size charts before buying.</li>
      </ol>

      <h2 id="limits" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Bikini Calculator Limitations
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Heuristics are approximate; bust is not shoulder width; brands grade
        differently; personal style always overrides labels.
      </p>

      <h2 id="related" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Related Calculators
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Related developed tools appear from the catalog when available — see{' '}
        <Link href="/tools" className="font-medium text-primary hover:underline">
          Omega Calculators
        </Link>
        .
      </p>

      <h2 id="bikini-faq" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion faqs={[...BIKINI_FAQS]} />
      </div>
    </article>
  );
}
