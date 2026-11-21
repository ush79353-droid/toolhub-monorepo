export function NetToGrossGuideArticle() {
  return (
    <div className="prose prose-sm max-w-none text-accent">
      <section id="what-is-net-to-gross" className="scroll-mt-24">
        <h2 className="text-xl font-semibold text-accent">What This Calculator Does</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          This tool relates a net (before-tax) amount, a gross (after-tax) amount, the tax
          amount, and two equivalent tax-rate views: percent of net and percent of gross.
 It is a bidirectional money-and-rate converter; not a jurisdiction-specific
          income-tax or sales-tax schedule.
        </p>
      </section>

      <section id="net-to-gross-formulas" className="mt-8 scroll-mt-24">
        <h2 className="text-xl font-semibold text-accent">Formulas</h2>
        <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
          <li>
            <code>Gross = Net + Tax</code>
          </li>
          <li>
            <code>rN = (Tax / Net) × 100</code> when Net &gt; 0
          </li>
          <li>
            <code>rG = (Tax / Gross) × 100</code> when Gross &gt; 0; require{' '}
            <code>0 ≤ rG &lt; 100</code>
          </li>
          <li>
            From net and rN: <code>Tax = Net × rN / 100</code>, then{' '}
            <code>Gross = Net + Tax</code>
          </li>
          <li>
            From gross and rG: <code>Tax = Gross × rG / 100</code>, then{' '}
            <code>Net = Gross − Tax</code>
          </li>
          <li>
            Equivalence: <code>rG = 100 × rN / (100 + rN)</code> and{' '}
            <code>rN = 100 × rG / (100 − rG)</code>
          </li>
        </ul>
      </section>

      <section id="step-by-step-example" className="mt-8 scroll-mt-24">
        <h2 className="text-xl font-semibold text-accent">Step-by-Step Example</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Net = 100, percentage tax from net = 20%. Tax = 20, gross = 120, percentage tax
          from gross ≈ 16.6667%. Entering gross 120 with rG ≈ 16.6667% recovers the same
          net and tax.
        </p>
      </section>
    </div>
  );
}
