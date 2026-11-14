import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { PPM_FAQS } from './content';

const sections: { id: string; title: string; body: string[]; formula?: string }[] = [
  {
    id: 'what-is-ppm',
    title: 'What Are Pre- and Post-Money Valuations?',
    body: [
      'Pre-money valuation is the company value before new capital. Post-money valuation adds the investment. Investor equity is the investment’s share of post-money value.',
    ],
  },
  {
    id: 'ppm-formula',
    title: 'Formulas',
    body: [
      'Enter any two independent values. Related blanks fill without changing what you typed.',
    ],
    formula:
      'Post-money = Pre-money + Investment · Equity% = Investment / Post-money × 100 · Investment = Post-money × Equity / 100',
  },
  {
    id: 'ppm-example',
    title: 'Example',
    body: [
      'Investment PKR 2,000,000 at 20% equity → post-money PKR 10,000,000 and pre-money PKR 8,000,000.',
    ],
  },
];

export function PreAndPostMoneyValuationGuideArticle() {
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
        <section id="ppm-faq" className="scroll-mt-24 pt-7">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            Frequently Asked Questions
          </h2>
          <div className="mt-4">
            <FAQAccordion items={PPM_FAQS} />
          </div>
        </section>
      </div>
    </div>
  );
}
