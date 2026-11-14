import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { CAC_FAQS } from './content';

const sections: { id: string; title: string; body: string[]; formula?: string }[] = [
  {
    id: 'what-is-cac',
    title: 'What Is CAC?',
    body: [
      'Customer acquisition cost (CAC) estimates how much you spend, on average, to win one new customer. It helps compare channel efficiency and whether growth spending is sustainable.',
    ],
  },
  {
    id: 'cac-formula',
    title: 'Formula',
    body: [
      'Add marketing and sales costs for the same period, then divide by the number of new customers acquired in that period.',
    ],
    formula: 'CAC = (Cost of marketing + Cost of sales) ÷ Number of new customers',
  },
  {
    id: 'cac-example',
    title: 'Example',
    body: [
      'Marketing 50,000 + sales 30,000 = 80,000 total acquisition spend. With 200 new customers, CAC = 80,000 ÷ 200 = 400 per customer.',
    ],
  },
];

export function CustomerAcquisitionCostGuideArticle() {
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
        <section id="cac-faq" className="scroll-mt-24 pt-7">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            Frequently Asked Questions
          </h2>
          <div className="mt-4">
            <FAQAccordion items={CAC_FAQS} />
          </div>
        </section>
      </div>
    </div>
  );
}
