import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { CHART_SOURCE } from './chart-data';
import { BRA_SIZE_FAQS } from './content';

export function BraSizeGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Bra Size Calculator – Find Your Band Size, Cup Size &amp; Sister Sizes
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Estimate band and cup from underbust and bust measurements, explore
        sister sizes, and compare US, UK, EU, AU/NZ, and FR/ES labels.
        Measurements are processed in your browser and are not stored by this
        tool. {CHART_SOURCE}
      </p>

      <h2 id="what" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        What Is a Bra Size Calculator?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A tool that turns two circumferences into a region-labeled size estimate
        plus nearby sister sizes — a starting point for shopping, not a
        guaranteed fit.
      </p>

      <h2 id="how-works" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How Does a Bra Size Calculator Work?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Inputs convert to centimeters. Band mapping and cup steps follow the
        selected region’s documented profile. US/UK can use modern nearest-even
        underbust or an optional traditional +4 method.
      </p>

      <h2 id="measure-under" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Measure Your Underbust
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Place the tape snugly under the bust on the rib cage, level all the way
        around. Exhale gently; do not cinch painfully.
      </p>

      <h2 id="measure-bust" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Measure Your Bust
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Measure the fullest bust point with a level tape and light contact —
        avoid heavy compression or large slack.
      </p>

      <h2 id="band" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Calculate Bra Band Size
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        US/UK modern: convert underbust to inches and take the nearest even
        band on the supported ladder. Optional +4 adds four inches before
        rounding. EU/AU/FR bands are taken from a parallel conversion ladder
        keyed off that hub.
      </p>

      <h2 id="cup" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Calculate Bra Cup Size
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        US/UK: cup steps from (bust − band) in inches. Metric systems here: cup
        steps from (bust − underbust) ≈ 2 cm each. Letter names differ after
        certain sizes.
      </p>

      <h2 id="letters" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Understanding Bra Size Letters
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Letters encode relative cup volume for a band. The same letter on
        different bands is not the same absolute volume.
      </p>

      <h2 id="find" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Find Your Correct Bra Size
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Use the estimate, check the brand chart, try sister sizes, and judge
        comfort on band, cups, and straps together.
      </p>

      <h2 id="charts" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Bra Size Charts by Country
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Markets use different band numbers and cup ladders. The sections below
        summarize this calculator’s illustrative tables.
      </p>

      <h2 id="us-chart" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        US Bra Size Chart
      </h2>
      <p className="mt-2 text-xs text-muted-foreground">{CHART_SOURCE}</p>
      <p className="mt-2 text-sm text-foreground/90">
        Bands: 28–50 (even). Cups (illustrative): AA, A, B, C, D, DD, DDD, G,
        H, I, J.
      </p>

      <h2 id="uk-chart" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        UK Bra Size Chart
      </h2>
      <p className="mt-2 text-sm text-foreground/90">
        Bands often match US numerically. Cups (illustrative): AA, A, B, C, D,
        DD, E, F, FF, G, GG, H.
      </p>

      <h2 id="eu-chart" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        European Bra Size Chart
      </h2>
      <p className="mt-2 text-sm text-foreground/90">
        Bands (illustrative): 60, 65, 70, 75, 80… mapped from the inch hub (for
        example US 34 ↔ EU 75).
      </p>

      <h2 id="au-chart" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Australian Bra Size Chart
      </h2>
      <p className="mt-2 text-sm text-foreground/90">
        Bands (illustrative): 6, 8, 10, 12… (US 32 ↔ AU 10, US 34 ↔ AU 12).
      </p>

      <h2 id="fr-chart" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        French Bra Size Chart
      </h2>
      <p className="mt-2 text-sm text-foreground/90">
        FR/ES bands often track EU + 15 (EU 75 ↔ FR 90) on illustrative charts.
      </p>

      <h2 id="convert" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        International Bra Size Conversion
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Conversions here keep band index and cup step on parallel ladders.
        Treat them as approximate — especially for larger cups.
      </p>

      <h2 id="sister" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        What Are Sister Sizes?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Alternative band/cup pairs that aim for similar cup volume with a
        snugger or looser band.
      </p>

      <h2 id="sister-calc" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Calculate Sister Sizes
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        Smaller band → cup +1 step · Larger band → cup −1 step
      </p>
      <p className="mt-2 text-sm text-foreground/90">
        Example: 34C ↔ 32D ↔ 36B (US/UK letter ladders).
      </p>

      <h2 id="check-fit" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Check Whether Your Bra Fits
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Assess band level and snugness, cup containment without painful
        pressure, and strap comfort together — after a short wear test.
      </p>

      <h2 id="too-small" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Signs Your Bra Is Too Small
      </h2>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-foreground/90">
        <li>Cup overflow or underwire on tissue</li>
        <li>Band painfully tight on the loosest hook</li>
        <li>Red marks that do not fade promptly</li>
      </ul>

      <h2 id="too-large" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Signs Your Bra Is Too Large
      </h2>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-foreground/90">
        <li>Band rides up the back</li>
        <li>Cups gape when standing normally</li>
        <li>Straps slip despite adjustments</li>
      </ul>

      <h2 id="band-fit" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Check Bra Band Fit
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A new bra often starts on the loosest hooks so you can tighten as
        elastic ages. The band should stay roughly level.
      </p>

      <h2 id="cup-fit" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Check Bra Cup Fit
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Tissue should sit in the cups; wrinkling or overflow can mean size or
        shape mismatch.
      </p>

      <h2 id="straps" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Adjust Bra Straps
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Adjust evenly; straps fine-tune lift but should not replace band
        support.
      </p>

      <h2 id="styles" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Choosing the Right Bra Style
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        T-shirt, balconette, plunge, wireless, and sports styles distribute
        tissue differently — size letters transfer imperfectly across styles.
      </p>

      <h2 id="brands" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Why Bra Sizes Differ Between Brands
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Pattern grading, stretch, cup shape, and letter systems vary. Two
        “34C” bras can fit differently.
      </p>

      <h2 id="mistakes" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Common Bra Sizing Mistakes
      </h2>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-foreground/90">
        <li>Applying +4 silently without knowing the method</li>
        <li>Assuming US letters equal UK letters after D</li>
        <li>Ignoring brand charts</li>
        <li>Measuring over bulky clothing or padded cups</li>
      </ul>

      <h2 id="limits" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Bra Size Calculator Limitations
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Heuristics cannot capture breast shape, asymmetry, or every brand’s
        grading. Out-of-table measurements are not silently forced into a size.
      </p>

      <h2 id="related" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Related Calculators
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Related tools load from the catalog when developed — browse{' '}
        <Link href="/tools" className="font-medium text-primary hover:underline">
          Omega Calculators
        </Link>
        .
      </p>

      <h2 id="bra-faq" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion faqs={[...BRA_SIZE_FAQS]} />
      </div>
    </article>
  );
}
