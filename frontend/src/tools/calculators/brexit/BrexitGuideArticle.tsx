import { BREXIT_FAQS } from './content';
import {
  DEFAULT_CURRENT_WEEKLY_LOSS_GBP,
  DEFAULT_GOVERNMENT_SPENDING_GBP,
  PRE_2020_WEEKLY_LOSS_GBP,
  POST_2020_ANNUAL_LOSS_GBP,
  SOURCE_SUMMARY,
} from './constants';

export function BrexitGuideArticle() {
  return (
    <article className="prose-sm max-w-none space-y-8 text-muted-foreground">
      <section id="introduction" className="scroll-mt-24 space-y-3">
        <h2 className="text-xl font-semibold text-accent">Brexit Calculator</h2>
        <p>
          This tool turns an illustrative “cost of Brexit” running total into
          tangible comparisons — how many hospitals, school places, wind
          turbines, or nurse-years the same amount of money could notionally
          fund. It is designed for education and discussion, not for budgeting
          or political advocacy claims.
        </p>
      </section>

      <section id="how-it-works" className="scroll-mt-24 space-y-3">
        <h2 className="text-xl font-semibold text-accent">
          How the Estimate Works
        </h2>
        <p>
          Cost so far = government spending add-on + GDP-loss estimate from the
          start time to the end time. The GDP-loss estimate uses one weekly rate
          before 1 January 2020 and your editable “Current cost” rate afterward.
          Opportunity counts are{' '}
          <code className="text-accent">floor(cost ÷ unit cost)</code>.
        </p>
      </section>

      <section id="dual-rate" className="scroll-mt-24 space-y-3">
        <h2 className="text-xl font-semibold text-accent">
          Dual GDP-Loss Rates
        </h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            Pre-2020 default: £
            {PRE_2020_WEEKLY_LOSS_GBP.toLocaleString('en-GB')}/week
          </li>
          <li>
            Post-2020 default: £
            {POST_2020_ANNUAL_LOSS_GBP.toLocaleString('en-GB')}/year (≈ £
            {DEFAULT_CURRENT_WEEKLY_LOSS_GBP.toLocaleString('en-GB')}/week)
          </li>
          <li>
            Default government add-on: £
            {DEFAULT_GOVERNMENT_SPENDING_GBP.toLocaleString('en-GB')}
          </li>
        </ul>
      </section>

      <section id="opportunity" className="scroll-mt-24 space-y-3">
        <h2 className="text-xl font-semibold text-accent">
          Opportunity Comparisons
        </h2>
        <p>
          Unit costs (hospital, school, nurse salary, etc.) are fixed reference
          pounds from educational source notes. They are not live tender prices.
          A few satirical rows exist only to keep scale intuitive.
        </p>
      </section>

      <section id="limitations" className="scroll-mt-24 space-y-3">
        <h2 className="text-xl font-semibold text-accent">Limitations</h2>
        <p>
          Unrealised GDP is not a cash balance the Treasury can spend. Dual
          rates are stylised. Unit costs age. Local taxes, inflation, and
          crowding-out are ignored. Treat outputs as conversation aids.
        </p>
      </section>

      <section id="sources" className="scroll-mt-24 space-y-3">
        <h2 className="text-xl font-semibold text-accent">
          Sources &amp; Assumptions
        </h2>
        <p>{SOURCE_SUMMARY}</p>
      </section>

      <section id="brexit-faq" className="scroll-mt-24 space-y-4">
        <h2 className="text-xl font-semibold text-accent">
          Frequently Asked Questions
        </h2>
        <dl className="space-y-4">
          {BREXIT_FAQS.map((faq) => (
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
