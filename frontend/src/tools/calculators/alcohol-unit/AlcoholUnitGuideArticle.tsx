import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { ALCOHOL_UNIT_FAQS, SOURCE_LABEL } from './content';

export function AlcoholUnitGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Alcohol Unit Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Add documented drink servings to estimate UK alcohol units and convert
        them to another country&apos;s standard-drink size. Educational only —
        not a blood-alcohol or driving assessment.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Enter how many of each popular drink you had, optionally open more wine
        sizes, add a custom volume and ABV, and include cocktail counts. Choose
        your country to convert the total. Totals update as you type. Reload or
        clear resets the worksheet. Share copies the public page URL only.
      </p>

      <h2
        id="uk-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        UK Unit Formula
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        UK alcohol units = volume (ml) × ABV% ÷ 1000. One UK unit is defined as
        10 ml (about 8 g) of pure ethanol (NHS). Example: 500 ml at 5% ABV =
        2.5 UK units. A 25 ml shot at 40% ABV = 1 UK unit.
      </p>

      <h2
        id="countries"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Country Standards
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Outside the UK, the worksheet converts UK units × 8 g into that
        country&apos;s grams per standard drink (for example Australia 10 g, USA
        14 g, Canada 13.45 g). Definitions differ by national guidance.
      </p>

      <h2
        id="presets"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Preset Drinks
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Low / standard / strong beer-cider at 3.5% / 5% / 8% ABV</li>
        <li>Beer sizes: pint 568 ml, half-pint, bottle 330 ml, can 440 ml</li>
        <li>Wine 12% at 125 / 175 / 250 ml; champagne 150 ml; alcopop 275 ml</li>
        <li>Spirit single 25 ml at 40%; cocktails by UK spirit measures</li>
      </ul>

      <h2
        id="limits"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limits
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Brand recipes and home pours vary. This tool does not apply weekly
        guideline limits as pass/fail scores and does not estimate intoxication.
        Seek professional help for concerns about alcohol use.
      </p>
      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
        Source: {SOURCE_LABEL}
      </p>

      <h2
        id="alcohol-unit-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion faqs={[...ALCOHOL_UNIT_FAQS]} />
      </div>
    </article>
  );
}
