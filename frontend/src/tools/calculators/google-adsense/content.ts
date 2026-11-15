import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const ADSENSE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-adsense-estimate', label: 'What Is This Calculator?' },
  { id: 'adsense-formulas', label: 'Formulas' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'adsense-faq', label: 'Frequently Asked Questions' },
];

export const ADSENSE_FAQS: readonly FAQItem[] = [
  {
    question: 'How are AdSense impressions calculated?',
    answer: 'Ad impressions = pageviews × ads per page for the same time period (per day here).',
  },
  {
    question: 'How are clicks calculated?',
    answer: 'Clicks = ad impressions × (CTR ÷ 100). CTR must be between 0% and 100%.',
  },
  {
    question: 'How is AdSense revenue calculated?',
    answer: 'Revenue = number of clicks × cost per click (CPC), shown per day.',
  },
  {
    question: 'Does the currency selector convert amounts?',
    answer:
      'No. It only changes the currency label and grouping. Enter CPC already in the selected currency.',
  },
  {
    question: 'Does this connect to live Google AdSense?',
    answer:
      'No. This is an offline estimate using your inputs. It does not pull live AdSense data.',
  },
];
