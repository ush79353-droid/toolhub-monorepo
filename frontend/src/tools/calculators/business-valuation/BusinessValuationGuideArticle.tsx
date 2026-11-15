import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { BUSINESS_VALUATION_FAQS } from './content';

const sections: { id: string; title: string; body: string[]; formula?: string }[] = [
  {
    id: 'what-business-valuation',
    title: 'What Business Valuation Means',
    body: [
      'A business valuation estimate puts a present-day number on a company using one chosen approach. Different methods answer different questions—cash-flow earning power, net assets, listed equity value, or a multiple of a financial metric.',
      'This calculator runs one method at a time with the minimum inputs for that method. It is a planning sketch, not an appraisal or fairness opinion.',
    ],
  },
  {
    id: 'valuation-methods',
    title: 'Valuation Methods',
    body: [
      'Discounted Cash Flow (DCF) discounts a constant annual cash flow over a fixed projection period. Asset-based valuation subtracts liabilities from assets. Market capitalization multiplies share price by shares outstanding. Multiples multiply a financial metric by a chosen multiple.',
    ],
  },
  {
    id: 'dcf-formula',
    title: 'DCF Formula',
    body: [
      'With constant annual cash flow CF, discount rate r (as a decimal), and n years, value is the present value of an ordinary annuity. At r = 0, value is simply CF × n. No terminal value is added.',
    ],
    formula: 'Value = CF × [1 − (1 + r)^(-n)] / r   (r = 0 → Value = CF × n)',
  },
  {
    id: 'other-formulas',
    title: 'Other Formulas',
    body: [
      'Asset-based: Value = Total assets − Total liabilities.',
      'Market capitalization: Value = Share price × Shares outstanding.',
      'Multiples: Value = Financial metric × Valuation multiple.',
    ],
  },
];

export function BusinessValuationGuideArticle() {
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
        <section id="business-valuation-faq" className="scroll-mt-24 pt-7">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            Frequently Asked Questions
          </h2>
          <div className="mt-4">
            <FAQAccordion items={BUSINESS_VALUATION_FAQS} />
          </div>
        </section>
      </div>
    </div>
  );
}
