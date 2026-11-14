import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const WEBSITE_AD_REVENUE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-website-ad-revenue', label: 'What Is This Calculator?' },
  { id: 'website-ad-revenue-formulas', label: 'Formulas' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'website-ad-revenue-faq', label: 'Frequently Asked Questions' },
];

export const WEBSITE_AD_REVENUE_FAQS: readonly FAQItem[] = [
  {
    question: 'How are page views calculated?',
    answer: 'Page views = visits × page views per visit for the same period.',
  },
  {
    question: 'How is revenue calculated?',
    answer: 'Revenue = (page views ÷ 1,000) × page RPM. Page RPM is revenue per 1,000 page views.',
  },
  {
    question: 'Does the currency selector convert amounts?',
    answer:
      'No. It only changes the currency label and grouping. Enter page RPM already in the selected currency.',
  },
  {
    question: 'Can inputs be blank?',
    answer:
      'Yes. Fields start blank. Incomplete or invalid stages stay blank until enough valid values are entered.',
  },
];
