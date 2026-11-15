import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { CUSTOMER_RETENTION_FAQS } from './content';

const sections: { id: string; title: string; body: string[]; formula?: string }[] = [
  {
    id: 'what-retention',
    title: 'What Retention Rate Means',
    body: [
      'Customer retention rate shows what share of your starting customers stayed through the period after removing newly acquired customers from the ending headcount. Attrition is simply the remainder.',
    ],
  },
  {
    id: 'retention-formulas',
    title: 'Formulas',
    body: [
      'Retained customers equal total customers minus new customers. Retention divides that by existing customers. Attrition is 100 minus retention.',
    ],
    formula:
      'Retained = Total − New\nRetention % = (Retained ÷ Existing) × 100\nAttrition % = 100 − Retention',
  },
  {
    id: 'retention-example',
    title: 'Example',
    body: [
      'Existing 1,000, new 200, total 1,100 → retained 900, retention 90%, attrition 10%.',
    ],
  },
];

export function CustomerRetentionRateGuideArticle() {
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
                <p className="whitespace-pre-line font-mono text-xs font-medium text-accent sm:text-sm">
                  {section.formula}
                </p>
              </div>
            ) : null}
          </article>
        ))}
        <section id="retention-faq" className="scroll-mt-24 pt-7">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            Frequently Asked Questions
          </h2>
          <div className="mt-4">
            <FAQAccordion faqs={[...CUSTOMER_RETENTION_FAQS]} />
          </div>
        </section>
      </div>
    </div>
  );
}
