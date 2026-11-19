export function FloridaSalesTaxGuideArticle() {
  return (
    <div className="space-y-10 text-sm leading-relaxed text-muted-foreground">
      <section id="what-is-florida-sales-tax" className="scroll-mt-24 space-y-3">
        <h2 className="text-lg font-semibold text-accent">
          What Is Florida Sales Tax?
        </h2>
        <p>
          Florida charges a statewide sales tax of <strong>6%</strong> on most
          taxable retail sales of tangible personal property. Many counties also
          levy a <strong>discretionary sales surtax</strong> on top of the state
          rate. Combined rates therefore vary by county.
        </p>
      </section>

      <section id="how-rates-are-sourced" className="scroll-mt-24 space-y-3">
        <h2 className="text-lg font-semibold text-accent">
          How Rates Are Sourced
        </h2>
        <p>
          County discretionary surtax totals come from Florida Department of
          Revenue Form <strong>DR-15DSS</strong> for Calendar Year 2026. ZIP to
          county mapping uses the U.S. Census Bureau 2020 ZCTA-to-county
          relationship file (Florida counties only). This is not Florida DOR
          PointMatch street-address resolution.
        </p>
        <p>
          Formulas:{' '}
          <code className="text-xs">
            State Tax = Amount × 6%; Surtax = min(Amount, $5,000) × County
            Surtax%; Total = Amount + State Tax + Surtax
          </code>
          . The $5,000 surtax base assumes a single taxable item.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-24 space-y-3">
        <h2 className="text-lg font-semibold text-accent">
          How to Use This Calculator
        </h2>
        <ol className="list-decimal space-y-2 pl-5">
          <li>Enter the purchase amount in USD.</li>
          <li>Enter the five-digit Florida ZIP code for the purchase location.</li>
          <li>
            If the ZIP spans multiple counties, select the purchase county from
            the list.
          </li>
          <li>
            Review state tax, county surtax, total tax, and total with tax.
          </li>
        </ol>
      </section>

      <section id="florida-sales-tax-faq" className="scroll-mt-24 space-y-3">
        <h2 className="text-lg font-semibold text-accent">
          Frequently Asked Questions
        </h2>
        <p>
          Product exemptions, resale certificates, and special district rules are
          outside this estimate. Use Florida DOR guidance or PointMatch for
          filing-grade jurisdiction answers.
        </p>
      </section>
    </div>
  );
}
