import { SWP_FAQS } from './content';

export function SwpGuideArticle() {
  return (
    <article className="prose-sm max-w-none space-y-8 text-muted-foreground">
      <section id="introduction" className="scroll-mt-24 space-y-3">
        <h2 className="text-xl font-semibold text-accent">
          SWP Calculator — Systematic Withdrawal Plan
        </h2>
        <p>
          Size the nest egg for scheduled withdrawals, find a sustainable
          withdrawal, estimate how long money lasts, project an ending balance,
          or solve for the required return — with optional inflation growth.
        </p>
      </section>

      <section id="how-it-works" className="scroll-mt-24 space-y-3">
        <h2 className="text-xl font-semibold text-accent">How It Works</h2>
        <ol className="list-decimal space-y-1 pl-5">
          <li>Choose what you want to solve for.</li>
          <li>
            Enter withdrawal size/frequency/duration, expected return, inflation,
            and first withdrawal date as needed.
          </li>
          <li>
            Read opening balance, periodic withdrawal, totals, count, and last
            withdrawal date.
          </li>
        </ol>
      </section>

      <section id="formulas" className="scroll-mt-24 space-y-3">
        <h2 className="text-xl font-semibold text-accent">Formulas</h2>
        <p>
          Period rate <code className="text-accent">r = i/q</code>. Beginning
          withdrawals use an annuity-due (or growing annuity-due) present value.
          Duration uses a beginning-of-period simulation. Rate of return is
          solved numerically.
        </p>
      </section>

      <section id="limitations" className="scroll-mt-24 space-y-3">
        <h2 className="text-xl font-semibold text-accent">Limitations</h2>
        <p>
          Educational only — omits taxes, fees, and sequence-of-returns risk.
          Constant returns and inflation are assumptions.
        </p>
      </section>

      <section id="swp-faq" className="scroll-mt-24 space-y-4">
        <h2 className="text-xl font-semibold text-accent">
          Frequently Asked Questions
        </h2>
        <dl className="space-y-4">
          {SWP_FAQS.map((faq) => (
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
