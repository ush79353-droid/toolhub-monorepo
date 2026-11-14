import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { COST_OF_DOING_BUSINESS_FAQS } from './content';

const sections: { id: string; title: string; body: string[]; formula?: string }[] = [
  {
    id: 'what-codb',
    title: 'What Cost of Doing Business Means',
    body: [
      'Cost of doing business in this calculator is your fully loaded annual cost spread across billable days. Freelancers and agencies use it to set day rates that cover overhead, not only direct project time.',
    ],
  },
  {
    id: 'codb-formula',
    title: 'Formula',
    body: [
      'Divide total annual cost by total billable days per year. The result updates automatically when both inputs are valid.',
    ],
    formula: 'Cost of doing business = Total annual cost ÷ Total billable days per year',
  },
  {
    id: 'codb-example',
    title: 'Example',
    body: [
      'Annual cost PKR 1,200,000 and 240 billable days → PKR 5,000 per billable day.',
    ],
  },
];

export function CostOfDoingBusinessGuideArticle() {
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
        <section id="codb-faq" className="scroll-mt-24 pt-7">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            Frequently Asked Questions
          </h2>
          <div className="mt-4">
            <FAQAccordion faqs={[...COST_OF_DOING_BUSINESS_FAQS]} />
          </div>
        </section>
      </div>
    </div>
  );
}
