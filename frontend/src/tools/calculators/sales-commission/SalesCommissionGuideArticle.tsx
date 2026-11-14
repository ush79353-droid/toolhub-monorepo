import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { SALES_COMMISSION_FAQS } from './content';

const sections: { id: string; title: string; body: string[] }[] = [
  {
    id: 'what-sales-commission',
    title: 'What Sales Commission Means',
    body: [
      'Sales commission is extra pay linked to selling results. Plans differ on what receives the rate: all revenue, profit after costs, sales above a quota, or sales above a margin-derived threshold. This calculator models one period with a single commission rate.',
    ],
  },
  {
    id: 'commission-bases',
    title: 'Commission Bases',
    body: [
      'Total gross sales applies the rate to revenue. Sales profit applies it to revenue minus COGS, selling expenses, base salary, and discount (before commission). Excess above sales threshold uses a quota you enter. Excess above margin target derives a sales level that covers COGS, selling expenses, and salary at the chosen pre-commission margin. Gross margin and base pay target derives a threshold from those two ratio targets.',
    ],
  },
  {
    id: 'margin-and-base-pay',
    title: 'Gross Margin and Base Pay Target',
    body: [
      'With actual gross-margin rate g, margin target m, and base-pay target b, the threshold is H = (base salary × m) / (b × g). Commission base is max(0, revenue − H). Defaults of 10,000 revenue, 4,000 COGS, 750 salary, 10% base-pay target, and 50% margin target produce H = 6,250 and a 3,750 commission base at a 10% rate.',
    ],
  },
  {
    id: 'profit-metrics',
    title: 'Profit and Margin Metrics',
    body: [
      'Operational cost is labor + selling expenses + discount. Operational profit is gross profit minus that cost. Gross sales margin here is gross profit after discount and selling expenses, before labor. Percentage metrics divide by gross sales; they are omitted when revenue is zero.',
    ],
  },
  {
    id: 'how-to-use',
    title: 'How to Use This Calculator',
    body: [
      'Enter revenue, COGS, selling expenses, discount rate, base salary, and commission rate. Choose a commission base and fill any targets or quota that method needs. Results update live. Reset restores the defaults. Currency only changes display denomination.',
    ],
  },
];

export function SalesCommissionGuideArticle() {
  return (
    <div className="space-y-8">
      {sections.map((section) => (
        <section key={section.id} id={section.id} className="scroll-mt-24">
          <h2 className="text-xl font-semibold tracking-tight text-accent sm:text-2xl">
            {section.title}
          </h2>
          <div className="mt-3 space-y-3 text-sm leading-relaxed text-foreground/90 sm:text-[15px]">
            {section.body.map((paragraph) => (
              <p key={paragraph.slice(0, 40)}>{paragraph}</p>
            ))}
          </div>
        </section>
      ))}
      <section id="sales-commission-faq" className="scroll-mt-24">
        <h2 className="text-xl font-semibold tracking-tight text-accent sm:text-2xl">
          Frequently Asked Questions
        </h2>
        <div className="mt-4">
          <FAQAccordion items={[...SALES_COMMISSION_FAQS]} />
        </div>
      </section>
    </div>
  );
}
