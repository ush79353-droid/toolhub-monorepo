import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { CAGR_FAQS } from './content';

const sections: { id: string; title: string; body: string[]; formula?: string }[] = [
  {
    id: 'what-cagr',
    title: 'What CAGR Means',
    body: [
      'CAGR measures how fast an investment grew (or shrank) on a compounded yearly basis between a starting value and an ending value. It ignores deposits and withdrawals within the period and assumes smooth compounding.',
    ],
  },
  {
    id: 'cagr-formulas',
    title: 'Formulas',
    body: [
      'Solve CAGR from initial, final, and periods; or rearrange to find final, initial, or periods when the other three are known.',
    ],
    formula:
      'CAGR = ((Final ÷ Initial)^(1 ÷ Periods) − 1) × 100; Final = Initial × (1 + CAGR/100)^Periods',
  },
  {
    id: 'cagr-example',
    title: 'Example',
    body: [
      'Initial PKR 10,000, final PKR 15,000, 5 periods → CAGR ≈ 8.45%. Absolute change is PKR 5,000 (50%).',
    ],
  },
];

export function CagrGuideArticle() {
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
        <section id="cagr-faq" className="scroll-mt-24 pt-7">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            Frequently Asked Questions
          </h2>
          <div className="mt-4">
            <FAQAccordion items={[...CAGR_FAQS]} />
          </div>
        </section>
      </div>
    </div>
  );
}
