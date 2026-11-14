import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { OMC_FAQS } from './content';

const sections: { id: string; title: string; body: string[]; formula?: string }[] = [
  {
    id: 'what-is-omc',
    title: 'What This Calculator Does',
    body: [
      'Model an online marketing funnel from impressions through customers, then link total spend and revenue to CPM, CPC, cost and revenue per lead or customer, and ROI. Enter any known values; blanks fill when the math allows.',
    ],
  },
  {
    id: 'omc-formula',
    title: 'Formulas',
    body: [
      'Visits, leads, and customers cascade from rates. Cost and revenue metrics divide total spend or revenue by the matching funnel volume. ROI compares revenue to total cost.',
    ],
    formula:
      'Visits = Impressions × CTR/100 · Leads = Visits × Visits-to-leads/100 · Customers = Leads × Leads-to-customers/100 · CPM = Total cost / Impressions × 1000 · ROI% = (Revenue − Total cost) / Total cost × 100',
  },
  {
    id: 'omc-example',
    title: 'Example',
    body: [
      '10,000 impressions at 2% CTR → 200 visits. With 10% visits-to-leads and 25% leads-to-customers → 20 leads and 5 customers. At PKR 10,000 spend and PKR 15,000 revenue → CPM 1,000, CPC 50, ROI 50%.',
    ],
  },
];

export function OnlineMarketingConversionGuideArticle() {
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
        <section id="omc-faq" className="scroll-mt-24 pt-7">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            Frequently Asked Questions
          </h2>
          <div className="mt-4">
            <FAQAccordion items={OMC_FAQS} />
          </div>
        </section>
      </div>
    </div>
  );
}
