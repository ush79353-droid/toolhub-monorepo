import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { DOL_FAQS } from './content';

export function DegreeOfOperatingLeverageGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-ol"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Operating Leverage?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Operating leverage describes how fixed versus variable operating costs
        affect the sensitivity of EBIT to sales. Firms with more fixed operating
 costs often see larger percentage EBIT swings when sales change; near
        break-even especially.
      </p>

      <h2
        id="dol-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Degree of Operating Leverage Formula
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        DOL = %ΔEBIT / %ΔSales
      </div>
      <p className="text-sm leading-relaxed text-foreground/90 sm:text-base">
        Example: sales +10%, EBIT +30% → DOL = 3.00.
      </p>

      <h2
        id="cm-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Contribution Margin Formula for DOL
      </h2>
      <div className="my-4 rounded-xl border border-border bg-muted/30 p-4 font-mono text-xs text-accent sm:text-sm">
        CM = Sales − Variable Costs
        <br />
        EBIT = CM − Fixed Operating Costs
        <br />
        DOL = CM / EBIT
      </div>
      <p className="text-sm leading-relaxed text-foreground/90 sm:text-base">
        This point-in-time measure assumes linear CVP conditions. It is related
        to, but not automatically interchangeable with, period-to-period
        percentage DOL when costs, prices, or mix change.
      </p>

      <h2
        id="what-dol-says"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Does Degree of Operating Leverage Say?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        DOL &gt; 1 means EBIT is more percentage-sensitive than sales under the
        model; DOL = 1 means equal proportional changes; 0 &lt; DOL &lt; 1 means
        smaller EBIT percentage moves; negative DOL needs contextual reading.
        Large absolute DOL can also reflect EBIT near zero.
      </p>

      <h2
        id="vs-financial"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Operating Leverage vs. Financial Leverage
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Operating leverage is about the operating cost structure and EBIT
        sensitivity to sales. Financial leverage is about financing costs and
        earnings sensitivity to operating earnings. They are different concepts.
      </p>

      <h2
        id="how-to-calculate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Degree of Operating Leverage
      </h2>
      <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Obtain comparable sales and EBIT percentage changes.</li>
        <li>Confirm the sales-change denominator is nonzero.</li>
        <li>Divide %ΔEBIT by %ΔSales.</li>
        <li>Interpret the coefficient with cost-structure context.</li>
      </ol>

      <h2
        id="worked-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Operating Leverage Calculation Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Sales +10% · EBIT +30% → DOL = 3. A 1% sales change maps to roughly a 3%
        EBIT change under those assumptions.
      </p>

      <h2
        id="fixed-costs"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Fixed Costs Affect Operating Leverage
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Rent, depreciation, salaried overhead, and similar fixed operating costs
 raise operating leverage when they are large relative to variable costs; 
        classifications depend on the relevant range and period.
      </p>

      <h2
        id="advantages"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Advantages of Operating Leverage
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        When sales rise and fixed costs stay stable, operating profit can
        increase quickly as fixed costs are spread over more volume.
      </p>

      <h2
        id="disadvantages"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Disadvantages of Operating Leverage
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        When sales fall, losses can deepen; fixed costs remain; earnings near
        break-even can be volatile. High operating leverage is not automatically
        overall financial risk in every situation.
      </p>

      <h2
        id="vs-cm"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        DOL vs. Contribution Margin
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Contribution margin is a currency amount (or per-unit margin). DOL is a
        dimensionless sensitivity coefficient that may use CM in its numerator.
      </p>

      <h2
        id="mistakes"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Common DOL Calculation Mistakes
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Inverting the ratio (sales change ÷ EBIT change).</li>
        <li>Mixing percents and decimals incorrectly.</li>
        <li>Using net income instead of EBIT.</li>
        <li>Ignoring zero denominators or assuming DOL is constant everywhere.</li>
        <li>Treating negative DOL as automatically invalid.</li>
      </ul>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations of Degree of Operating Leverage
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        DOL varies with sales levels; EBIT near zero inflates coefficients;
        history may not predict the future; cost structures and mix change;
        extraordinary items distort EBIT. This tool provides educational
        estimates, not financial advice.
      </p>

      <section id="dol-faq" className="mt-10">
        <h2 className="text-lg font-bold tracking-tight text-accent sm:text-xl">
          Frequently Asked Questions
        </h2>
        <div className="mt-4">
          <FAQAccordion items={[...DOL_FAQS]} />
        </div>
      </section>
    </article>
  );
}
