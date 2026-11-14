import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { CHURN_RATE_FAQS } from './content';

const sections: { id: string; title: string; body: string[]; formula?: string }[] = [
  {
    id: 'what-churn-rate',
    title: 'What Churn Rate Means',
    body: [
      'Churn rate measures how many customers leave during a period relative to how many you started with. Product, finance, and customer-success teams use it to track retention and estimate average customer lifetime under a constant churn assumption.',
    ],
  },
  {
    id: 'churn-formulas',
    title: 'Formulas',
    body: [
      'Divide customers lost by starting customers, then multiply by 100 for a percentage. Customer lifetime in periods is the reciprocal relationship starting ÷ lost when at least one customer is lost.',
    ],
    formula:
      'Churn % = (Customers lost ÷ Starting customers) × 100; Lifetime (periods) = Starting ÷ Lost',
  },
  {
    id: 'customer-lifetime',
    title: 'Customer Lifetime',
    body: [
      'With constant period churn, average lifetime in periods is approximately 1 ÷ churn rate (as a decimal), which equals starting ÷ lost. If lost customers are zero, lifetime is not a finite number and the calculator shows “No finite estimate”.',
    ],
  },
  {
    id: 'churn-example',
    title: 'Example',
    body: [
      '1,000 customers at the start and 50 lost → churn rate = 5%, customer lifetime = 20 periods.',
    ],
  },
];

export function ChurnRateGuideArticle() {
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
        <section id="churn-rate-faq" className="scroll-mt-24 pt-7">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            Frequently Asked Questions
          </h2>
          <div className="mt-4">
            <FAQAccordion items={CHURN_RATE_FAQS} />
          </div>
        </section>
      </div>
    </div>
  );
}
