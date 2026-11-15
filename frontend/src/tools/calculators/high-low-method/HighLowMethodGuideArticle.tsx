import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { HIGH_LOW_METHOD_FAQS } from './content';

const sections: { id: string; title: string; body: string[]; formula?: string }[] = [
  {
    id: 'what-high-low',
    title: 'What the High-Low Method Means',
    body: [
      'The high-low method estimates a linear cost function from two activity extremes. Managers use it when they need a quick split between fixed and variable costs without a full regression.',
    ],
  },
  {
    id: 'high-low-formulas',
    title: 'Formulas',
    body: [
      'Variable cost per unit is the slope between the high and low points. Fixed cost is the high-point intercept. Total cost applies that line at units (x).',
    ],
    formula:
      'VC = (High cost − Low cost) ÷ (High volume − Low volume)\nFC = High cost − (VC × High volume)\nTC = FC + (VC × x)',
  },
  {
    id: 'high-low-example',
    title: 'Example',
    body: [
      'High PKR 30,000 at 1,000 units and low PKR 18,000 at 400 units → VC PKR 20, FC PKR 10,000. At 700 units, TC = PKR 24,000.',
    ],
  },
];

export function HighLowMethodGuideArticle() {
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
        <section id="high-low-faq" className="scroll-mt-24 pt-7">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            Frequently Asked Questions
          </h2>
          <div className="mt-4">
            <FAQAccordion items={[...HIGH_LOW_METHOD_FAQS]} />
          </div>
        </section>
      </div>
    </div>
  );
}
