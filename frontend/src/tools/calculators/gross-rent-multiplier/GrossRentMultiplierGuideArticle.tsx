export function GrossRentMultiplierGuideArticle() {
  return (
    <div className="space-y-8 text-[15px] leading-7 text-foreground">
      <section id="what-is-grm" className="scroll-mt-24 space-y-3">
        <h2 className="text-xl font-semibold text-accent">What Is Gross Rent Multiplier?</h2>
        <p>
          Gross rent multiplier (GRM) screens investment properties by relating asking
          price to gross rental income before expenses. It is a quick comparison tool,
          not a full cash-flow or cap-rate analysis.
        </p>
      </section>

      <section id="grm-formula" className="scroll-mt-24 space-y-3">
        <h2 className="text-xl font-semibold text-accent">Formula</h2>
        <p>
          <span className="font-medium text-accent">Gross rent multiplier</span> =
          property price ÷ annual gross rental income.
        </p>
        <p>
          Monthly income is annualized (×12). When property price and rental income use
          different currencies, both amounts are converted into the property-price
          currency before division so the ratio stays dimensionless and FX-stable.
        </p>
      </section>

      <section id="step-by-step-example" className="scroll-mt-24 space-y-3">
        <h2 className="text-xl font-semibold text-accent">Step-by-Step Example</h2>
        <p>Property price 1,000,000 with annual gross rent 85,000:</p>
        <ol className="list-decimal space-y-2 pl-5">
          <li>Annualize income if needed (monthly 7,083.33 → 85,000).</li>
          <li>GRM = 1,000,000 ÷ 85,000 ≈ 11.76.</li>
        </ol>
      </section>

      <section id="grm-faq" className="scroll-mt-24 space-y-3">
        <h2 className="text-xl font-semibold text-accent">Frequently Asked Questions</h2>
        <p>
          See the FAQ accordion below for market comparison notes, monthly income
          handling, and how independent FX selectors behave on this page.
        </p>
      </section>
    </div>
  );
}
