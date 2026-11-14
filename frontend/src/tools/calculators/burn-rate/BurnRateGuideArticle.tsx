import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { BURN_RATE_FAQS } from './content';

const sections: { id: string; title: string; body: string[]; formula?: string }[] = [
  {
    id: 'what-burn-rate',
    title: 'What Burn Rate Means',
    body: [
      'Burn rate measures how quickly a cash balance falls between two points in time. Startups and finance teams use it with cash runway to estimate how long remaining cash lasts at the current spend rate.',
    ],
  },
  {
    id: 'burn-rate-formulas',
    title: 'Formulas',
    body: [
      'Convert the entered duration into months, then divide the drop in balance by that length. The result is always shown as a monthly burn rate.',
    ],
    formula: 'Burn rate (/ mo) = (Initial balance − Final balance) ÷ Duration in months',
  },
  {
    id: 'cash-runway',
    title: 'Cash Runway',
    body: [
      'Cash runway divides the final balance by the monthly burn rate. If burn rate is zero or negative, runway is N/A because cash is not being depleted under these inputs.',
    ],
    formula: 'Cash runway (months) = Final balance ÷ Burn rate  (when burn rate > 0)',
  },
  {
    id: 'burn-rate-example',
    title: 'Example',
    body: [
      'Initial balance 100,000, final balance 60,000, duration 4 months. Burn rate = (100,000 − 60,000) ÷ 4 = 10,000 per month. Cash runway = 60,000 ÷ 10,000 = 6 months.',
    ],
  },
];

export function BurnRateGuideArticle() {
  return (
    <div className="rounded-2xl border border-border bg-white px-5 py-6 shadow-xs sm:px-8 sm:py-8">
      <div className="divide-y divide-border">
        {sections.map((section) => (
          <article key={section.id} id={section.id} className="scroll-mt-24 py-7 first:pt-0">
            <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
              {section.title}
            </h2>
            <div className="mt-3.5 space-y-4 text-[15px] font-normal leading-[1.72] text-foreground/85 sm:text-base sm:leading-[1.75]">
              {section.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            {section.formula ? (
              <div className="mt-5 overflow-x-auto rounded-xl border border-border bg-brand-softTeal/55 px-4 py-3.5 sm:px-5">
                <p className="font-mono text-xs font-medium text-accent sm:text-sm">{section.formula}</p>
              </div>
            ) : null}
          </article>
        ))}
        <section id="burn-rate-faq" className="scroll-mt-24 pt-7">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            Frequently Asked Questions
          </h2>
          <div className="mt-4">
            <FAQAccordion items={BURN_RATE_FAQS} />
          </div>
        </section>
      </div>
    </div>
  );
}
