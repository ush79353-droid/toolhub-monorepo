import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import {
  GOLD_MELT_CALCULATOR_HREF,
  SCRAP_GOLD_CALCULATOR_HREF,
  SCRAP_SILVER_FAQS,
  SCRAP_SILVER_SOURCES,
} from './content';

export function ScrapSilverGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="silver-characteristics-usage"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Silver&apos;s characteristics and usage
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Pure silver is soft and malleable, so it is commonly alloyed with other
        metals for strength. Fineness markings such as .925 or .999 show how much
        of an item is actual silver. Sterling silver is typically 92.5% silver;
        fine silver is near 99.9% or higher. Alloys appear in jewelry, flatware,
        decorative objects, electronics, and industrial parts. Scrap valuation
        starts from weight and purity before applying a market price — and may
        end with recycling or refining.
      </p>

      <h2
        id="how-much-is-silver-worth"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How much is silver worth?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Silver&apos;s market value moves with supply, demand, and broader precious-
        metal markets. Spot price is the market value of pure silver. Scrap value
        also depends on item weight, purity (pure silver content), dealer buy/sell
        margins, and refining or processing costs. Buyers often pay less than
        spot melt value after deductions. Enter an up-to-date pure-silver price
        before calculating. Related tools:{' '}
        <Link
          href={SCRAP_GOLD_CALCULATOR_HREF}
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Scrap Gold Calculator
        </Link>{' '}
        and{' '}
        <Link
          href={GOLD_MELT_CALCULATOR_HREF}
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Gold Melt Calculator
        </Link>
        .
      </p>

      <h2
        id="scrap-silver-value-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Scrap silver value calculator – an example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Assume 100&nbsp;g of .925 silver and a pure silver price of $0.85 per gram.
      </p>
      <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <span className="font-semibold text-accent">Pure silver weight:</span>{' '}
          100 × 0.925 = 92.5&nbsp;g.
        </li>
        <li>
          <span className="font-semibold text-accent">Estimated value:</span> 92.5
          × 0.85 = $78.625.
        </li>
        <li>
          <span className="font-semibold text-accent">Rounded USD result:</span>{' '}
          <strong>$78.63</strong>.
        </li>
      </ol>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        That figure is estimated melt value before dealer discounts, refining
        charges, or other fees. Use the optional buy/sell section to model those
        deductions.
      </p>

      <h2
        id="interesting-facts-silver"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Interesting facts about silver
      </h2>
      <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Silver&apos;s chemical symbol is Ag.</li>
        <li>Silver is one of the most electrically conductive metals.</li>
        <li>Silver is highly reflective.</li>
        <li>Silver has been used in coinage and jewelry for centuries.</li>
        <li>
          Silver is used in electronics, solar panels, and industrial applications.
        </li>
        <li>Silver can be recycled and reused.</li>
        <li>
          Purity markings help identify how much actual silver an item contains.
        </li>
        <li>Sterling silver typically contains 92.5% silver.</li>
      </ul>

      <h2
        id="scrap-silver-sources"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Sources
      </h2>
      <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        {SCRAP_SILVER_SOURCES.map((source) => (
          <li key={source.href}>
            <a
              href={source.href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary underline-offset-2 hover:underline"
            >
              {source.title}
            </a>
            {' — '}
            {source.note}
          </li>
        ))}
      </ul>

      <h2
        id="scrap-silver-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently asked questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...SCRAP_SILVER_FAQS]} />
      </div>
    </article>
  );
}
