import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { HHI_FAQS } from './content';

const sections: { id: string; title: string; body: string[]; formula?: string }[] = [
  {
    id: 'what-is-hhi',
    title: 'What Is HHI?',
    body: [
      'The Herfindahl-Hirschman Index (HHI) is a common measure of market concentration. Antitrust reviews often use it to summarize how unevenly market share is distributed across firms.',
    ],
  },
  {
    id: 'hhi-formula',
    title: 'Formula',
    body: [
      'Enter each firm’s market share as a percentage from 0 to 100. Square each share and add the squares. Do not convert percentages to decimals before squaring.',
    ],
    formula: 'HHI = Firm₁² + Firm₂² + … + Firmₙ²  (shares in percent)',
  },
  {
    id: 'hhi-example',
    title: 'Example',
    body: [
      'Firm 1 = 40%, Firm 2 = 35%, Firm 3 = 25%. HHI = 40² + 35² + 25² = 1,600 + 1,225 + 625 = 3,450.',
    ],
  },
];

export function HhiGuideArticle() {
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
        <section id="hhi-faq" className="scroll-mt-24 pt-7">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            Frequently Asked Questions
          </h2>
          <div className="mt-4">
            <FAQAccordion items={HHI_FAQS} />
          </div>
        </section>
      </div>
    </div>
  );
}
