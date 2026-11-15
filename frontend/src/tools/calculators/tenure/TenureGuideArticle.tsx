import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { TENURE_FAQS } from './content';

const sections: { id: string; title: string; body: string[]; formula?: string }[] = [
  {
    id: 'what-tenure',
    title: 'What Tenure Means',
    body: [
      'Tenure is how long employees stay with an organization. This calculator covers two common views: average tenure across a workforce from combined service time and headcount, and the exact calendar duration between two dates for one person or engagement.',
    ],
  },
  {
    id: 'tenure-formulas',
    title: 'Formulas',
    body: [
      'Average tenure divides combined service (converted to years) by the number of employees. Specific duration subtracts the starting date from the ending date using calendar years, months, and days.',
    ],
    formula:
      'Average tenure (yrs) = Combined duration (yrs) ÷ Employees; Specific tenure = Ending date − Starting date',
  },
  {
    id: 'tenure-example',
    title: 'Examples',
    body: [
      '100 employees with 650 combined years of service → average tenure 6.5 years. January 1, 2020 to January 1, 2025 → 5 years of service.',
    ],
  },
];

export function TenureGuideArticle() {
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
                <p className="font-mono text-xs font-medium text-accent sm:text-sm">
                  {section.formula}
                </p>
              </div>
            ) : null}
          </article>
        ))}
        <section id="tenure-faq" className="scroll-mt-24 pt-7">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            Frequently Asked Questions
          </h2>
          <div className="mt-4">
            <FAQAccordion items={[...TENURE_FAQS]} />
          </div>
        </section>
      </div>
    </div>
  );
}
