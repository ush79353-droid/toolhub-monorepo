import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { ARM_FAQS } from './content';

const sections: { id: string; title: string; body: string[] }[] = [
  {
    id: 'what-is-arm-calculator',
    title: 'What Is an ARM Mortgage Calculator?',
    body: [
      'An ARM mortgage calculator estimates the principal-and-interest payment during the initial fixed period and then shows how that payment can change when the rate resets. It is a planning worksheet, not a rate lock or a prediction of future indexes.',
      'Omega Calculators runs the schedule in your browser. Currency selection changes symbols and formatting only. It does not convert amounts with exchange rates.',
    ],
  },
  {
    id: 'what-is-an-arm',
    title: 'What Is an Adjustable-Rate Mortgage?',
    body: [
      'An adjustable-rate mortgage starts with a note rate that holds for a set number of years. After that introductory window, the rate can move on a published schedule. The new payment is based on whatever balance is still owed and how many payments remain.',
    ],
  },
  {
    id: 'how-arm-works',
    title: 'How Does an ARM Mortgage Work?',
    body: [
      'During the fixed period the calculator uses ordinary amortization. At each reset it applies your assumed target rate, then the initial or periodic increase cap, the lifetime ceiling, and any floor you entered. The payment is recomputed from the current balance. The term does not start over.',
    ],
  },
  {
    id: 'arm-types',
    title: 'ARM Mortgage Types',
    body: [
      'A 3/1, 5/1, 7/1, or 10/1 ARM is fixed for 3, 5, 7, or 10 years and then may adjust every 12 months. A 5/6, 7/6, or 10/6 ARM uses the same fixed years, then adjusts every 6 months. The second number is the adjustment interval, not extra years of term.',
    ],
  },
  {
    id: 'arm-caps',
    title: 'ARM Interest Rate Caps',
    body: [
      'The initial cap limits how much the rate may rise at the first reset. The subsequent cap limits later increases. The lifetime cap limits how far the rate may climb above the original note rate. This model does not invent a matching cap on decreases. If you leave the floor blank, the only lower bound is 0%.',
    ],
  },
  {
    id: 'arm-example',
    title: 'How to Calculate ARM Payments',
    body: [
      'For a fully amortizing monthly payment, M = P × r(1+r)^n / ((1+r)^n − 1), where r is the monthly rate and n is the remaining number of months. At 5.5% for 30 years on $250,000, the introductory payment is $1,419.47. If the rate is 0%, the payment is simply the balance divided by the remaining months.',
      'A 5/1 example keeps that payment for 60 months. Payment 61 uses the outstanding balance, 300 months left, and the capped reset rate from your assumption.',
    ],
  },
  {
    id: 'arm-vs-fixed',
    title: 'ARM vs. Fixed-Rate Mortgage',
    body: [
      'A fixed-rate mortgage keeps the same principal-and-interest payment for the full term. An ARM can start lower and then rise or fall. The trade-off is payment certainty versus a possibly lower introductory cost. This page does not recommend one product over the other.',
    ],
  },
  {
    id: 'payment-shock',
    title: 'What Is Payment Shock?',
    body: [
      'Payment shock is a sharp increase in the monthly payment at a reset, usually when the new rate is much higher than the start rate. Caps slow that jump but do not remove it. The “highest modeled P&I” figure shows the largest payment on the path you entered.',
    ],
  },
  {
    id: 'index-and-margin',
    title: 'Indexes and Margins',
    body: [
      'Many notes set the uncapped reset rate as an index plus a lender margin. Indexes differ by contract; this calculator does not claim that every ARM uses SOFR. If you turn on index + margin, that sum is the uncapped target before caps and the floor. It is still a number you supply, not a live market feed.',
    ],
  },
  {
    id: 'how-to-use-arm',
    title: 'How to Use This Calculator',
    body: [
      'Enter the mortgage amount, term, starting rate, and ARM structure. Choose a constant, rising, or falling assumption. Open Advanced ARM settings for caps, an optional floor, and monthly tax, insurance, HOA, or mortgage insurance. Those housing costs are added to the payment display and are never charged interest.',
    ],
  },
];

export function ArmMortgageGuideArticle() {
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
          </article>
        ))}
        <section id="arm-faq" className="scroll-mt-24 pt-7">
          <h2 className="mb-5 text-[21px] font-semibold tracking-tight text-accent sm:text-2xl">
            Frequently Asked Questions
          </h2>
          <FAQAccordion items={[...ARM_FAQS]} />
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
            Educational estimate only. Actual ARM notes vary. Confirm caps, floors, indexes, and rounding with your lender.
          </p>
        </section>
      </div>
    </div>
  );
}
