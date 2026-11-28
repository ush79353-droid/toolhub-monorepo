import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { JACKET_SIZE_FAQS } from './content';

export function JacketSizeGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Jacket Size Calculator – Find Your Jacket Size
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Estimate men&apos;s and women&apos;s jacket sizes from chest
        circumference and height, with US, UK, EU, and international
        equivalents. Charts are illustrative — brands vary.
      </p>

      <h2 id="what" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        What Is a Jacket Size Calculator?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A tool that matches body measurements to jacket size charts and shows
        regional labels.
      </p>

      <h2 id="how" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How Does a Jacket Size Calculator Work?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        It normalizes chest (and optional height/hips) to centimeters, finds the
        chart band, and returns paired size labels — not a single universal
        formula.
      </p>

      <h2 id="use" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Use the Jacket Size Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Choose men&apos;s or women&apos;s chart, enter chest and height, then
        review the highlighted size and alternatives.
      </p>

      <h2 id="measure" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Measure Jacket Size
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Use body circumference for the chest, not flat garment width, unless you
        deliberately convert garment specs.
      </p>

      <h2 id="chest" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Measure Your Chest
      </h2>
      <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm text-foreground/90">
        <li>Stand naturally with arms relaxed.</li>
        <li>Wrap a soft tape around the fullest part of the chest.</li>
        <li>Keep the tape level across the back.</li>
        <li>Avoid pulling too tightly; breathe normally.</li>
        <li>Record and enter the circumference.</li>
      </ol>

      <h2 id="height" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Measure Your Height
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Barefoot against a wall, mark the crown, measure floor to mark.
      </p>

      <h2 id="hips" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Measure Your Hips
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Tape around the fullest hip, level and snug — helpful for long jackets
        and coats.
      </p>

      <h2 id="mens" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Men&apos;s Jacket Size Chart
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Numerical US/UK sizes with EU and letter equivalents by chest band —
        shown live in the calculator.
      </p>

      <h2 id="womens" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Women&apos;s Jacket Size Chart
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Bust-based bands with separate US, UK, EU, and international labels.
      </p>

      <h2 id="eu" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        European Jacket Size Chart
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        EU numbers are chart pairs (e.g. men&apos;s 50 with US 40), not raw chest
        cm.
      </p>

      <h2 id="us" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        US Jacket Size Chart
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Men&apos;s suit-style numbers and women&apos;s even sizes appear in the
        US column.
      </p>

      <h2 id="uk" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        UK Jacket Size Chart
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Men&apos;s UK matches US numbers here; women&apos;s UK runs higher than
        US.
      </p>

      <h2 id="intl" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        International Jacket Size Conversion
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Letter sizes summarize chest bands for quick shopping across regions.
      </p>

      <h2 id="us-eu" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Convert US Jacket Sizes to EU Sizes
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Read the paired EU value on the same chart row — conversions are
        approximate.
      </p>

      <h2 id="uk-us" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Convert UK Jacket Sizes to US Sizes
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Use the chart columns; do not assume women&apos;s UK equals US.
      </p>

      <h2 id="by-chest" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Jacket Size Based on Chest Measurement
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Chest circumference is the primary driver of numerical/letter size here.
      </p>

      <h2 id="by-height" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Jacket Size Based on Height
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Height informs short/regular/long length — it does not replace chest
        sizing.
      </p>

      <h2 id="length" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        What Is Jacket Length Classification?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Short, regular, and long grades adjust sleeve and body length for
        height.
      </p>

      <h2 id="srl" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Short vs. Regular vs. Long Jackets
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Illustrative men&apos;s bands: short &lt;170 cm, regular ≤183 cm, long
        above. Women&apos;s thresholds are slightly lower.
      </p>

      <h2 id="choose-fit" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Choose the Right Jacket Fit
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Match silhouette preference and layering needs, then verify on the brand
        chart.
      </p>

      <h2 id="fit-types" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Slim Fit vs. Regular Fit vs. Relaxed Fit
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Fit preference here is advisory guidance — it does not auto-bump the
        chart size.
      </p>

      <h2 id="room" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How Much Room Should a Jacket Have?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Enough ease to move and button without strain; exact ease is
        brand-specific.
      </p>

      <h2 id="vs-shirt" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Jacket Size vs. Shirt Size
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Different systems — do not assume they match.
      </p>

      <h2 id="vs-coat" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Jacket Size vs. Coat Size
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Coats may size up for layers; use outerwear notes when shopping coats.
      </p>

      <h2 id="suit" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Measure a Suit Jacket
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Body chest sets the size; shoulders and length refine the try-on.
      </p>

      <h2 id="casual" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Measure a Casual Jacket
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Same chest method; casual cuts often run roomier than suit jackets.
      </p>

      <h2 id="existing" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Measure an Existing Jacket
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Flat chest width ×2 approximates garment circumference — not identical
        to body charts.
      </p>

      <h2 id="online" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Find Your Jacket Size Without Trying It On
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Compare your body measurements to the product chart and check the return
        policy.
      </p>

      <h2 id="mistakes" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Common Jacket Sizing Mistakes
      </h2>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-foreground/90">
        <li>Using flat width as circumference</li>
        <li>Ignoring brand charts</li>
        <li>Assuming men&apos;s and women&apos;s ladders match</li>
        <li>Choosing length from chest alone</li>
      </ul>

      <h2 id="buy" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Tips for Buying Jackets Online
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Match the product chart, note fabric stretch, and prefer free returns
        when between sizes.
      </p>

      <h2 id="between" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        What to Do When Between Jacket Sizes
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Compare both nearby sizes; size up for layering, size closer for slim
        looks.
      </p>

      <h2 id="brands" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Jacket Sizing Differences Between Brands
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Ease, block, and vanity sizing differ — chart labels are approximate.
      </p>

      <h2 id="limits" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Jacket Size Calculator Limitations
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Does not model brand lasts, stretch, or shoulder shape. Fit preference
        does not auto-change size.
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

      <h2 id="jacket-faq" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion faqs={[...JACKET_SIZE_FAQS]} />
      </div>
    </article>
  );
}
