import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { BUILD_VS_BUY_FAQS } from './content';

const sections: { id: string; title: string; body: string[]; formula?: string }[] = [
  {
    id: 'what-build-vs-buy',
    title: 'What Build vs Buy Means',
    body: [
      'This calculator compares the annual cost of an external service with the cost to build and maintain equivalent software in-house. It estimates payback years from the upfront build cost and the yearly savings versus buying.',
      'It is a planning sketch, not a full TCO model. It ignores financing, risk, opportunity cost, and product quality differences.',
    ],
  },
  {
    id: 'build-vs-buy-formulas',
    title: 'Formulas',
    body: [
      'Effective monthly employee cost multiplies gross salary by one plus overhead as a percent. Cost to build multiplies headcount, that effective monthly cost, and build duration in months. Annual maintenance scales monthly maintenance days against 22 working days, then annualizes. Annual savings subtracts maintenance from the yearly buy cost. Years to profit divides build cost by annual savings when savings are positive.',
    ],
    formula:
      'Effective monthly = Salary × (1 + Overhead/100); Build cost = Employees × Effective × Months; Annual maintenance = (Maint. days/22) × Effective × 12; Savings = Buy − Maintenance; Years = Build ÷ Savings',
  },
  {
    id: 'assumptions',
    title: 'Assumptions',
    body: [
      'Weeks convert to months with 52 ÷ 12. Days of build and maintenance use 22 working days per month. Currency is denomination-only and does not convert exchange rates.',
    ],
  },
  {
    id: 'how-to-use',
    title: 'How to Use',
    body: [
      'Enter the yearly buy cost, people and time to build, monthly gross salary, overhead percent, and monthly maintenance days. Calculated fields update when inputs are valid. If savings never turn positive, years to profit shows “No payback”.',
    ],
  },
  {
    id: 'build-vs-buy-examples',
    title: 'Example',
    body: [
      'Buy 120,000 / year. One employee, 12 weeks to build, salary 10,000 / month, overhead 25%, one maintenance day per month.',
      'Effective monthly cost = 10,000 × 1.25 = 12,500. Build duration ≈ 12 ÷ (52/12) ≈ 2.769 months. Cost to build ≈ 34,615. Annual maintenance = (1/22) × 12,500 × 12 ≈ 6,818. Annual savings ≈ 113,182. Years to profit ≈ 0.31.',
    ],
  },
];

export function BuildVsBuyGuideArticle() {
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
        <section id="build-vs-buy-faq" className="scroll-mt-24 pt-7">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            Frequently Asked Questions
          </h2>
          <div className="mt-4">
            <FAQAccordion items={BUILD_VS_BUY_FAQS} />
          </div>
        </section>
      </div>
    </div>
  );
}
