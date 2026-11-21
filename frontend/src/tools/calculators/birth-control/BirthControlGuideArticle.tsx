import { BIRTH_CONTROL_FAQS } from './content';
import { CYCLE_DAYS, DAYS_PER_YEAR } from './types';

export function BirthControlGuideArticle() {
  return (
    <article className="prose prose-sm max-w-none text-accent">
      <section id="introduction" className="scroll-mt-24">
        <h2>Birth Control Calculator</h2>
        <p>
          Compare the ongoing or one-time costs of common contraceptive options
          for females and males. Enter what you pay for each method, optionally
          add condom packs, and see how much you will spend over days, weeks,
          months, or years.
        </p>
        <p>
          This tool is for budgeting only. It does not recommend a method,
          estimate effectiveness, or replace advice from a clinician.
        </p>
      </section>

      <section id="how-it-works" className="scroll-mt-24">
        <h2>How Cost Estimates Work</h2>
        <p>
          Horizon length uses a {DAYS_PER_YEAR}-day year (matching common
          calendar-year conventions). Recurring pill, patch, and ring packs use
          a {CYCLE_DAYS}-day cycle. Long-acting methods prorate their price over
          the longevity you enter. Sterilization and vasectomy use a one-time
          procedure cost.
        </p>
      </section>

      <section id="methods" className="scroll-mt-24">
        <h2>Methods and Cadence</h2>
        <ul>
          <li>
            <strong>Pill / patch / ring:</strong> cost per cycle × horizonDays /{' '}
            {CYCLE_DAYS}
          </li>
          <li>
            <strong>IUD / injection / implant:</strong> price × horizon /
            longevity
          </li>
          <li>
            <strong>Female condom / male condoms:</strong> usage × pack price ×
            horizon / pack size
          </li>
          <li>
            <strong>Sterilization / vasectomy:</strong> procedure cost (once),
            plus optional condoms
          </li>
        </ul>
      </section>

      <section id="condoms" className="scroll-mt-24">
        <h2>Condom Costs</h2>
        <p>
          When condoms are the primary method, or when you answer Yes to buying
          condoms alongside another method, enter pack size, how many you
          usually need per period, and pack price. Packs may be fractional in
          the estimate so short horizons stay smooth.
        </p>
      </section>

      <section id="currency" className="scroll-mt-24">
        <h2>Currencies and FX</h2>
        <p>
          Each cost field has its own currency selector. The result currency is
          independent. Same-currency totals need no exchange quote. Distinct
          currencies convert with Omega’s stored Phase 2 rate map; missing rates
          block conversion instead of inventing a 1:1 rate.
        </p>
      </section>

      <section id="example" className="scroll-mt-24">
        <h2>Worked Example</h2>
        <p>
          Pill at 20 PKR per 28-day cycle for 1 year with no condoms:{' '}
          20 × {DAYS_PER_YEAR} / {CYCLE_DAYS} ≈ <strong>260.89 PKR</strong>.
        </p>
      </section>

      <section id="limitations" className="scroll-mt-24">
        <h2>Limitations</h2>
        <p>
          Retail prices, insurance coverage, clinic fees, and product longevity
          vary widely. The calculator does not model effectiveness, side
          effects, STI risk beyond the condom reminder, or insurance
          reimbursement.
        </p>
      </section>

      <section id="bc-faq" className="scroll-mt-24">
        <h2>Frequently Asked Questions</h2>
        <dl>
          {BIRTH_CONTROL_FAQS.map((faq) => (
            <div key={faq.question} className="mb-3">
              <dt className="font-medium">{faq.question}</dt>
              <dd className="mt-1 text-muted-foreground">{faq.answer}</dd>
            </div>
          ))}
        </dl>
      </section>
    </article>
  );
}
