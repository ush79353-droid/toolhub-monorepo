import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { PI_FAQS } from './content';

const sections: { id: string; title: string; body: string[]; formula?: string }[] = [
  {
    id: 'what-is-pi',
    title: 'What Is Profitability Index?',
    body: [
      'The profitability index (PI) ranks projects by how much present value you get per unit of capital invested. It is a relative measure alongside NPV.',
    ],
  },
  {
    id: 'pi-formula',
    title: 'PI Formula',
    body: [
      'Divide the present value of future cash inflows by the initial outlay. Both amounts should use the same currency and discounting basis.',
    ],
    formula: 'Profitability Index (PI) = PV of future cash flow ÷ Initial investment',
  },
  {
    id: 'pi-how-to',
    title: 'How to Use',
    body: [
      'Enter the initial investment and the PV of future cash flows. PI updates automatically. If PV is unknown, estimate it first (this tool does not build a cash-flow schedule).',
    ],
  },
  {
    id: 'pi-interpretation',
    title: 'Interpretation',
    body: [
      'PI > 1 may indicate an attractive investment. PI = 1 is break-even on a PV basis. PI < 1 may indicate an unattractive investment. Always consider risk, capital rationing, and non-financial factors.',
    ],
  },
];

export function ProfitabilityIndexGuideArticle() {
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
        <section id="pi-faq" className="scroll-mt-24 pt-7">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            Frequently Asked Questions
          </h2>
          <div className="mt-4">
            <FAQAccordion items={PI_FAQS} />
          </div>
        </section>
      </div>
    </div>
  );
}
