import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { YOUTUBE_MONEY_FAQS } from './content';

const sections: { id: string; title: string; body: string[]; formula?: string }[] = [
  {
    id: 'what-youtube-money',
    title: 'What This Calculator Does',
    body: [
      'Estimate YouTube creator revenue from RPM and views. Enter revenue per 1,000 views and a view count for a time period, then read estimated gross and net creator revenue for day, week, month, or year.',
    ],
  },
  {
    id: 'youtube-money-formulas',
    title: 'Formulas',
    body: [
      'Gross revenue scales views into the selected output period, then multiplies by RPM per thousand views. Zero views yields zero revenue. Negative inputs are rejected.',
    ],
    formula: 'Gross Revenue = (Number of Views ÷ 1,000) × RPM',
  },
  {
    id: 'youtube-money-gross-net',
    title: 'Gross vs Net',
    body: [
      'Gross labels the RPM-based estimate. Net shows the same creator estimate because creator RPM already reflects platform revenue sharing. This tool does not subtract an extra 45% (or any other invented share) from RPM.',
    ],
  },
  {
    id: 'youtube-money-example',
    title: 'Example',
    body: [
      'RPM = PKR 200 and views = 50,000 / day → estimated creator revenue = PKR 10,000 / day. Changing the revenue period to month scales that daily rate with 365 ÷ 12.',
    ],
  },
];

export function YoutubeMoneyGuideArticle() {
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
        <section id="youtube-money-faq" className="scroll-mt-24 pt-7">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            Frequently Asked Questions
          </h2>
          <div className="mt-4">
            <FAQAccordion items={YOUTUBE_MONEY_FAQS} />
          </div>
        </section>
      </div>
    </div>
  );
}
