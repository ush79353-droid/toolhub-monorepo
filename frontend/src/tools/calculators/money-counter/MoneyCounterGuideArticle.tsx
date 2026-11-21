import { MONEY_COUNTER_FAQS } from './content';
import { MONEY_COUNTER_CURRENCIES } from './denominations';

export function MoneyCounterGuideArticle() {
  return (
    <article className="prose-sm max-w-none space-y-8 text-muted-foreground">
      <section id="introduction" className="scroll-mt-24 space-y-3">
        <h2 className="text-xl font-semibold text-accent">
          Money Counter Calculator
        </h2>
        <p>
          Add up cash on hand by counting each banknote and coin denomination.
          Useful for till reconciliation, travel wallets, and classroom money
          skills — without treating currency selection as FX conversion.
        </p>
      </section>

      <section id="how-it-works" className="scroll-mt-24 space-y-3">
        <h2 className="text-xl font-semibold text-accent">How It Works</h2>
        <ol className="list-decimal space-y-1 pl-5">
          <li>Select a currency (denomination set only).</li>
          <li>Optionally enable coins.</li>
          <li>Enter whole-number counts for each face value.</li>
          <li>Read the total money and optional line breakdown.</li>
        </ol>
      </section>

      <section id="denominations" className="scroll-mt-24 space-y-3">
        <h2 className="text-xl font-semibold text-accent">
          Supported Denominations
        </h2>
        <p>
          Built-in sets: {MONEY_COUNTER_CURRENCIES.join(', ')}. USD matches the
          reference screenshot ($1–$100 notes; coins when enabled). Other
          currencies use everyday circulating notes and coins from their
          central-bank / mint lists.
        </p>
      </section>

      <section id="formula" className="scroll-mt-24 space-y-3">
        <h2 className="text-xl font-semibold text-accent">Formula</h2>
        <p>
          <code className="text-accent">
            total = Σ (countᵢ × faceValueᵢ)
          </code>{' '}
          computed in integer minor units (cents, pence, etc.) then formatted
          for display.
        </p>
      </section>

      <section id="limitations" className="scroll-mt-24 space-y-3">
        <h2 className="text-xl font-semibold text-accent">Limitations</h2>
        <p>
          Commemorative issues, withdrawn notes still legal tender beyond the
          listed set, and Scottish/NI banknotes are out of scope. Lists can lag
          official schedule changes.
        </p>
      </section>

      <section id="money-counter-faq" className="scroll-mt-24 space-y-4">
        <h2 className="text-xl font-semibold text-accent">
          Frequently Asked Questions
        </h2>
        <dl className="space-y-4">
          {MONEY_COUNTER_FAQS.map((faq) => (
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
