import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { CONVERSION_RATE_FAQS } from './content';

const sections: { id: string; title: string; body: string[]; formula?: string }[] = [
  {
    id: 'what-conversion-rate',
    title: 'What Conversion Rate Means',
    body: [
      'Conversion rate measures how often a click or visit turns into a goal—a signup, purchase, lead, or other defined action. Marketers use it to compare ads, posts, links, and website funnels on a common percentage scale.',
    ],
  },
  {
    id: 'conversion-formula',
    title: 'Formula',
    body: [
      'Divide total conversions by total clicks or visits, then multiply by 100. The calculator updates automatically when both inputs are valid.',
    ],
    formula: 'Conversion rate (%) = (Total conversions ÷ Clicks or visits) × 100',
  },
  {
    id: 'ads-vs-websites',
    title: 'Ads vs Websites',
    body: [
      'Ads, posts or links mode labels the denominator as number of clicks. Websites mode labels it as website visits. The math is the same; only the denominator wording changes.',
    ],
  },
  {
    id: 'conversion-example',
    title: 'Example',
    body: [
      '50 conversions and 1,000 clicks → conversion rate = 5%.',
    ],
  },
];

export function ConversionRateGuideArticle() {
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
        <section id="conversion-rate-faq" className="scroll-mt-24 pt-7">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            Frequently Asked Questions
          </h2>
          <div className="mt-4">
            <FAQAccordion items={CONVERSION_RATE_FAQS} />
          </div>
        </section>
      </div>
    </div>
  );
}
