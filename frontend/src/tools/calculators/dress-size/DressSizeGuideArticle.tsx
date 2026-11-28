import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { DRESS_SIZE_FAQS } from './content';

export function DressSizeGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Dress Size Calculator – Find Your Dress Size
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Estimate a starting dress size from bust, waist, and hip measurements
        using an illustrative US / UK / EU / international chart. Brands are not
        standardized — always confirm with the seller&apos;s size guide.
      </p>

      <h2 id="what-calc" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        What Is a Dress Size Calculator?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A tool that maps body circumferences to a published size chart and shows
        related international labels.
      </p>

      <h2 id="how-calc" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Calculate Your Dress Size
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Match each measurement to the chart, then choose the smallest size whose
        maximum bust, waist, and hips all fit your body.
      </p>

      <h2 id="what-meas" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        What Measurements Are Needed for Dress Sizing?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Bust, waist, and hips are the core trio for most women&apos;s dress
        charts.
      </p>

      <h2 id="bust" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Measure Your Bust
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Stand upright, wrap the tape around the fullest part of the bust, keep
        it level, and avoid over-tightening.
      </p>

      <h2 id="waist" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Measure Your Waist
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Find the natural waist, wrap level, breathe normally, and record.
      </p>

      <h2 id="hips" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Measure Your Hips
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Feet together; measure the fullest hip/seat circumference parallel to
        the floor.
      </p>

      <h2 id="chart" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Women&apos;s Dress Size Chart
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The interactive chart in the calculator lists US, UK, EU, international
        labels, and cm/in ranges for bust, waist, and hips.
      </p>

      <h2 id="us" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        US Dress Size Chart
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Numeric US sizes on this chart run from 0 through 24 in even steps.
      </p>

      <h2 id="uk" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        UK Dress Size Chart
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        UK labels on this chart are paired with each US row (for example US 8 →
        UK 12 here).
      </p>

      <h2 id="eu" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        European Dress Size Chart
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        EU numeric sizes are read from the same row — not by adding a constant
        to every size.
      </p>

      <h2 id="int" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        International Dress Size Chart
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Letter sizes (XXS–3XL) on this chart are approximate bands spanning one
        or two numeric sizes.
      </p>

      <h2 id="convert" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Convert Dress Sizes Between Countries
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Prefer a conversion table over arithmetic shortcuts. This calculator
        shows all labels from one chart entry.
      </p>

      <h2 id="find" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Find Your Dress Size Using Measurements
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        Pick smallest size s with B ≤ Bmax(s), W ≤ Wmax(s), H ≤ Hmax(s)
      </p>

      <h2 id="mixed" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        What to Do When Your Bust, Waist, and Hip Sizes Differ
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Start with the larger accommodating size for fitted styles; consider
        stretch, cut, or tailoring. Differing measures are normal.
      </p>

      <h2 id="body-vs-garment" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        What Is the Difference Between Body Measurements and Garment Measurements?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Body charts describe you; garment charts describe the finished clothing
        (often with ease).
      </p>

      <h2 id="stretch" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How Fabric Stretch Affects Dress Size
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Knit and stretch fabrics may feel fine in a closer size; woven non-stretch
        usually needs true ease.
      </p>

      <h2 id="style" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How Dress Style Affects Fit
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Sheaths, wrap dresses, and A-lines place ease differently — silhouette
        matters as much as the number on the tag.
      </p>

      <h2 id="online" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Choose a Dress Size When Shopping Online
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Use the brand chart, compare garment measures, read fit notes, and check
        returns.
      </p>

      <h2 id="solo" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Measure Yourself Without Assistance
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Use a mirror, keep the tape level, and measure twice.
      </p>

      <h2 id="mistakes" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Common Dress Sizing Mistakes
      </h2>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-foreground/90">
        <li>Using old measurements</li>
        <li>Pulling the tape too tight</li>
        <li>Ignoring brand charts</li>
        <li>Assuming US/UK labels are universal</li>
      </ul>

      <h2 id="between" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Choose Between Two Dress Sizes
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Prefer the size that fits the largest of bust/waist/hips for fitted
        dresses; size for comfort and alterations.
      </p>

      <h2 id="petite" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Understanding Petite, Tall, and Regular Dress Sizes
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Length grades change proportions; circumference may still follow the
        same numeric chart.
      </p>

      <h2 id="plus" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Understanding Plus-Size Dress Charts
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Extended ranges continue larger circumferences. Outside this chart,
        check the brand&apos;s plus guide — we do not invent sizes.
      </p>

      <h2 id="brand" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Read a Brand-Specific Size Chart
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Note whether the table is body or garment based, which units it uses,
        and whether sizes are country-labeled.
      </p>

      <h2 id="examples" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Dress Size Calculation Examples
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Example: bust 96 cm, waist 78 cm, hips 102 cm → overall US 12 / UK 16 /
        EU 44 / M on this chart (waist drives above US 10). Mixed example: 91 /
        75 / 104 cm → US 12 overall.
      </p>

      <h2 id="tips" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Practical Tips for Choosing a Comfortable Dress
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Prioritize comfort and movement, check fabric, and treat calculator
        output as a starting estimate.
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

      <h2 id="ds-faq" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion faqs={[...DRESS_SIZE_FAQS]} />
      </div>
    </article>
  );
}
