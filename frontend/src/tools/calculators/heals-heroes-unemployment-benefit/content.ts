import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { ANNUAL_SALARY_CALCULATOR_HREF } from './types';

export const HEALS_HEROES_UNEMPLOYMENT_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-were-heals-heroes', label: 'What Were HEALS and HEROES?' },
  { id: 'why-retired', label: 'Why This Calculator Is Retired' },
  { id: 'where-to-go', label: 'Where to Go Next' },
  { id: 'heals-heroes-unemployment-faq', label: 'Frequently Asked Questions' },
];

export const HEALS_HEROES_UNEMPLOYMENT_FAQS: readonly FAQItem[] = [
  {
    question: 'Can I claim HEALS Act or HEROES Act unemployment benefits today?',
    answer:
      'No. Both measures were 2020 legislative proposals. They are not active unemployment benefit programs, and this page does not estimate or process claims.',
  },
  {
    question: 'Were HEALS and HEROES enacted as written?',
    answer:
      'No. The HEROES Act (H.R. 6800) passed the House in May 2020 but was not enacted as the final pandemic relief package. The HEALS Act was a Senate Republican package from July 2020 that also was not enacted as proposed. Later legislation used different terms.',
  },
  {
    question: 'Does this page calculate a weekly unemployment payment?',
    answer:
      'No. The screenshot for this tool is informational only. We do not invent payout amounts, durations, or state-specific eligibility rules for these proposals.',
  },
  {
    question: 'Which calculator should I use instead?',
    answer: `Use the Annual Salary Calculator (${ANNUAL_SALARY_CALCULATOR_HREF}) to convert between hourly wages and yearly salary. Catalog slug annual-income-calculator exists but is not developed yet, so this page links the live Annual Salary Calculator.`,
  },
];
