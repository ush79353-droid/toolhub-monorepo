import { THUK_FAQS } from './content';

export function TakeHomePayUkGuideArticle() {
  return (
    <article className="prose-sm max-w-none space-y-8 text-muted-foreground">
      <section id="introduction" className="scroll-mt-24 space-y-3">
        <h2 className="text-xl font-semibold text-accent">
          Take Home Pay Calculator UK
        </h2>
        <p>
          Estimate UK take-home pay from employment, self-employment, and rental
          income with location-specific Income Tax and National Insurance for
          supported tax years.
        </p>
      </section>

      <section id="how-it-works" className="scroll-mt-24 space-y-3">
        <h2 className="text-xl font-semibold text-accent">How It Works</h2>
        <ol className="list-decimal space-y-1 pl-5">
          <li>Select UK location and tax year.</li>
          <li>Enter employment, self-employment, and rental incomes.</li>
          <li>
            Read total income, tax, NI split, and estimated take-home pay.
          </li>
        </ol>
      </section>

      <section id="tax-ni" className="scroll-mt-24 space-y-3">
        <h2 className="text-xl font-semibold text-accent">Income Tax &amp; NI</h2>
        <p>
          Income Tax uses rest-of-UK or Scottish bands after Personal Allowance
          taper. Employee Class 1 (category A) and Class 4 reuse the National
          Insurance Calculator parameters for the same tax years.
        </p>
      </section>

      <section id="limitations" className="scroll-mt-24 space-y-3">
        <h2 className="text-xl font-semibold text-accent">Limitations</h2>
        <p>
          Educational estimate only — omits pension relief, student loans,
          Blind Person’s / Marriage Allowance, dividends, and savings rates.
          Not a substitute for HMRC software or professional advice.
        </p>
      </section>

      <section id="take-home-pay-uk-faq" className="scroll-mt-24 space-y-4">
        <h2 className="text-xl font-semibold text-accent">
          Frequently Asked Questions
        </h2>
        <dl className="space-y-4">
          {THUK_FAQS.map((faq) => (
            <div key={faq.question}>
              <dt className="font-medium text-accent">{faq.question}</dt>
              <dd className="mt-1">{faq.answer}</dd>
            </div>
          ))}
        </dl>
      </section>
    </article>
  );
}
