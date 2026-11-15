import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const MVA_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-mva', label: 'What Is MVA?' },
  { id: 'mva-formulas', label: 'Formulas' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'mva-faq', label: 'Frequently Asked Questions' },
];

export const MVA_FAQS: readonly FAQItem[] = [
  {
    question: 'What is market value added (MVA)?',
    answer:
      'Market value added (MVA) is the difference between a firm’s current market value of equity and the capital invested. Positive MVA means the market values the firm above invested capital; negative MVA means the opposite.',
  },
  {
    question: 'How is current market value calculated?',
    answer: 'Current market value = current share price × shares outstanding.',
  },
  {
    question: 'How is MVA calculated?',
    answer:
      'MVA = current market value − capital invested. Example: 1,500,000 − 1,000,000 = 500,000.',
  },
  {
    question: 'Can MVA be negative?',
    answer:
      'Yes. If capital invested exceeds current market value, MVA is negative.',
  },
  {
    question: 'Does this calculator include debt or enterprise value?',
    answer:
      'No. This tool follows the share-price × shares-outstanding market-value measure only. It does not add debt or other enterprise-value inputs.',
  },
  {
    question: 'Does the currency selector convert amounts?',
    answer:
      'No. It only changes the currency label and grouping. Enter all money fields already in the selected currency.',
  },
];
