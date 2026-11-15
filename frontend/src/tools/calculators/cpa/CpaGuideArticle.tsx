import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { CPA_FAQS } from './content';

const sections: { id: string; title: string; body: string[]; formula?: string }[] = [
  {
    id: 'what-cpa',
    title: 'What CPA Means',
    body: [
      'Cost per acquisition (CPA) tells you how much ad spend it takes to win one attributed conversion. Marketers use it alongside CPC and conversion volume to judge campaign efficiency.',
    ],
  },
  {
    id: 'cpa-formulas',
    title: 'Formulas',
    body: [
      'First multiply clicks by average CPC for total ad spend. Then divide that spend by attributed conversions for CPA. Results update automatically when inputs are valid.',
    ],
    formula: 'Ad spend = Clicks × CPC\nCPA = Ad spend ÷ Conversions',
  },
  {
    id: 'cpa-example',
    title: 'Example',
    body: [
      '1,000 clicks at PKR 20 CPC and 50 conversions → ad spend PKR 20,000 and CPA PKR 400.',
    ],
  },
];

export function CpaGuideArticle() {
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
        <section id="cpa-faq" className="scroll-mt-24 pt-7">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            Frequently Asked Questions
          </h2>
          <div className="mt-4">
            <FAQAccordion items={[...CPA_FAQS]} />
          </div>
        </section>
      </div>
    </div>
  );
}
