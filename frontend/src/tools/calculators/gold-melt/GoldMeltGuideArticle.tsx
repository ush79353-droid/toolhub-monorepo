import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { GOLD_MELT_FAQS } from './content';

export function GoldMeltGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <p className="text-sm leading-relaxed text-foreground/90 sm:text-base">
        Gold melt value is an estimate of what the metal content in a piece is worth at a pure-gold
        reference price — after adjusting for karat or purity. Weight, purity, and spot price drive
        the result; dealer spreads explain why offers can sit below that intrinsic estimate. Enter a
        market price manually; this calculator does not fetch live quotes.
      </p>

      <h2
        id="what-is-karat"
        className="mt-8 text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What is a karat and how does it measure the purity of gold?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A karat measures gold purity. Pure gold is 24 karats; lower karats mix gold with other metals.
        Approximate purity:
      </p>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Gold Purity = (Karat / 24) × 100</p>
      </div>
      <div className="not-prose mt-4 overflow-x-auto">
        <table className="w-full min-w-[320px] border-collapse text-left text-sm">
          <thead className="bg-muted/60 text-accent">
            <tr>
              <th className="border border-border px-3 py-2 font-semibold">Karat</th>
              <th className="border border-border px-3 py-2 font-semibold">Approximate purity</th>
            </tr>
          </thead>
          <tbody className="text-foreground/90">
            {[
              ['24K', '99.9% (commercial)'],
              ['23K', '95.83%'],
              ['22K', '91.67%'],
              ['21K', '87.50%'],
              ['20K', '83.33%'],
              ['18K', '75.00%'],
              ['14K', '58.33%'],
              ['12K', '50.00%'],
              ['10K', '41.67%'],
              ['9K', '37.50%'],
              ['8K', '33.33%'],
            ].map(([k, p]) => (
              <tr key={k}>
                <td className="border border-border px-3 py-1.5">{k}</td>
                <td className="border border-border px-3 py-1.5 tabular-nums">{p}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Note: a karat measures gold purity; a carat is a unit of gemstone weight. They are different
        concepts.
      </p>

      <h2
        id="how-to-calculate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to calculate gold melt value using the calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <strong className="font-medium text-accent">Quality</strong> — choose a karat or custom
          purity percentage.
        </li>
        <li>
          <strong className="font-medium text-accent">Value</strong> — enter weight and unit, then the
          pure-gold market price and its unit. Review possession (melt) value.
        </li>
        <li>
          <strong className="font-medium text-accent">Trade / Exchange</strong> — set the dealer
          spread, then compare bid and ask prices and values against spot melt value. Override bid or
          ask manually when you have a real quote.
        </li>
      </ol>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The calculator values the pure-gold content only — it does not treat every gram of jewelry as
        100% gold.
      </p>

      <h2
        id="manual-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Manually calculate gold jewelry melt value
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>V = M × Q × P</p>
        <p className="mt-2">M = weight in grams · Q = purity decimal · P = price per gram of pure gold</p>
        <p className="mt-2">Example: 10 g × 0.75 × $100/g = $750</p>
      </div>
      <p className="text-sm leading-relaxed text-foreground/90 sm:text-base">
        That $750 is estimated melt value before dealer discounts, refining, or other fees. Another
        check: 20 g of 14K (~58.33%) at $50/g pure → 20 × 0.5833 × 50 ≈ $583.30.
      </p>

      <h2
        id="related-calculators"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related calculators
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <Link href="/tools/investment-calculator" className="text-primary hover:underline">
            Investment Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/compound-interest-calculator" className="text-primary hover:underline">
            Compound Interest Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/finance-calculator" className="text-primary hover:underline">
            Finance Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/savings-calculator" className="text-primary hover:underline">
            Savings Calculator
          </Link>
        </li>
      </ul>

      <h2
        id="gold-melt-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently asked questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion faqs={[...GOLD_MELT_FAQS]} />
      </div>
    </article>
  );
}
