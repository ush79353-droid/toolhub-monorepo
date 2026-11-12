import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const ARM_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-arm-calculator', label: 'What Is an ARM Mortgage Calculator?' },
  { id: 'what-is-an-arm', label: 'What Is an Adjustable-Rate Mortgage?' },
  { id: 'how-arm-works', label: 'How Does an ARM Mortgage Work?' },
  { id: 'arm-types', label: 'ARM Mortgage Types' },
  { id: 'arm-caps', label: 'ARM Interest Rate Caps' },
  { id: 'arm-example', label: 'How to Calculate ARM Payments' },
  { id: 'arm-vs-fixed', label: 'ARM vs. Fixed-Rate Mortgage' },
  { id: 'payment-shock', label: 'What Is Payment Shock?' },
  { id: 'index-and-margin', label: 'Indexes and Margins' },
  { id: 'how-to-use-arm', label: 'How to Use This Calculator' },
  { id: 'arm-faq', label: 'Frequently Asked Questions' },
];

export const ARM_FAQS: readonly FAQItem[] = [
  {
    question: 'What does ARM mean?',
    answer:
      'ARM means adjustable-rate mortgage. The note rate stays fixed for an initial period, then can change on a set schedule using the contract’s index, margin, and caps.',
  },
  {
    question: 'What is a 5/1 ARM?',
    answer:
      'A 5/1 ARM keeps the starting rate for five years. After that, the rate can adjust once every 12 months. The “1” means one year between adjustments, not one remaining year.',
  },
  {
    question: 'What is a 5/6 ARM?',
    answer:
      'A 5/6 ARM is fixed for five years, then may adjust every six months. The second number is the adjustment interval in months, not years.',
  },
  {
    question: 'Can an ARM rate go down?',
    answer:
      'Yes, if the contract allows and the index plus margin falls. This calculator does not apply a periodic downward cap. An optional rate floor, if you enter one, is the lowest modeled rate.',
  },
  {
    question: 'How often can an ARM adjust?',
    answer:
      'Only on the schedule in the note. Common patterns are every 12 months (the “/1” structures) or every 6 months (the “/6” structures) after the initial fixed period.',
  },
  {
    question: 'What is a lifetime rate cap?',
    answer:
      'It is the maximum the rate may rise above the initial note rate over the life of the loan. A 5 percentage-point lifetime cap on a 5.5% start rate limits the modeled rate to 10.5%.',
  },
  {
    question: 'Is an ARM cheaper than a fixed-rate mortgage?',
    answer:
      'The introductory payment is often lower, but later payments can rise. A fixed-rate loan keeps the same principal-and-interest payment. Neither choice is universally cheaper; it depends on how long you keep the loan and how rates move.',
  },
  {
    question: 'Can my monthly mortgage payment increase?',
    answer:
      'Yes. After the fixed period the payment is recalculated from the remaining balance and remaining term at the new rate. A higher rate raises the payment. That jump is often called payment shock.',
  },
  {
    question: 'How accurate are ARM mortgage projections?',
    answer:
      'The introductory payment follows standard amortization from the numbers you enter. Later payments depend on the rate path you assume. They are illustrations, not forecasts of SOFR or any lender index.',
  },
  {
    question: 'What happens after the initial fixed period?',
    answer:
      'The outstanding balance is re-amortized over the months still left. The original loan term does not restart, and the original principal is not used again.',
  },
];
