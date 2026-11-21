import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const THUK_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Take Home Pay Calculator UK' },
  { id: 'how-it-works', label: 'How It Works' },
  { id: 'tax-ni', label: 'Income Tax & NI' },
  { id: 'limitations', label: 'Limitations' },
  { id: 'take-home-pay-uk-faq', label: 'Frequently Asked Questions' },
];

export const THUK_FAQS: readonly FAQItem[] = [
  {
    question: 'Which tax years are supported?',
    answer:
      '2024/25, 2025/26, and 2026/27 using HMRC / Scottish Rate bands. Obsolete screenshot years are not offered.',
  },
  {
    question: 'How is Personal Allowance taper handled?',
    answer:
      'Allowance starts at £12,570 and reduces by £1 for every £2 of total income above £100,000, down to zero at £125,140.',
  },
  {
    question: 'Does rental income attract National Insurance?',
    answer:
      'No. Class 1 applies to employment and Class 4 to self-employment profits only.',
  },
  {
    question: 'Are pensions or student loans included?',
    answer:
      'No. This estimate assumes no pension contributions, student loan repayments, or special allowances unless you adjust inputs yourself.',
  },
];
