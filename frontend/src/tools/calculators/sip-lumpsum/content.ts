import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const SIP_LUMPSUM_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is', label: 'What Is SIP + Lumpsum?' },
  { id: 'formula', label: 'Formulas and Timing' },
  { id: 'how-to', label: 'How to Use This Calculator' },
  { id: 'solve-modes', label: 'Solve Modes' },
  { id: 'inflation', label: 'Inflation Adjustment' },
  { id: 'limitations', label: 'Limitations' },
  { id: 'sip-lumpsum-faq', label: 'Frequently Asked Questions' },
];

export const SIP_LUMPSUM_FAQS: readonly FAQItem[] = [
  {
    question: 'How is the final balance calculated?',
    answer:
      'Final balance = lumpsum grown at the deposit-period rate for n periods, plus the future value of the SIP annuity (beginning or end of each period). The period rate converts the nominal annual return using the selected compounding frequency: i = (1 + r/m)^(m/k) − 1 (or e^(r/k) − 1 for continuous compounding).',
  },
  {
    question: 'What does “At the beginning of periods” mean?',
    answer:
      'Deposits are treated as an annuity due: each SIP installment is applied at the start of the period and therefore earns interest during that period. “At the end of periods” is an ordinary annuity.',
  },
  {
    question: 'Does changing the currency convert my amounts?',
    answer:
      'No. Currency selectors only change symbols and grouping. Amounts are not converted with live exchange rates.',
  },
  {
    question: 'How is inflation handled?',
    answer:
      'When inflation is greater than zero, the tool also reports purchasing power of the final balance as FV / (1 + f)^t, where t is the term in years. The primary final balance remains nominal.',
  },
  {
    question: 'What is “Number of transactions”?',
    answer:
      'It is the number of deposit periods over the term (for example, monthly deposits for 10 years → 120). When the deposit amount is zero, the same period count is still shown for the chosen deposit frequency.',
  },
  {
    question: 'When can solve-for modes fail?',
    answer:
      'A stable numeric solution may not exist for extreme targets (for example, a final balance unreachable with non-positive return and non-positive deposits, or rates outside the solver’s search bounds). The form reports that case instead of showing NaN or Infinity.',
  },
];
