import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const EVA_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is', label: 'What Is EVA?' },
  { id: 'definition', label: 'Economic Value Added Definition' },
  { id: 'why-matters', label: 'Why Economic Value Added Matters' },
  { id: 'formula', label: 'The EVA Formula' },
  { id: 'how-to-calculate', label: 'How to Calculate EVA' },
  { id: 'nopat', label: 'Understanding NOPAT' },
  { id: 'invested-capital', label: 'What Is Invested Capital?' },
  { id: 'wacc', label: 'What Is WACC?' },
  { id: 'how-ic', label: 'How to Calculate Invested Capital' },
  { id: 'example', label: 'Economic Value Added Calculation Example' },
  { id: 'interpret', label: 'Positive vs Negative EVA' },
  { id: 'importance', label: 'Importance of EVA' },
  { id: 'limitations', label: 'Limitations of EVA' },
  { id: 'vs-roi', label: 'EVA vs ROI' },
  { id: 'how-to-use', label: 'How to Use the EVA Calculator' },
  { id: 'eva-faq', label: 'Frequently Asked Questions' },
];

export const EVA_FAQS: readonly FAQItem[] = [
  {
    question: 'What is Economic Value Added?',
    answer:
      'EVA is economic profit after deducting a capital charge for the funds invested in the business: EVA = NOPAT − (Invested Capital × WACC).',
  },
  {
    question: 'What is the formula for EVA?',
    answer:
      'EVA = NOPAT − (Invested Capital × WACC), with WACC entered as a percent and converted to a decimal for the capital charge.',
  },
  {
    question: 'How do you calculate EVA?',
    answer:
      'Obtain NOPAT and invested capital, find WACC, compute capital charge = IC × WACC, then subtract that charge from NOPAT.',
  },
  {
    question: 'What does positive EVA mean?',
    answer:
      'Operating profit after tax exceeds the calculated capital charge for the period.',
  },
  {
    question: 'What does negative EVA mean?',
    answer:
      'Operating profit after tax falls short of the capital charge implied by invested capital and WACC.',
  },
  {
    question: 'Can EVA be zero?',
    answer:
      'Yes. Zero EVA means NOPAT exactly covers the capital charge.',
  },
  {
    question: 'What is NOPAT?',
    answer:
      'Net operating profit after taxes — after-tax operating profit before financing costs, often approximated as EBIT × (1 − tax rate).',
  },
  {
    question: 'What is WACC?',
    answer:
      'The weighted average cost of capital — the blended required return on the firm’s capital sources, expressed as a percentage.',
  },
  {
    question: 'How do you calculate invested capital?',
    answer:
      'A common operating approach is operating assets minus operating liabilities. Financing approaches and adjustments may also apply.',
  },
  {
    question: 'What is the difference between EVA and ROI?',
    answer:
      'ROI is typically a percentage return on investment. EVA is a monetary residual after charging for the cost of capital.',
  },
  {
    question: 'Is higher EVA always better?',
    answer:
      'Not in isolation. Company size, capital employed, consistency of definitions, and multi-period trends matter.',
  },
  {
    question: 'Why is the cost of capital important?',
    answer:
      'Capital providers require a return. Ignoring that charge can overstate economic performance.',
  },
  {
    question: 'Can a profitable company have negative EVA?',
    answer:
      'Yes. Accounting profit can remain positive while the capital charge still exceeds NOPAT.',
  },
  {
    question: 'Is EVA the same as net income?',
    answer:
      'No. Net income is an accounting earnings figure; EVA subtracts an explicit capital charge from NOPAT.',
  },
  {
    question: 'Why does EVA matter to investors?',
    answer:
      'It highlights whether operating returns exceed the estimated cost of capital and supports capital-efficiency analysis.',
  },
];
