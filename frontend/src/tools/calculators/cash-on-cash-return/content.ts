import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const CASH_ON_CASH_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-cash-on-cash', label: 'What Is Cash-on-Cash Return?' },
  { id: 'how-to-calculate', label: 'How to Calculate Cash-on-Cash Return' },
  { id: 'basic-formula', label: 'Basic Cash-on-Cash Return Formula' },
  { id: 'worked-example', label: 'Cash-on-Cash Return Example' },
  { id: 'how-to-use', label: 'How to Use This Calculator' },
  { id: 'what-is-a-good-return', label: 'What Is a Good Cash-on-Cash Return?' },
  { id: 'coc-vs-cap-rate', label: 'Cash-on-Cash Return vs. Cap Rate' },
  { id: 'coc-vs-roi', label: 'Cash-on-Cash Return vs. ROI' },
  { id: 'factors', label: 'Factors Affecting Cash-on-Cash Return' },
  { id: 'limitations', label: 'Limitations of Cash-on-Cash Return' },
  { id: 'cash-on-cash-faq', label: 'Frequently Asked Questions' },
];

export const CASH_ON_CASH_FAQS: readonly FAQItem[] = [
  {
    question: 'What is a good cash-on-cash return?',
    answer:
      'There is no universal “good” percentage. Acceptable cash-on-cash return depends on local markets, financing, risk tolerance, property type, and whether you also expect appreciation. Compare deals with similar risk rather than chasing a single benchmark.',
  },
  {
    question: 'How do you calculate cash-on-cash return?',
    answer:
      'Cash-on-Cash Return = (Annual Cash Flow / Total Cash Invested) × 100. Annual cash flow is NOI minus annual debt service after vacancy and operating expenses.',
  },
  {
    question: 'Does cash-on-cash return include mortgage payments?',
    answer:
      'Yes, indirectly. Monthly loan payments become annual debt service, which is subtracted from NOI to get annual cash flow. That cash flow is then divided by cash invested.',
  },
  {
    question: 'What is the difference between cap rate and cash-on-cash return?',
    answer:
      'Cap rate = NOI / property value (before debt). Cash-on-cash return = annual cash flow after debt service / cash invested. Cap rate is property-level and unlevered; cash-on-cash reflects your financing and out-of-pocket cash.',
  },
  {
    question: 'Can cash-on-cash return be negative?',
    answer:
      'Yes. If annual cash flow is negative and cash invested is positive, the return is negative — meaning the property is consuming cash after debt service.',
  },
  {
    question: 'Does cash-on-cash return include property appreciation?',
    answer:
      'No. This annual cash-yield metric does not add future price growth, equity from principal paydown, or sale proceeds.',
  },
  {
    question: 'What is considered total cash invested?',
    answer:
      'Typically down payment, closing costs, initial renovations paid in cash, and other upfront out-of-pocket costs. It is not automatically equal to the purchase price.',
  },
  {
    question: 'How does vacancy affect cash-on-cash return?',
    answer:
      'Vacancy reduces effective rental income, which lowers NOI and annual cash flow, which lowers (or worsens) cash-on-cash return.',
  },
  {
    question: 'What is annual debt service?',
    answer:
      'The yearly total of loan payments. This calculator annualizes monthly loan payment × 12.',
  },
  {
    question: 'Is cash-on-cash return the same as ROI?',
    answer:
      'Not necessarily. Cash-on-cash focuses on annual pre-tax cash yield versus cash invested. ROI definitions often include broader gains such as sale proceeds or multi-year totals.',
  },
];
