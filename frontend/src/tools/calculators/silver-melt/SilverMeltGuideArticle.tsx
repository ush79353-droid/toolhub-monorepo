import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import {
  GOLD_MELT_CALCULATOR_HREF,
  SCRAP_GOLD_CALCULATOR_HREF,
  SCRAP_SILVER_CALCULATOR_HREF,
  SILVER_MELT_FAQS,
} from './content';

export function SilverMeltGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="silver-melt-history"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Silver melt value – the history
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Silver has long been valued as a precious metal for coinage, jewelry, and
        monetary systems. Over time it also became important in electronics and
        industrial uses. Modern markets quote silver as a traded commodity, while
        recycling recovers metal from scrap. Collectible or finished-item prices
        can differ sharply from intrinsic melt value, which depends on pure silver
        content and the spot price of pure silver.
      </p>

      <h2
        id="silver-purity-coin-melt"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Silver purity and silver coin melt value
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Purity (fineness) determines how much of an object is pure silver. Fine
        silver is typically 99.9% or higher; sterling is usually 92.5% silver with
        other metals for strength; historical coin silver is often around 90%.
        Melt value uses actual silver content, not total item weight alone.
      </p>
      <div className="my-4 rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-sm leading-relaxed text-sky-950/90">
        <p className="font-semibold text-accent">Does silver melt?</p>
        <p className="mt-1.5">
          Silver melts at approximately 961.8°C under standard pressure. Ordinary
          melt-value estimates do not require physically melting the item — they
          value the pure silver content at a market price.
        </p>
      </div>

      <h2
        id="silver-quarter-scrap"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How much is a silver quarter worth in scrap?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Many pre-1965 US quarters contain about 90% silver. A common reference
        weight is about 6.25&nbsp;g total, so pure silver content is about
        5.625&nbsp;g. Melt value ≈ 5.625 × current silver price per gram. Modern
        circulating quarters generally do not share that composition — treat them
        separately from historical silver coinage.
      </p>

      <h2
        id="silver-melt-in-practice"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        The silver melt calculator in practice
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Example: 225&nbsp;g total weight, 92.5% purity, $0.90 per gram of pure
        silver.
      </p>
      <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <span className="font-semibold text-accent">Pure silver:</span> 225 ×
          0.925 = 208.125&nbsp;g.
        </li>
        <li>
          <span className="font-semibold text-accent">Melt value:</span> 208.125 ×
          0.90 = $187.3125.
        </li>
        <li>
          <span className="font-semibold text-accent">Rounded USD:</span>{' '}
          <strong>$187.31</strong>.
        </li>
      </ol>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        That is estimated raw melt value before dealer discounts or refining fees.
        If the item also contains copper (or another metal), value silver and the
        other metal separately, then combine:{' '}
        <em>Combined = SilverValue + OtherMetalValue</em>. Finished jewelry may
        still trade above or below raw metal value due to craftsmanship, brand,
        and condition.
      </p>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Related tools:{' '}
        <Link
          href={SCRAP_SILVER_CALCULATOR_HREF}
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Scrap Silver Calculator
        </Link>
        ,{' '}
        <Link
          href={SCRAP_GOLD_CALCULATOR_HREF}
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Scrap Gold Calculator
        </Link>
        ,{' '}
        <Link
          href={GOLD_MELT_CALCULATOR_HREF}
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Gold Melt Calculator
        </Link>
        .
      </p>

      <h2
        id="silver-melt-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently asked questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...SILVER_MELT_FAQS]} />
      </div>
    </article>
  );
}
