import { HOLDING_PERIOD_RETURN_FAQS } from './content';

export function HoldingPeriodReturnGuideArticle() {
  return (
    <div className="space-y-8 text-sm leading-relaxed text-muted-foreground">
      <section id="what-holding-period-return" className="scroll-mt-24 space-y-3">
        <h2 className="text-lg font-semibold text-accent">What Holding Period Return Means</h2>
        <p>
          Holding period return combines price appreciation (or loss) with dividends received while
          you held the share. Enter bought price, current price, and dividend income per share to
          see capital gains yield, dividend yield, and the combined return.
        </p>
      </section>

      <section id="how-we-calculate" className="scroll-mt-24 space-y-3">
        <h2 className="text-lg font-semibold text-accent">How We Calculate</h2>
        <p>
          Capital gains yield = ((current − bought) ÷ bought) × 100. Dividend yield = (dividend ÷
          bought) × 100. Holding period return is the sum of those two yields, which is the same as
          ((current − bought + dividend) ÷ bought) × 100. Bought price must be greater than zero.
        </p>
      </section>

      <section id="holding-period-return-faq" className="scroll-mt-24 space-y-4">
        <h2 className="text-lg font-semibold text-accent">Frequently Asked Questions</h2>
        {HOLDING_PERIOD_RETURN_FAQS.map((faq) => (
          <div key={faq.question} className="space-y-1.5">
            <h3 className="font-medium text-accent">{faq.question}</h3>
            <p>{faq.answer}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
