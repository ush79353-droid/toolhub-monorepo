import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { LERNER_FAQS } from './content';

const sections: { id: string; title: string; body: string[]; formula?: string }[] = [
  {
    id: 'what-is-lerner',
    title: 'What Is the Lerner Index?',
    body: [
      'The Lerner Index summarizes how far price sits above marginal cost as a share of price. Economists use it as a simple indicator of market power for a product or firm.',
    ],
  },
  {
    id: 'lerner-formula',
    title: 'Formula',
    body: [
      'Subtract marginal cost from price, then divide by price. The result is a decimal between theoretical bounds; values near 0 imply little markup, while higher values imply stronger pricing power.',
    ],
    formula: 'Lerner Index = (Price − Marginal cost) ÷ Price',
  },
  {
    id: 'lerner-example',
    title: 'Example',
    body: [
      'Price 100 and marginal cost 60 → Lerner Index = (100 − 60) ÷ 100 = 0.40.',
    ],
  },
];

export function LernerIndexGuideArticle() {
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
        <section id="lerner-faq" className="scroll-mt-24 pt-7">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            Frequently Asked Questions
          </h2>
          <div className="mt-4">
            <FAQAccordion items={LERNER_FAQS} />
          </div>
        </section>
      </div>
    </div>
  );
}
