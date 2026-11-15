import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { FIFO_INVENTORY_FAQS } from './content';

const sections: { id: string; title: string; body: string[]; formula?: string }[] = [
  {
    id: 'what-fifo',
    title: 'What FIFO Means',
    body: [
      'FIFO (first-in, first-out) costs sold units from the earliest purchase batch first. This calculator uses two purchase batches, then compares revenue to FIFO cost of goods sold for gross profit and margin.',
    ],
  },
  {
    id: 'fifo-formulas',
    title: 'Formulas',
    body: [
      'Revenue multiplies units sold by selling price. COGS takes as many units as possible from batch 1, then fills the remainder from batch 2. Gross profit is revenue minus COGS; margin is profit ÷ revenue when revenue is positive.',
    ],
    formula:
      'Revenue = Units sold × Selling price\nFIFO COGS = units from batch 1 × price 1 + units from batch 2 × price 2\nGross profit = Revenue − FIFO COGS\nGross margin % = (Gross profit ÷ Revenue) × 100',
  },
  {
    id: 'fifo-example',
    title: 'Example',
    body: [
      'Buy 100 @ PKR 50 and 100 @ PKR 60, sell 150 @ PKR 80 → revenue PKR 12,000, FIFO COGS PKR 8,000, gross profit PKR 4,000, margin 33.33%.',
    ],
  },
];

export function FifoInventoryGuideArticle() {
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
        <section id="fifo-faq" className="scroll-mt-24 pt-7">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            Frequently Asked Questions
          </h2>
          <div className="mt-4">
            <FAQAccordion items={[...FIFO_INVENTORY_FAQS]} />
          </div>
        </section>
      </div>
    </div>
  );
}
