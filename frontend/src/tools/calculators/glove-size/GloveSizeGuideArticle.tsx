import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { GLOVE_SIZE_FAQS } from './content';

export function GloveSizeGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Glove Size Calculator – Find Your Glove Size by Hand Measurement
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Estimate glove size from palm circumference using illustrative
        men/unisex and women&apos;s charts. Brands and product types vary —
        always confirm with the seller&apos;s guide.
      </p>

      <h2 id="what" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        What Is a Glove Size Calculator?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A tool that maps hand circumference to a reference size chart and can
        reverse-lookup ranges from a size label.
      </p>

      <h2 id="how" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How Does the Glove Size Calculator Work?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Convert your measurement to centimeters, select a style chart, and find
        the matching circumference interval.
      </p>

      <h2 id="measure-size" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Measure Glove Size
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Measure palm circumference, then compare to the product chart — not only
        a letter remembered from another brand.
      </p>

      <h2 id="circ" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Measure Hand Circumference
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Soft tape around the widest palm, below knuckles, thumb out.
      </p>

      <h2 id="where" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Where Should You Measure Your Hand?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Across the palm just below the knuckles — not around the knuckles
        themselves or including the thumb.
      </p>

      <h2 id="no-tape" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Measure Your Hand Without a Measuring Tape
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Use string or paper, mark the loop, then measure the mark with a ruler.
      </p>

      <h2 id="determine" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Determine Your Glove Size
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Match circumference to the chart for the glove type you are buying.
      </p>

      <h2 id="men" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Men&apos;s Glove Size Chart
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This calculator&apos;s men/unisex chart runs XS–XXL with paired numeric
        labels — see the interactive table in the calculator.
      </p>

      <h2 id="women" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Women&apos;s Glove Size Chart
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The women&apos;s chart uses different cm ranges for the same letters
        (XS–XL here).
      </p>

      <h2 id="numeric" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Understanding Numeric Glove Sizes
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Some systems approximate circumference in inches. Numeric labels here
        are chart-defined — not a universal formula for every glove.
      </p>

      <h2 id="alpha" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Understanding XS, S, M, L, XL, and XXL
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Letter sizes are relative to each chart&apos;s ranges — M on one chart
        is not M on another.
      </p>

      <h2 id="convert" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Convert Hand Circumference Into Glove Size
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        Find size where min ≤ C &lt; max (last size includes max)
      </p>

      <h2 id="units" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Glove Sizes in Inches and Centimeters
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        1 in = 2.54 cm. Switching units must not change the physical size.
      </p>

      <h2 id="reverse" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Convert Glove Size to Hand Measurement
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Use the reverse section for min, max, and midpoint of a chart size.
      </p>

      <h2 id="fit" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Choose the Correct Glove Fit
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Match use case: dexterity, insulation, protection, or fashion each
        prefer different ease.
      </p>

      <h2 id="tight" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How Tight Should Gloves Fit?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Fingers should reach the tips without excess bagging; circulation should
        not be cut off.
      </p>

      <h2 id="between" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Should You Size Up or Down Between Glove Sizes?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Stretch leather may go smaller; liners and bulk often need larger.
      </p>

      <h2 id="material" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Does Glove Material Affect Sizing?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Yes — knits stretch; stiff leather and hard shells do not.
      </p>

      <h2 id="leather" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Leather Glove Sizing
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Often starts snug and eases with wear — follow the leather brand chart.
      </p>

      <h2 id="winter" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Winter Glove Sizing
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Insulation needs space; do not size only from a thin dress-glove chart.
      </p>

      <h2 id="work" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Work Glove Sizing
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Grip and safety matter — use the PPE manufacturer&apos;s instructions.
      </p>

      <h2 id="moto" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Motorcycle Glove Sizing
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Control and knuckle armor fit are brand-specific.
      </p>

      <h2 id="cycle" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Cycling Glove Sizing
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Palm pads and stretch backs change perceived size.
      </p>

      <h2 id="disp" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Disposable Glove Sizing
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Medical/exam gloves use their own S–XL charts — do not assume winter
        sizes transfer.
      </p>

      <h2 id="sports" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Sports Glove Sizing
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Sport-specific lasts (golf, batting, goalkeeper) need that sport&apos;s
        chart.
      </p>

      <h2 id="kids" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Children&apos;s Glove Sizing – Important Differences
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Kids&apos; charts are age/hand-length based more often — this adult
        circumference tool is not a children&apos;s chart.
      </p>

      <h2 id="mistakes" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Common Glove Measurement Mistakes
      </h2>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-foreground/90">
        <li>Including the thumb</li>
        <li>Measuring over knuckles</li>
        <li>Pulling the tape too tight</li>
        <li>Ignoring brand charts</li>
      </ul>

      <h2 id="brands" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Why Glove Sizes Differ Between Brands
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Different grading, ease, and intended use change letter labels.
      </p>

      <h2 id="online" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Tips for Buying Gloves Online
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Measure, compare the seller chart, read fit notes, and check returns.
      </p>

      <h2 id="limits" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Glove Size Calculator Limitations
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        No finger-length model, no brand lasts, no PPE certification — illustrative
        chart only.
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

      <h2 id="gs-faq" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion faqs={[...GLOVE_SIZE_FAQS]} />
      </div>
    </article>
  );
}
