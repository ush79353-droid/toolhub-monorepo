import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { GMROI_FAQS } from './content';

const sections: { id: string; title: string; body: string[]; formula?: string }[] = [
  {
    id: 'what-gmroi',
    title: 'What GMROI Means',
    body: [
      'GMROI (gross margin return on investment) shows how efficiently inventory turns into gross profit. Retailers use it to compare categories and seasons on a common ratio scale.',
    ],
  },
  {
    id: 'gmroi-formulas',
    title: 'Formulas',
    body: [
      'Average inventory defaults to the midpoint of starting and ending inventory. GMROI divides gross profit by that average. The percentage form multiplies the ratio by 100.',
    ],
    formula:
      'Average inventory = (Starting + Final) ÷ 2\nGMROI = Gross profit ÷ Average inventory\nGMROI % = GMROI × 100',
  },
  {
    id: 'gmroi-example',
    title: 'Example',
    body: [
      'Starting PKR 50,000, final PKR 30,000 → average PKR 40,000. With gross profit PKR 60,000 → GMROI 1.50 and 150%.',
    ],
  },
];

export function GmroiGuideArticle() {
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
        <section id="gmroi-faq" className="scroll-mt-24 pt-7">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            Frequently Asked Questions
          </h2>
          <div className="mt-4">
            <FAQAccordion items={[...GMROI_FAQS]} />
          </div>
        </section>
      </div>
    </div>
  );
}
