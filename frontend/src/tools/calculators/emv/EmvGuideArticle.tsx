import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { EMV_FAQS } from './content';

const sections: { id: string; title: string; body: string[]; formula?: string }[] = [
  {
    id: 'what-emv',
    title: 'What EMV Means',
    body: [
      'Expected monetary value (EMV) weights each risk’s impact by how likely it is. Project managers use it to compare threats and opportunities on a common currency scale.',
    ],
  },
  {
    id: 'emv-formulas',
    title: 'Formulas',
    body: [
      'For each risk, multiply impact by probability as a decimal. Total EMV is the sum across all selected risks.',
    ],
    formula: 'Risk EMV = Impact × (Probability ÷ 100)\nTotal EMV = Σ Risk EMV',
  },
  {
    id: 'emv-sign',
    title: 'Loss vs Gain',
    body: [
      'Positive impact values produce a positive EMV and are treated here as expected loss (threat). For opportunities, enter a negative impact so the EMV reflects expected gain. The sign of each impact is preserved in the total.',
    ],
  },
  {
    id: 'emv-example',
    title: 'Example',
    body: [
      'Risk 1: PKR 10,000 at 30% → PKR 3,000. Risk 2: PKR 5,000 at 20% → PKR 1,000. Total EMV = PKR 4,000 expected loss.',
    ],
  },
];

export function EmvGuideArticle() {
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
        <section id="emv-faq" className="scroll-mt-24 pt-7">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            Frequently Asked Questions
          </h2>
          <div className="mt-4">
            <FAQAccordion faqs={[...EMV_FAQS]} />
          </div>
        </section>
      </div>
    </div>
  );
}
