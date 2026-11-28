import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { HAT_SIZE_FAQS } from './content';

export function HatSizeGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Hat Size Calculator – Find Your Perfect Hat Size
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Convert head circumference into adult or children&apos;s hat sizes with
        US, UK, EU, and international mappings. Charts are illustrative —
        brands vary.
      </p>

      <h2 id="what" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        What Is a Hat Size Calculator?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A tool that matches measured head circumference to standard hat size
        charts.
      </p>

      <h2 id="how-calc" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Calculate Your Hat Size
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Measure circumference in cm or inches, choose adult or child, and read
        the recommended size.
      </p>

      <h2 id="measure" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Measure Head Circumference
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Place a soft tape above the eyebrows and ears, around the fullest back
        of the head, level and snug.
      </p>

      <h2 id="how-use" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Use the Hat Size Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Select Adult or Child, enter circumference, switch units if needed, and
        review the highlighted chart row.
      </p>

      <h2 id="adult-chart" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Adult Hat Size Chart
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Adult rows span about 52–64 cm with paired international, US, UK, and EU
        values.
      </p>

      <h2 id="child-chart" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Children&apos;s Hat Size Chart
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Age bands are approximate; circumference remains the primary sizing
        input.
      </p>

      <h2 id="intl" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Understanding International Hat Sizes
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Letter sizes (XS–XXXL) summarize circumference bands for quick shopping.
      </p>

      <h2 id="us" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        US Hat Size Conversion
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        US sizes use fractional numbers (for example 7¼). The chart—not a raw
        π formula—is authoritative here.
      </p>

      <h2 id="uk" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        UK Hat Size Conversion
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        UK sizes on this chart sit about ⅛ below the paired US size.
      </p>

      <h2 id="eu" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        European Hat Sizes
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        EU sizes typically equal head circumference in centimeters.
      </p>

      <h2 id="units" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Hat Size in Inches vs. Centimeters
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        1 in = 2.54 cm. Switching units preserves the physical measurement.
      </p>

      <h2 id="convert" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Convert Head Circumference to Hat Size
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Normalize to centimeters, then look up the matching chart row.
      </p>

      <h2 id="choose" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Choose the Right Hat Size
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Start from the chart, then confirm with brand fit notes and try-on when
        possible.
      </p>

      <h2 id="between" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        What to Do If You Are Between Hat Sizes
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This calculator recommends the next larger standard size and notes the
        between-size condition.
      </p>

      <h2 id="fit" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How Should a Hat Fit?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Level on the head, secure without pressure points, and stable when you
        move.
      </p>

      <h2 id="tight" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How Tight Should a Hat Be?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Snug enough to stay put; not so tight that it leaves marks or headaches.
      </p>

      <h2 id="no-tape" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Measure Hat Size Without a Measuring Tape
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Use non-stretch string, mark the loop, then measure against a ruler.
      </p>

      <h2 id="string" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Measure Hat Size Using String
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Keep the string level at the same landmarks as a tape measure.
      </p>

      <h2 id="baseball" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Measure Your Head for a Baseball Cap
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Same circumference method; fitted caps map to US fractions, while
        adjustables tolerate more variance.
      </p>

      <h2 id="fedora" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Measure Your Head for a Fedora
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Use the adult chart; structured felt may feel firmer than soft fabrics.
      </p>

      <h2 id="cowboy" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Measure Your Head for a Cowboy Hat
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Circumference still rules; check the maker for oval/long-oval options.
      </p>

      <h2 id="bucket" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Measure Your Head for a Bucket Hat
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Measure as usual; many bucket hats are sized loosely or adjustable.
      </p>

      <h2 id="kids" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Measure Hat Size for Children
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Measure circumference carefully; treat age labels as secondary.
      </p>

      <h2 id="mistakes" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Common Hat Sizing Mistakes
      </h2>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-foreground/90">
        <li>Measuring too high or too low on the head</li>
        <li>Pulling the tape too tight</li>
        <li>Ignoring brand charts</li>
        <li>Using age alone for children</li>
      </ul>

      <h2 id="material" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How Hat Material Affects Fit
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Knit and soft fabrics forgive more; stiff straw or felt feel closer to
        the chart size.
      </p>

      <h2 id="adjustable" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Adjustable vs. Fitted Hats
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Adjustable bands cover a range; fitted styles need accurate circumference.
      </p>

      <h2 id="shape" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Choose a Hat for Different Head Shapes
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Some makers offer round or long-oval crowns — circumference alone does
        not capture shape.
      </p>

      <h2 id="brands" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Why Hat Sizes Differ Between Brands
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Rounding rules, lasts, and materials differ by manufacturer.
      </p>

      <h2 id="online" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Tips for Buying Hats Online
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Compare your measurement to the product chart, check return policy, and
        prefer adjustable styles when between sizes.
      </p>

      <h2 id="limits" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Hat Size Calculator Limitations
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Does not model brand lasts, hair volume, or stretch. Charts are
        illustrative.
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

      <h2 id="hat-faq" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion faqs={[...HAT_SIZE_FAQS]} />
      </div>
    </article>
  );
}
