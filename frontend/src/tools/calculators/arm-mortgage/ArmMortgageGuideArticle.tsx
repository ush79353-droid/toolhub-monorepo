import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { ARM_FAQS } from './content';

const sections: { id: string; title: string; body: string[] }[] = [
  {
    id: 'what-is-an-arm',
    title: 'What Is an Adjustable-Rate Mortgage?',
    body: [
      'An adjustable-rate mortgage is a home loan whose interest rate can change after an initial fixed period. During that opening stretch the principal-and-interest payment is calculated like any fully amortizing loan. Afterward, the note rate can move on a schedule written into the contract.',
      'The payment that follows a reset is based on the balance still owed and the months still left. The original loan amount is not used again, and the term does not start over. Omega Calculators runs that schedule in your browser. Choosing a currency changes symbols and formatting only.',
    ],
  },
  {
    id: 'how-arm-works',
    title: 'How Does an ARM Mortgage Work?',
    body: [
      'The loan amount is the home price minus the down payment. The monthly principal-and-interest payment is M = P × r(1+r)^n / ((1+r)^n − 1), where P is the remaining principal, r is the monthly interest rate, and n is the number of payments left. If the rate is 0%, the payment is the remaining balance divided by the remaining months.',
      'At each reset the calculator builds an uncapped target from the index and margin you entered. A rising or falling step, if you chose one, changes that target at later resets. The initial or subsequent cap limits the move. The lifetime increase and decrease caps then keep the rate inside a band around the original note rate. The new payment is solved from the balance at that moment.',
    ],
  },
  {
    id: 'fixed-vs-adjustment',
    title: 'Fixed Period vs. Adjustment Period',
    body: [
      'The fixed period is the opening run of months at the initial rate. Nothing in the index changes that payment. The adjustment period is everything after the first reset date. Resets land on a fixed interval, such as every 12 months or every 6 months.',
      'A longer fixed period delays the first time the payment can change. It does not shorten the overall term. A 7/1 ARM on a 30-year loan is fixed for 7 years and then has 23 years of possible annual resets.',
    ],
  },
  {
    id: 'five-one-vs-five-six',
    title: '5/1 ARM vs. 5/6 ARM',
    body: [
      'Both names start with five years at the initial rate. The second number is the gap between later resets. On a 5/1 ARM that gap is one year, so the first change is at month 61 and the next is at month 73. On a 5/6 ARM the gap is six months, so resets can fall at months 61, 67, 73, and so on.',
      'The same pattern covers 3/1, 7/1, 10/1, 7/6, and 10/6. Custom is for another whole-year fixed period and another monthly interval, as long as the fixed period is not longer than the loan term. More frequent resets mean the caps can be applied more often. They do not, by themselves, make the lifetime ceiling higher.',
    ],
  },
  {
    id: 'index-and-margin',
    title: 'Index and Lender Margin',
    body: [
      'Many notes describe the uncapped reset rate as an index plus a margin. The index is a published reference chosen in the contract. The margin is a spread, in percentage points, that stays with that loan. This page does not assume that every ARM uses the same index, and it does not download a current index value.',
      'You type the index you want to illustrate and the margin from the note. Their sum is the fully indexed assumption before caps. If you expect that sum to climb or fall at later resets, use the step fields. Label those figures as assumptions. A future index is not a fact you can enter in advance.',
    ],
  },
  {
    id: 'arm-caps',
    title: 'Initial, Periodic, and Lifetime Caps',
    body: [
      'The initial adjustment cap is the largest change, up or down, at the first reset. The subsequent cap is the largest change at each later reset. A 2-point initial cap on a 5.5% rate means the first reset can land between 3.5% and 7.5%, before the lifetime band is applied.',
      'The lifetime increase cap is measured from the original note rate, not from the previous reset. A 5-point lifetime increase on a 5.5% start rate stops the rate at 10.5% even if the index plus margin is higher. The lifetime decrease cap stops the rate from falling more than that many points below the start rate, and the rate never goes below 0%.',
      'The results separate those contract limits from the path produced by your index assumption. “Highest projected payment” follows the assumption. “Highest payment if caps bind” is the path where the rate rises as fast as the caps allow. One is a scenario. The other is the ceiling implied by the caps you typed.',
    ],
  },
  {
    id: 'arm-example',
    title: 'ARM Payment Example',
    body: [
      'Take a $250,000 loan with no down payment, a 30-year term, and a 5.5% initial rate. The introductory principal-and-interest payment is $1,419.47. On a 5/1 structure that payment holds for 60 months.',
      'Suppose the assumed index is 4.5% and the margin is 2 percentage points, so the fully indexed rate is 6.5%. With a 2-point initial cap, a 2-point later cap, and a 5-point lifetime increase, 6.5% is inside the first-reset band (3.5% to 7.5%) and under the 10.5% lifetime ceiling. The model then re-amortizes the remaining balance over 300 months at 6.5%. On these inputs that payment is $1,560.75, which is $141.28 more than the introductory payment. If the same caps are hit as fast as they allow, the payment can go higher than that scenario. That higher figure is the contract-cap path, not a forecast.',
    ],
  },
  {
    id: 'advantages-and-risks',
    title: 'Advantages, Risks, and Payment Shock',
    body: [
      'The introductory rate on an ARM is often lower than the rate on a fixed-rate loan of the same term, so the early payment can be smaller. If you sell or refinance before the first reset, you may never pay the later rate. If the index falls, later payments can fall too, down to the periodic cap and the lifetime floor.',
      'The risk is the opposite path. After the fixed period the payment can rise at every reset until the lifetime ceiling. That jump is called payment shock. Caps limit the size of each step and the top rate. They do not keep the payment at the introductory amount. Tax, insurance, and association dues can also change, and this calculator holds those entries constant so you can see the note-rate effect on its own.',
      'A fixed-rate mortgage keeps the same principal-and-interest payment for the whole term. Neither product is automatically cheaper. The comparison depends on how long you keep the loan and what the index does after the fixed period.',
    ],
  },
  {
    id: 'how-to-use-arm',
    title: 'How to Use This Calculator',
    body: [
      'Enter the home price and a down payment as an amount or a percent. The loan amount is the difference. Set the term, the initial rate, and a structure, or choose Custom for another fixed period and adjustment interval. Enter the index and margin you want to assume, then any rising or falling step.',
      'Set the initial cap, the later cap, and the lifetime increase and decrease caps. Optional monthly tax, insurance, HOA, and mortgage insurance are added to the housing payment and are excluded from interest. Results update as you edit. Reset restores the sample loan. Copy Results uses the same figures, including a reminder that later rates are assumptions.',
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
            Educational estimate only. Actual ARM notes vary. Confirm caps, floors, indexes, and rounding with your
            lender.
          </p>
        </section>
      </div>
    </div>
  );
}
