import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { COMPOUND_INTEREST_FAQS } from './content';

const sections: { id: string; title: string; body: string[]; formula?: string }[] = [
  {
    id: 'what-compound-interest',
    title: 'What Compound Interest Means',
    body: [
      'Compound interest earns returns on both the original principal and previously credited interest. More frequent compounding and regular deposits both increase the ending balance for the same nominal annual rate.',
    ],
  },
  {
    id: 'compound-interest-formulas',
    title: 'Formulas',
    body: [
      'The closed-form balance without deposits is A = P × (1 + r/n)^(n×t). Term months are converted as years + months/12. Total compound interest is final balance minus all principal contributed.',
    ],
    formula:
      'A = P × (1 + r/n)^(n×t); Interest = Final balance − (Initial + Deposits)',
  },
  {
    id: 'compound-interest-example',
    title: 'Example',
    body: [
      'Initial PKR 1,000 at 8% for 20 years with monthly compounding and no deposits → final balance ≈ PKR 4,926.80 and compound interest ≈ PKR 3,926.80.',
    ],
  },
];

export function CompoundInterestGuideArticle() {
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
        <section id="compound-interest-faq" className="scroll-mt-24 pt-7">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            Frequently Asked Questions
          </h2>
          <div className="mt-4">
            <FAQAccordion items={[...COMPOUND_INTEREST_FAQS]} />
          </div>
        </section>
      </div>
    </div>
  );
}
