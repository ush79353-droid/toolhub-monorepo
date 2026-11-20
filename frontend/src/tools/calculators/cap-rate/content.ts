import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const CAP_RATE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-cap-rate', label: 'What Is the Capitalization Rate?' },
  { id: 'what-is-noi', label: 'What Is Net Operating Income?' },
  { id: 'how-to-calculate-cap-rate', label: 'How to Calculate Cap Rate' },
  { id: 'cap-rate-formula', label: 'Cap Rate Formula' },
  { id: 'how-to-use', label: 'How to Use the Cap Rate Calculator' },
  { id: 'what-is-a-good-cap-rate', label: 'What Is a Good Cap Rate?' },
  { id: 'high-vs-low-cap-rate', label: 'High Cap Rate vs. Low Cap Rate' },
  { id: 'cap-rate-and-value', label: 'How Does Cap Rate Affect Property Value?' },
  { id: 'cap-rate-vs-roi', label: 'Cap Rate vs. Return on Investment' },
  { id: 'cap-rate-vs-cash-on-cash', label: 'Cap Rate vs. Cash-on-Cash Return' },
  { id: 'advantages', label: 'Advantages of Using Cap Rate' },
  { id: 'limitations', label: 'Limitations of Cap Rate' },
  { id: 'cap-rate-faq', label: 'Frequently Asked Questions' },
];

export const CAP_RATE_FAQS: readonly FAQItem[] = [
  {
    question: 'What is a cap rate in real estate?',
    answer:
      'Capitalization rate (cap rate) expresses a property’s annual net operating income as a percent of its market value or purchase price. Investors use it to compare income yield across properties on an unlevered basis.',
  },
  {
    question: 'How do you calculate cap rate?',
    answer:
      'Cap Rate = (Annual NOI / Property Value) × 100. Example: $45,000 NOI on a $600,000 property → 7.5%.',
  },
  {
    question: 'What is a good cap rate for rental property?',
    answer:
      'There is no universal “good” cap rate. Acceptable levels depend on location, property type, tenant risk, market liquidity, interest rates, and your strategy. Compare against similar local assets rather than a single global benchmark.',
  },
  {
    question: 'Is a higher cap rate better?',
    answer:
      'A higher cap rate means more current NOI relative to price. That can be attractive for income, but it may also reflect higher risk, weaker locations, or thinner growth expectations. Lower rates can signal stronger demand or perceived stability. Neither is automatically better.',
  },
  {
    question: 'What is the difference between NOI and cap rate?',
    answer:
      'NOI is a currency amount (annual income after vacancy and operating expenses, before debt service). Cap rate is a percentage that relates that NOI to property value.',
  },
  {
    question: 'How do I calculate property value using cap rate?',
    answer:
      'Property Value = NOI / (Cap Rate / 100). Example: $50,000 NOI at an 8% cap rate → $625,000.',
  },
  {
    question: 'What is the cap rate of a $500,000 property with $40,000 NOI?',
    answer: 'Cap Rate = (40,000 / 500,000) × 100 = 8%.',
  },
  {
    question: 'Does cap rate include mortgage payments?',
    answer:
      'No. Standard NOI excludes debt service (principal and interest). Cap rate is therefore an unlevered income yield. Financing effects show up in cash-on-cash return and other levered metrics.',
  },
  {
    question: 'Can a cap rate be negative?',
    answer:
      'Mathematically yes, if NOI is negative and property value is positive. That means operating costs exceed effective income — a warning sign that needs underwriting, not a typical target yield.',
  },
  {
    question: 'What is the difference between cap rate and ROI?',
    answer:
      'Cap rate compares NOI with property value. ROI usually compares profit or cash return with capital invested and may include financing, sale proceeds, or time period effects. They answer different questions and are not interchangeable.',
  },
];
