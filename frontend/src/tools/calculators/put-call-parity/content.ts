import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const PUT_CALL_PARITY_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Put-Call Parity Calculator' },
  { id: 'what-is', label: 'What Is Put–Call Parity?' },
  { id: 'formula', label: 'Put–Call Parity Formula' },
  { id: 'how-to', label: 'How to Calculate' },
  { id: 'how-to-use', label: 'How to Use the Calculator' },
  { id: 'pv-strike', label: 'Present Value of Strike' },
  { id: 'assumptions', label: 'Assumptions' },
  { id: 'limitations', label: 'Limitations' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'put-call-parity-faq', label: 'Frequently Asked Questions' },
];

export const PUT_CALL_PARITY_FAQS: readonly FAQItem[] = [
  {
    question: 'What is put–call parity?',
    answer:
      'Put–call parity is a no-arbitrage relationship between European call and put prices with the same strike and expiration: C + PV(K) = P + S for the non-dividend form using the present value of the strike.',
  },
  {
    question: 'What is the put–call parity formula?',
    answer:
      'C + PV(K) = P + S, where C is the European call price, P the European put price, S the spot, and PV(K) the present value of the strike. Rearrange to solve for any one missing term.',
  },
  {
    question: 'Why enter only three of four values?',
    answer:
      'The identity determines the fourth value once three are known. Entering all four either over-determines the system or requires a consistency check; this tool solves exactly one blank field.',
  },
  {
    question: 'How is PV(K) calculated in the helper?',
    answer:
      'The helper uses continuous compounding PV(K) = K × e^(−rT), matching Black–Scholes-style strike discounting. Enter strike, risk-free rate (%), and time in years or months.',
  },
  {
    question: 'Does this cover American options?',
    answer:
      'No. Classical put–call parity as implemented here applies to European options. Early exercise can break the equality for American puts (and sometimes calls with dividends).',
  },
  {
    question: 'Can currencies differ across fields?',
    answer:
      'Yes. Each money field has an independent currency selector. Amounts convert via stored Phase 2 FX rates before solving; missing rates block conversion rather than falling back to 1:1.',
  },
  {
    question: 'Worked example?',
    answer:
      'With C = 10, PV(K) = 95, S = 100 (same currency): P = C + PV(K) − S = 10 + 95 − 100 = 5.',
  },
  {
    question: 'What if the solved price is negative?',
    answer:
      'A negative solved premium or spot usually means inconsistent inputs or FX mismatches. The calculator rejects negative solved money amounts and asks you to review the three known values.',
  },
];
