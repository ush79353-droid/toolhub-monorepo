import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { GOLD_MELT_CALCULATOR_HREF, SCRAP_GOLD_FAQS } from './content';

export function ScrapGoldGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="gold-characteristics-karat"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Gold characteristics – what is a karat?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Scrap gold is gold that must usually be melted and recycled before it can
        be used again. Purity is measured in karats and shows how much of an alloy
        is pure gold versus other metals.
      </p>

      <h3 className="mt-6 text-base font-semibold text-accent sm:text-lg">
        Scrap gold weight
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Weigh scrap on a digital or jewelry scale. Common units include grams,
        troy ounces, and pennyweights. This calculator converts everything to
        grams internally so unit choices stay consistent.
      </p>

      <h3 className="mt-6 text-base font-semibold text-accent sm:text-lg">
        Gold purity
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Purity is the share of actual gold in the item. Using karat ÷ 24:
      </p>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>24K ≈ 99.9% commercially (theoretical karat ratio is 100%).</li>
        <li>22K ≈ 91.67%.</li>
        <li>18K = 75%.</li>
        <li>14K ≈ 58.33%.</li>
        <li>10K ≈ 41.67%.</li>
      </ul>

      <h3 className="mt-6 text-base font-semibold text-accent sm:text-lg">
        Price per unit weight
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Pure-gold market prices change often and depend on the weight unit and
        currency you choose. Check a reliable quote before entering a price. For
        melt-focused estimates with dealer spread tools, see the{' '}
        <Link
          href={GOLD_MELT_CALCULATOR_HREF}
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Gold Melt Calculator
        </Link>
        .
      </p>

      <h2
        id="gold-value-calculations-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Gold value calculations example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Mixed-karat scrap can be valued by converting each batch to pure gold,
        summing those weights, then multiplying by the pure-gold price.
      </p>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Assume 120&nbsp;g of 18K gold, 350&nbsp;g of 9K gold, and a pure gold price
        of $39 per gram.
      </p>
      <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <span className="font-semibold text-accent">Purity:</span> 18/24 = 0.75;
          9/24 = 0.375.
        </li>
        <li>
          <span className="font-semibold text-accent">Pure gold:</span> 120 × 0.75 =
          90&nbsp;g; 350 × 0.375 = 131.25&nbsp;g.
        </li>
        <li>
          <span className="font-semibold text-accent">Combined:</span> 90 + 131.25 =
          221.25&nbsp;g.
        </li>
        <li>
          <span className="font-semibold text-accent">Estimated value:</span> 221.25
          × 39 = <strong>$8,628.75</strong>.
        </li>
      </ol>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        That figure is an estimated melt value before dealer deductions, refining
        fees, or transaction costs. Use the Scrap Gold Calculator for each batch
        instead of doing the arithmetic by hand.
      </p>

      <h2
        id="scrap-gold-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently asked questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...SCRAP_GOLD_FAQS]} />
      </div>
    </article>
  );
}
