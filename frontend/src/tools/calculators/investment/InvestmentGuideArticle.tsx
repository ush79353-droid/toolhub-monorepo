import { INVESTMENT_FAQS } from './content';

export function InvestmentGuideArticle() {
  return (
    <div className="space-y-8 text-sm leading-relaxed text-muted-foreground">
      <section id="what-investment-calculator" className="scroll-mt-24 space-y-3">
        <h2 className="text-lg font-semibold text-accent">What This Calculator Does</h2>
        <p>
          Project how an initial investment grows with a stated rate of return, compounding
          frequency, optional recurring contributions, and an optional inflation adjustment. Results
          include final balance, earned return, and an annual principal / interest / total chart.
        </p>
      </section>

      <section id="how-we-calculate" className="scroll-mt-24 space-y-3">
        <h2 className="text-lg font-semibold text-accent">How We Calculate</h2>
        <p>
          Without contributions, final balance = P × (1 + r/n)^(n×t). Investment return is final
          balance minus total money contributed. With contributions, the balance is stepped period by
          period. Inflation-adjusted value = final balance ÷ (1 + inflation)^t when inflation is
          greater than zero.
        </p>
      </section>

      <section id="investment-faq" className="scroll-mt-24 space-y-4">
        <h2 className="text-lg font-semibold text-accent">Frequently Asked Questions</h2>
        {INVESTMENT_FAQS.map((faq) => (
          <div key={faq.question} className="space-y-1.5">
            <h3 className="font-medium text-accent">{faq.question}</h3>
            <p>{faq.answer}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
