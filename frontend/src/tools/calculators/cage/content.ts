import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const CAGE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'stand-for', label: 'What does the CAGE questionnaire stand for?' },
  { id: 'how-to-use', label: 'How to use this alcohol CAGE questionnaire calculator' },
  {
    id: 'interpretation',
    label: 'Alcohol CAGE questionnaire test – results interpretation',
  },
  { id: 'problem-drinking', label: 'Problem drinking' },
  { id: 'cage-faq', label: 'Frequently Asked Questions' },
];

export const CAGE_FAQS: readonly FAQItem[] = [
  {
    question: 'What is CAGE?',
    answer:
      'CAGE is a four-question alcohol screen: Cut down, Annoyed, Guilty, and Eye-opener. Each Yes scores 1 point (total 0–4).',
  },
  {
    question: 'What score is positive?',
    answer:
      'A total of 2 or more Yes answers is the common teaching cutoff suggesting further assessment. A low score cannot exclude a disorder.',
  },
  {
    question: 'Does CAGE diagnose alcoholism?',
    answer:
      'No. It is a brief screen only and does not diagnose alcohol use disorder or measure how much you drink.',
  },
  {
    question: 'Are answers stored?',
    answer:
      'No. Answers stay in your browser; share uses the public page URL only.',
  },
];
