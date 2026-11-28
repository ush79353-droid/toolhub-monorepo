import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { JEANS_SIZE_FAQS } from './content';

export function JeansSizeGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Jeans Size Calculator – Find Your Perfect Jeans Size
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Find jeans size using waist and inseam measurements, with men&apos;s and
        women&apos;s sizing charts and international conversions. Charts are
        illustrative — brands vary.
      </p>

      <h2 id="what" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        What Is a Jeans Size Calculator?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A tool that maps waist and inseam to W×L labels and regional
        equivalents.
      </p>

      <h2 id="how" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How Does a Jeans Size Calculator Work?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        It normalizes measurements to centimeters, matches chart bands, and
        picks the nearest inseam length code.
      </p>

      <h2 id="use" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Use the Jeans Size Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Choose women&apos;s or men&apos;s chart, body or existing-jeans mode,
        enter waist and inseam, then review W×L and alternatives.
      </p>

      <h2 id="measure" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Measure Your Jeans Size
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Use soft tape for body waist and inseam, or measure a fitting pair laid
        flat.
      </p>

      <h2 id="waist" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Measure Your Waist for Jeans
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Measure where the waistband will sit for your preferred rise.
      </p>

      <h2 id="inseam" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Measure Jeans Inseam Length
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        From crotch seam to hem along the inside leg — not the outseam.
      </p>

      <h2 id="existing" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Measure an Existing Pair of Jeans
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Flat waistband width and inseam; approximate circumference = 2 × flat
        width.
      </p>

      <h2 id="body-vs" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Body Waist vs. Jeans Waistband Measurement
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        They are not the same — stretch and vanity sizing change the
        relationship.
      </p>

      <h2 id="wl" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        What Do W and L Mean in Jeans?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        W is the nominal waist designation; L is the nominal inseam length.
      </p>

      <h2 id="calc-w" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Calculate Jeans Waist Size
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Match waist cm to the selected chart band for a W label.
      </p>

      <h2 id="calc-l" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Calculate Jeans Length
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Match inseam to the nearest L28–L38 option and note nearby lengths.
      </p>

      <h2 id="mens" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Men&apos;s Jeans Size Chart
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Nominal W sizes with body waist cm/in ranges — shown live in results.
      </p>

      <h2 id="womens" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Women&apos;s Jeans Size Chart
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Waist bands with US, UK, EU, and international labels.
      </p>

      <h2 id="us" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        US Jeans Size Chart
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Women&apos;s numeric US sizes pair with W labels; men&apos;s often use W
        directly.
      </p>

      <h2 id="uk" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        UK Jeans Size Chart
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Women&apos;s UK runs higher than US on this chart; men&apos;s often share
        W numbers.
      </p>

      <h2 id="eu" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        European Jeans Size Chart
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        EU numbers are chart pairs — approximate across brands.
      </p>

      <h2 id="intl" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        International Jeans Size Conversion
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Letter sizes summarize waist bands for quick comparison.
      </p>

      <h2 id="convert-w" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Convert Women&apos;s Jeans Sizes
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Use the same chart row for US/UK/EU/W — do not invent a single formula.
      </p>

      <h2 id="convert-m" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Convert Men&apos;s Jeans Sizes
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Men&apos;s retail often stays on W×L inch labels internationally.
      </p>

      <h2 id="units" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Jeans Waist Size in Inches and Centimeters
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        cm = in × 2.54 · in = cm / 2.54
      </p>

      <h2 id="what-inseam" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        What Is Jeans Inseam?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The inside-leg length from crotch to hem.
      </p>

      <h2 id="rise" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        What Is Jeans Rise?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The distance from crotch to waistband — it changes where you measure
        waist.
      </p>

      <h2 id="rise-types" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Low-Rise vs. Mid-Rise vs. High-Rise Jeans
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Low sits below the natural waist; high sits at or above it; mid is a
        common default.
      </p>

      <h2 id="fits" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Skinny vs. Slim vs. Straight Jeans
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Fit preference is advisory here — it does not auto-change W.
      </p>

      <h2 id="regular" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Regular vs. Relaxed Fit Jeans
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Relaxed adds room in seat and thigh versus a balanced regular cut.
      </p>

      <h2 id="choose-l" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Choose the Correct Jeans Length
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Match inseam; between lengths, prefer stacking vs. showing ankle.
      </p>

      <h2 id="height" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Jeans Length Based on Height
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Height is a rough hint only — measure inseam for accuracy.
      </p>

      <h2 id="between" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        What to Do When Between Jeans Sizes
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Compare neighboring W and L options; stretch fabrics often favor the
        closer fit.
      </p>

      <h2 id="brands" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How Jeans Sizing Differs Between Brands
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Blocks, stretch, and vanity sizing differ — always check the product
        guide.
      </p>

      <h2 id="vanity" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Understanding Vanity Sizing
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Labeled sizes may run larger than historical body measures.
      </p>

      <h2 id="vs-pants" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Jeans Size vs. Pants Size
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Related but not identical — dress pants and jeans use different
        conventions.
      </p>

      <h2 id="buy" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Tips for Buying Jeans Online
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Compare the brand chart, note fabric stretch %, and check return policy.
      </p>

      <h2 id="mistakes" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Common Jeans Measurement Mistakes
      </h2>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-foreground/90">
        <li>Measuring outseam instead of inseam</li>
        <li>Treating flat width as circumference</li>
        <li>Ignoring rise when measuring waist</li>
        <li>Assuming all brands share vanity sizing</li>
      </ul>

      <h2 id="fit-check" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Tell Whether Jeans Fit Properly
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Comfortable sit/walk, secure waist without pinching, intended break at
        the shoe.
      </p>

      <h2 id="limits" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Jeans Size Calculator Limitations
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Does not model stretch percentage or brand vanity sizing. Fit/rise are
        advisory.
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

      <h2 id="jeans-faq" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion faqs={[...JEANS_SIZE_FAQS]} />
      </div>
    </article>
  );
}
