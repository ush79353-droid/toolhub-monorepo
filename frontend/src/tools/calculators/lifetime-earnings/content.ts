import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const LIFETIME_EARNINGS_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-are-lifetime-earnings', label: 'What are lifetime earnings?' },
  { id: 'how-to-calculate', label: 'How to calculate lifetime earnings' },
  { id: 'why-calculate', label: 'Why calculate average lifetime earnings?' },
  { id: 'related-calculators', label: 'Related calculators' },
  { id: 'lifetime-earnings-faq', label: 'Frequently asked questions' },
];

export const LIFETIME_EARNINGS_FAQS: readonly FAQItem[] = [
  {
    question: "What factors affect one's lifetime earnings?",
    answer:
      'Starting salary, education, experience, industry, promotions, annual raises, years worked, retirement age, employment gaps, and broader economic conditions all influence lifetime gross earnings.',
  },
  {
    question: 'How do I calculate my current salary if I work part-time?',
    answer:
      'Estimate annual pay as Hourly Rate × Weekly Hours × 52. That is a rough gross figure before taxes, unpaid leave, or irregular schedules.',
  },
  {
    question: 'Can my lifetime earnings be negative?',
    answer:
      'Ordinary gross employment earnings are not negative when salary and working years are nonnegative. This calculator does not compute net worth, investment losses, or negative cash flow.',
  },
  {
    question: 'What is life insurance?',
    answer:
      'Life insurance is a contract that can pay a death benefit to beneficiaries under the policy terms. It is separate from estimating lifetime employment earnings.',
  },
  {
    question: 'What is my salary if I work 20 hours per week for $50 per hour?',
    answer:
      'Annual Salary = 50 × 20 × 52 = $52,000, assuming 52 paid working weeks. Actual take-home pay will differ after taxes and unpaid time off.',
  },
];
