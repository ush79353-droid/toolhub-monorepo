import { VALUE_AT_RISK_FAQS } from './content';

export function ValueAtRiskGuideArticle() {
  return (
    <div className="space-y-8 text-sm leading-relaxed text-muted-foreground">
      <section id="what-is-var" className="scroll-mt-24 space-y-3">
        <h2 className="text-lg font-semibold text-accent">What Is Value at Risk?</h2>
        <p>
          Value at Risk (VaR) estimates a loss threshold for a chosen tail probability over a
          holding period. A 5% one-day VaR is the modeled loss amount associated with a 5% chance of
          a worse outcome under the assumptions—not a guaranteed maximum loss.
        </p>
      </section>

      <section id="how-we-calculate" className="scroll-mt-24 space-y-3">
        <h2 className="text-lg font-semibold text-accent">How We Calculate</h2>
        <p>
          We use parametric (variance–covariance) VaR with normally distributed returns:{' '}
          <span className="font-medium text-accent">
            VaR = Portfolio × max(0, Z × σ × √t − μ × t)
          </span>
          . Standard deviation (σ) and expected return (μ) are daily decimals; t is the horizon in
          days. Preset tails use Z ≈ 1.28155 (10%), 1.64485 (5%), and 2.32635 (1%). Custom tails use
          an inverse normal CDF.
        </p>
      </section>

      <section id="value-at-risk-faq" className="scroll-mt-24 space-y-4">
        <h2 className="text-lg font-semibold text-accent">Frequently Asked Questions</h2>
        {VALUE_AT_RISK_FAQS.map((faq) => (
          <div key={faq.question} className="space-y-1.5">
            <h3 className="font-medium text-accent">{faq.question}</h3>
            <p>{faq.answer}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
