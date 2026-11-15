import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { ROAS_FAQS } from './content';

const sections: { id: string; title: string; body: string[]; formula?: string }[] = [
  {
    id: 'what-roas',
    title: 'What This Calculator Does',
    body: [
      'Estimate return on ad spend from campaign ad spend and attributed ad revenue, with an optional ad-only ROI view that is clearly separate from overall business profit.',
    ],
  },
  {
    id: 'roas-formulas',
    title: 'Formulas',
    body: [
      'ROAS is revenue divided by spend, shown as a percent (and as a multiple). Ad spend must be positive; zero revenue is allowed.',
    ],
    formula:
      'ROAS % = (Ad Revenue ÷ Ad Spend) × 100  |  Ad-only ROI % = ((Ad Revenue − Ad Spend) ÷ Ad Spend) × 100',
  },
  {
    id: 'roas-vs-roi',
    title: 'ROAS vs ROI',
    body: [
      'ROAS compares revenue to ad spend without subtracting cost. Ad-only ROI subtracts ad spend from revenue first. Neither includes product COGS or overhead unless you fold those into your inputs yourself.',
    ],
  },
  {
    id: 'roas-example',
    title: 'Example',
    body: [
      'Ad spend PKR 10,000 and ad revenue PKR 40,000 → ROAS 400% (4×). Ad-only ROI = 300%.',
    ],
  },
];

export function RoasGuideArticle() {
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
        <section id="roas-faq" className="scroll-mt-24 pt-7">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            Frequently Asked Questions
          </h2>
          <div className="mt-4">
            <FAQAccordion items={ROAS_FAQS} />
          </div>
        </section>
      </div>
    </div>
  );
}
