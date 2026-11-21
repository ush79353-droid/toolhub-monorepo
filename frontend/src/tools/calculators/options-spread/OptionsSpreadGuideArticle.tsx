import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { OPTIONS_SPREAD_FAQS } from './content';

export function OptionsSpreadGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-options-spread"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What This Calculator Does
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Estimate net debit/credit, maximum loss and profit, breakeven, and
        potential P/L at a target expiration price for four common vertical
        option spreads. Results use expiration payoffs and a standard 100-share
        equity multiplier.
      </p>

      <h2
        id="options-spread-formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Formulas
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Call payoff = max(0, S − K); Put payoff = max(0, K − S)</p>
        <p>Net per share = long premium − short premium (debit if &gt; 0)</p>
        <p>Totals × 100 × contracts</p>
        <p>Bull call BE ≈ long K + |net|; Bear put BE ≈ long K − |net|</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Bull call: buy 100 call @ 5, sell 110 call @ 2, 1 contract, S=108</p>
        <p>Net debit/share = 3 → max loss 300 · max profit 700 · BE 103</p>
        <p>At 108: intrinsic 8 − 0 − 3 = 5/share → potential profit 500</p>
      </div>

      <h2
        id="options-spread-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...OPTIONS_SPREAD_FAQS]} />
      </div>
    </article>
  );
}
