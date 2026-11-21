import { RW_FAQS } from './content';

export function RetirementWithdrawalGuideArticle() {
  return (
    <article className="prose-sm max-w-none space-y-8 text-muted-foreground">
      <section id="introduction" className="scroll-mt-24 space-y-3">
        <h2 className="text-xl font-semibold text-accent">
          Retirement Withdrawal Calculator
        </h2>
        <p>
          Plan how much you can withdraw from a retirement nest egg — or how
          long a chosen withdrawal lasts — with compounding, withdrawal timing,
          payment frequency, and optional inflation before and after retirement.
        </p>
      </section>

      <section id="how-it-works" className="scroll-mt-24 space-y-3">
        <h2 className="text-xl font-semibold text-accent">How It Works</h2>
        <ol className="list-decimal space-y-1 pl-5">
          <li>
            Choose whether to solve for withdrawal amount or for duration.
          </li>
          <li>
            Enter the balance at retirement, ages, rates, and (when solving for
            amount) planned years in retirement.
          </li>
          <li>
            Optionally open advanced settings for frequency, compounding,
            timing, and ending balance.
          </li>
          <li>
            Read the primary answer, summary, and yearly principal projection.
          </li>
        </ol>
      </section>

      <section id="formulas" className="scroll-mt-24 space-y-3">
        <h2 className="text-xl font-semibold text-accent">Formulas</h2>
        <p>
          Period rate{' '}
          <code className="text-accent">
            r = (1 + i/m)^(m/q) − 1
          </code>{' '}
          (or continuous{' '}
          <code className="text-accent">r = e^(i/q) − 1</code>). Level
          withdrawals use the annuity-due or ordinary-annuity payment that
          moves the nest egg to the target ending balance over{' '}
          <code className="text-accent">n = years × q</code> periods. Growing
          withdrawals (post-retirement inflation) use a growing-annuity present
          value for the first payment.
        </p>
      </section>

      <section id="inflation-timing" className="scroll-mt-24 space-y-3">
        <h2 className="text-xl font-semibold text-accent">
          Inflation &amp; Timing
        </h2>
        <p>
          Pre-retirement inflation grows today&apos;s nest-egg figure to
          retirement-start dollars. Post-retirement inflation increases each
          successive withdrawal. Beginning-of-period timing withdraws before
          interest for that period; end-of-period reverses the order.
        </p>
      </section>

      <section id="limitations" className="scroll-mt-24 space-y-3">
        <h2 className="text-xl font-semibold text-accent">Limitations</h2>
        <p>
          This tool is educational. It omits taxes, fees, sequence-of-returns
          risk, Social Security, required minimum distributions, and portfolio
          glide paths. Results are not financial advice.
        </p>
      </section>

      <section
        id="retirement-withdrawal-faq"
        className="scroll-mt-24 space-y-4"
      >
        <h2 className="text-xl font-semibold text-accent">
          Frequently Asked Questions
        </h2>
        <dl className="space-y-4">
          {RW_FAQS.map((faq) => (
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
