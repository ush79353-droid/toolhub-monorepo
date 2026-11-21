import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { CS_FAQS } from './content';

export function ConsumerSurplusGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-cs"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Consumer Surplus?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Consumer surplus measures the economic benefit a buyer receives when the
        price paid is below their maximum willingness to pay. Different
        consumers can value the same product differently, so surplus varies
        across buyers even at one market price.
      </p>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        CS = WTP − P
      </div>

      <h2
        id="cs-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is the Consumer Surplus Formula?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        For an individual purchase, subtract the actual price (P) from maximum
        willingness to pay (WTP). Example: WTP $150 and price $100 → surplus
        $50.
      </p>

      <h2
        id="examples"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Find Consumer Surplus – Examples
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>WTP $150 · price $120 → CS = $30.</li>
        <li>WTP $100 · price $100 → CS = $0.</li>
        <li>
          Price $150 · WTP $100 → signed difference −$50; realized voluntary
          surplus not applicable.
        </li>
      </ul>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use the Consumer Surplus Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter actual price.</li>
        <li>Enter maximum willing price.</li>
        <li>Select the display currency (denomination only).</li>
        <li>Review consumer surplus and any warnings.</li>
        <li>Open Related information for definitions.</li>
        <li>Use reverse modes to solve for WTP or price when needed.</li>
        <li>Reset to compare another purchase.</li>
      </ol>

      <h2
        id="graph"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Consumer Surplus on a Supply and Demand Graph
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Market consumer surplus is the area above the market price and below the
        demand curve, up to equilibrium quantity. That geometric view aggregates
        many buyers; the calculator&apos;s primary fields use the individual
        WTP − P model.
      </p>

      <h2
        id="linear-demand"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Consumer Surplus Under Linear Demand
      </h2>
      <div className="my-4 rounded-xl border border-border bg-muted/30 p-4 font-mono text-xs text-accent sm:text-sm">
        CS = ½ × (Pmax − Pe) × Qe
      </div>
      <p className="text-sm leading-relaxed text-foreground/90 sm:text-base">
        Example: Pmax $100 · Pe $60 · Qe 500 → market CS = $10,000 under a
        linear demand assumption. Do not apply this triangle to a single
        purchase.
      </p>

      <h2
        id="vs-producer"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Consumer Surplus vs. Producer Surplus
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Consumer surplus is buyer benefit below WTP. Producer surplus is seller
        benefit when price exceeds the minimum acceptable supply price (or
        marginal cost) under the relevant model.
      </p>

      <h2
        id="why-matters"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Why Consumer Surplus Matters
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        It supports discussions of consumer welfare, pricing, product valuation,
        and policy effects when willingness to pay and prices can be stated or
        assumed.
      </p>

      <h2
        id="price-increase"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Happens When Prices Increase?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Holding WTP fixed, a higher transaction price reduces individual
        surplus. Along a demand curve, higher market prices typically shrink
 total consumer surplus; responses still vary by buyer.
      </p>

      <h2
        id="discounts"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Consumer Surplus and Discounts
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        List price, advertised discount, actual transaction price, and WTP are
 different concepts. Surplus uses WTP and the price paid; not the
        retail markdown alone.
      </p>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Consumer Surplus Limitations
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        WTP is subjective and can change; individual and market surplus differ;
        quality and externalities matter; market triangles need demand
        assumptions; surplus is not accounting savings. This tool provides
        educational estimates, not financial advice.
      </p>

      <section id="cs-faq" className="mt-10">
        <h2 className="text-lg font-bold tracking-tight text-accent sm:text-xl">
          Frequently Asked Questions
        </h2>
        <div className="mt-4">
          <FAQAccordion items={[...CS_FAQS]} />
        </div>
      </section>
    </article>
  );
}
