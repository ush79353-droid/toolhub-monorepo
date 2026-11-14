import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { PAYBACK_FAQS } from './content';

const sections: { id: string; title: string; body: string[]; formula?: string }[] = [
  {
    id: 'what-payback',
    title: 'What This Calculator Does',
    body: [
      'Estimate how long an initial investment takes to recover from steady or irregular annual cash flows, with optional discounting for time value of money.',
    ],
  },
  {
    id: 'payback-formulas',
    title: 'Formulas',
    body: [
      'Undiscounted steady payback divides investment by annual cash flow. Discounted and irregular cases accumulate yearly (or discounted) cash flows until the unrecovered balance is covered, then add a fractional year.',
    ],
    formula:
      'Payback = Investment ÷ Annual CF  |  Discounted CF_t = CF_t ÷ (1+r)^t  |  Fractional year = unrecovered ÷ recovery-year CF',
  },
  {
    id: 'payback-scenarios',
    title: 'Steady vs Irregular',
    body: [
      'Use Steady cash flow for a constant annual inflow. Use Irregular cash flow for year-by-year amounts (Years 1–5, or 1–10 with Include more years). The two scenarios are never added together.',
    ],
  },
  {
    id: 'payback-example',
    title: 'Example',
    body: [
      'Investment PKR 100,000, annual cash flow PKR 25,000, discount rate 0% → payback 4 years and discounted payback 4 years.',
    ],
  },
];

export function PaybackPeriodGuideArticle() {
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
        <section id="payback-faq" className="scroll-mt-24 pt-7">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            Frequently Asked Questions
          </h2>
          <div className="mt-4">
            <FAQAccordion items={PAYBACK_FAQS} />
          </div>
        </section>
      </div>
    </div>
  );
}
