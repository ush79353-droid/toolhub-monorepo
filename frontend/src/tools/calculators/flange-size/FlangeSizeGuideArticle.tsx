import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { FLANGE_SIZE_FAQS } from './content';

const SOURCE_LABEL =
  'Spectra Baby USA flange sizing guide (S1/S2 instructions / FAQ): up to 12→16, 16→20, 20→24, 24→28, 28→32 mm.';

export function FlangeSizeGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Flange Size Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Enter your nipple base diameter to see the matching Spectra Baby USA
        flange tunnel size from their published guide. Diagrams explain fit and
        how to measure without including the areola.
      </p>

      <h2
        id="what-is"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What This Calculator Does
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        It looks up a discrete manufacturer table. It does not add a universal
        clearance (for example +2 or +4 mm) and it does not replace Medela’s
        Room-to-Move starting guide.
      </p>

      <h2
        id="spectra-table"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Spectra Sizing Table
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Up to 12 mm nipple → 16 mm flange</li>
        <li>Up to 16 mm → 20 mm</li>
        <li>Up to 20 mm → 24 mm</li>
        <li>Up to 24 mm → 28 mm</li>
        <li>Up to 28 mm → 32 mm</li>
      </ul>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Source: {SOURCE_LABEL}
      </p>

      <h2
        id="how-to-measure"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Measure
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Measure the widest diameter at the nipple base. Exclude the areola.
        Switch mm/in in the calculator; the physical length is preserved.
      </p>

      <h2
        id="example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Worked Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Nipple base 18 mm falls in Spectra’s “up to 20 mm” band → suggested
        flange 24 mm. Confirm comfort while pumping.
      </p>

      <h2
        id="limits"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limits and Safety
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Above 28 mm is outside this published Spectra table — the tool flags that
        neutrally instead of inventing a size. Pain, blanching, or poor output
        means stop and seek lactation support. Educational only.
      </p>

      <h2
        id="related"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related Calculators
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <Link
            href="/tools/breastfeeding-calorie-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Breastfeeding Calorie Calculator
          </Link>
        </li>
      </ul>

      <h2
        id="flange-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion faqs={[...FLANGE_SIZE_FAQS]} />
      </div>
    </article>
  );
}
