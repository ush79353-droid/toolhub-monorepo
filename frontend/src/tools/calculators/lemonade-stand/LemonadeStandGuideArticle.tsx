import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { LEMONADE_STAND_FAQS } from './content';

const sections: { id: string; title: string; body: string[]; formula?: string }[] = [
  {
    id: 'what-lemonade',
    title: 'What This Calculator Does',
    body: [
      'Plan a lemonade stand by combining cup costs, ingredients, optional permit and other costs, then compare selling price to break-even. Optional target profit helps you check whether your plan hits a goal.',
    ],
  },
  {
    id: 'lemonade-formulas',
    title: 'Formulas',
    body: [
      'Total cost sums cups, ingredients, permit, and other costs. Cost per serving and break-even price divide total cost by servings. Profit is revenue minus total cost.',
    ],
    formula:
      'Total cost = Cups + Ingredients + Permit + Other\nCost per serving = Total cost ÷ Servings\nRevenue = Price × Servings\nProfit = Revenue − Total cost',
  },
  {
    id: 'lemonade-example',
    title: 'Example',
    body: [
      '10 servings, cups 20, ingredients 30, no permit → total cost 50, cost per serving 5. At a selling price of 8, profit = 30.',
    ],
  },
];

export function LemonadeStandGuideArticle() {
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
        <section id="lemonade-faq" className="scroll-mt-24 pt-7">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            Frequently Asked Questions
          </h2>
          <div className="mt-4">
            <FAQAccordion items={[...LEMONADE_STAND_FAQS]} />
          </div>
        </section>
      </div>
    </div>
  );
}
