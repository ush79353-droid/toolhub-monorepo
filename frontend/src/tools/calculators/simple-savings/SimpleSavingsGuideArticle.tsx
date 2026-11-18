import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { SIMPLE_SAVINGS_FAQS } from './content';

const sections: { id: string; title: string; body: string[]; formula?: string }[] = [
  {
    id: 'what-simple-savings-calculator',
    title: 'What This Calculator Does',
    body: [
      'Estimate a future savings balance from an initial deposit, a nominal interest rate or APY, compounding frequency, and optional recurring deposits timed at the beginning or end of each period. Optional inflation and deposit-growth adjustments report purchasing power and escalating contributions.',
    ],
  },
  {
    id: 'simple-savings-formulas',
    title: 'Formulas',
    body: [
      'APY from a nominal annual rate r compounded m times per year is APY = (1 + r/m)^m − 1. When APY is entered, the matching nominal rate is r = m × ((1 + APY)^(1/m) − 1). The balance is updated period-by-period with deposits and compound interest so final balance = initial + additional deposits + interest.',
    ],
    formula: 'APY = (1 + r/m)^m − 1; Final = Initial + Deposits + Interest',
  },
  {
    id: 'simple-savings-example',
    title: 'Example',
    body: [
      'PKR 1,000 initial savings, 1.3% nominal annual rate, monthly compounding, 6 years, and PKR 100 deposited monthly at the beginning of each period produces an APY of about 1.3077%. Final balance equals initial savings plus total additional deposits plus interest earned.',
    ],
  },
];

export function SimpleSavingsGuideArticle() {
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
                <p className="font-mono text-xs font-medium text-accent sm:text-sm">
                  {section.formula}
                </p>
              </div>
            ) : null}
          </article>
        ))}
        <section id="simple-savings-faq" className="scroll-mt-24 pt-7">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            Frequently Asked Questions
          </h2>
          <div className="mt-4">
            <FAQAccordion items={[...SIMPLE_SAVINGS_FAQS]} />
          </div>
        </section>
      </div>
    </div>
  );
}
