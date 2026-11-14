import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { MAN_HOURS_FAQS } from './content';

const sections: { id: string; title: string; body: string[]; formula?: string }[] = [
  {
    id: 'what-are-man-hours',
    title: 'What Are Man-Hours?',
    body: [
      'Man-hours measure total labor time as people × hours each person works. Pair that total with hourly pay to estimate cost per person and overall labor cost.',
    ],
  },
  {
    id: 'man-hours-formula',
    title: 'Formulas',
    body: [
      'Man-hours scale with headcount and hours. Cost per person uses hours and pay; total cost multiplies man-hours by hourly pay.',
    ],
    formula:
      'Man-hours = People × Hours per person · Cost per person = Hours per person × Hourly pay · Total cost = Man-hours × Hourly pay',
  },
  {
    id: 'man-hours-example',
    title: 'Example',
    body: [
      '5 people, 8 hours each, and PKR 500 hourly pay → 40 man-hours, PKR 4,000 per person, and PKR 20,000 total cost.',
    ],
  },
];

export function ManHoursGuideArticle() {
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
        <section id="man-hours-faq" className="scroll-mt-24 pt-7">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            Frequently Asked Questions
          </h2>
          <div className="mt-4">
            <FAQAccordion items={MAN_HOURS_FAQS} />
          </div>
        </section>
      </div>
    </div>
  );
}
