import { COMPOUND_INTEREST_RATE_FAQS } from './content';

export function CompoundInterestRateGuideArticle() {
  return (
    <div className="space-y-8 text-sm leading-relaxed text-muted-foreground">
      <section id="what-compound-interest-rate" className="scroll-mt-24 space-y-3">
        <h2 className="text-lg font-semibold text-accent">What This Rate Means</h2>
        <p>
          Enter a starting balance, an ending balance, how often interest compounds, and the
          holding period. The calculator returns the annual nominal interest rate that produces
          that growth (or decline) under regular compounding with no extra deposits.
        </p>
      </section>

      <section id="how-we-calculate" className="scroll-mt-24 space-y-3">
        <h2 className="text-lg font-semibold text-accent">How We Calculate</h2>
        <p>
          Surplus = final − initial. The annual nominal rate is{' '}
          <span className="font-medium text-accent">
            n × [(final / initial)^(1 / (n × t)) − 1] × 100
          </span>
          , where n is compounding periods per year and t is years + months / 12. Initial and final
          balances must be positive and the term must be greater than zero.
        </p>
      </section>

      <section id="compound-interest-rate-faq" className="scroll-mt-24 space-y-4">
        <h2 className="text-lg font-semibold text-accent">Frequently Asked Questions</h2>
        {COMPOUND_INTEREST_RATE_FAQS.map((faq) => (
          <div key={faq.question} className="space-y-1.5">
            <h3 className="font-medium text-accent">{faq.question}</h3>
            <p>{faq.answer}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
