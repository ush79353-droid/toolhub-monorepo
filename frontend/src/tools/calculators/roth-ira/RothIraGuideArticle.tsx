import { ROTH_IRA_FAQS } from './content';
import { ROTH_RULE_YEAR } from './roth-limits';

export function RothIraGuideArticle() {
  return (
    <article className="prose-sm max-w-none space-y-8 text-muted-foreground">
      <section id="introduction" className="scroll-mt-24 space-y-3">
        <h2 className="text-xl font-semibold text-accent">Roth IRA Calculator</h2>
        <p>
          Estimate your {ROTH_RULE_YEAR} Roth IRA contribution limit after MAGI
          phase-outs, see an illustrative after-tax cost, and project a
          constant-return balance if you contribute the eligible amount each
          year until retirement.
        </p>
      </section>

      <section id="how-it-works" className="scroll-mt-24 space-y-3">
        <h2 className="text-xl font-semibold text-accent">How It Works</h2>
        <ol className="list-decimal space-y-1 pl-5">
          <li>Enter MAGI, current age, and planned retirement age.</li>
          <li>Choose tax filing status and an income tax rate.</li>
          <li>Set an assumed annual portfolio return.</li>
          <li>
            Read max vs eligible contribution, after-tax view, and projected
            balance.
          </li>
        </ol>
      </section>

      <section id="limits" className="scroll-mt-24 space-y-3">
        <h2 className="text-xl font-semibold text-accent">
          {ROTH_RULE_YEAR} Limits &amp; Phase-Outs
        </h2>
        <p>
          Limits follow IRS Notice 2025-67 / Pub 590-A: $7,500 base ($8,600 with
          age-50 catch-up). Phase-out bands: single $153k–$168k; MFJ
          $242k–$252k; MFS $0–$10k. Reduced amounts round up to the next $10.
        </p>
      </section>

      <section id="projection" className="scroll-mt-24 space-y-3">
        <h2 className="text-xl font-semibold text-accent">
          Retirement Projection
        </h2>
        <p>
          Balance = eligible annual contribution compounded as an end-of-year
          ordinary annuity at your stated return for (retirement age − current
          age) years. Returns are illustrative and constant.
        </p>
      </section>

      <section id="limitations" className="scroll-mt-24 space-y-3">
        <h2 className="text-xl font-semibold text-accent">Limitations</h2>
        <p>
          Does not model the earned-income ceiling, backdoor Roth strategies,
          employer plans, state taxes, or sequence-of-returns risk. Not tax
          advice.
        </p>
      </section>

      <section id="roth-ira-faq" className="scroll-mt-24 space-y-4">
        <h2 className="text-xl font-semibold text-accent">
          Frequently Asked Questions
        </h2>
        <dl className="space-y-4">
          {ROTH_IRA_FAQS.map((faq) => (
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
