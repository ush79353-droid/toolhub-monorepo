import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const BODY_FRAME_SIZE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Body Frame Size Calculator' },
  { id: 'what-is', label: 'What is body frame size?' },
  { id: 'how', label: 'How the index works' },
  { id: 'thresholds', label: 'Sex-specific thresholds' },
  { id: 'bfs-faq', label: 'Frequently Asked Questions' },
];

export const BODY_FRAME_SIZE_FAQS: readonly FAQItem[] = [
  {
    question: 'How do you calculate body frame size?',
    answer:
      'Divide height by wrist circumference using the same length unit. The resulting index is compared with sex-specific teaching bands for small, medium, or large frame.',
  },
  {
    question: 'What are the female and male thresholds?',
    answer:
      'Female: index >11 small, 10.1–11.0 medium, <10.1 large. Male: >10.4 small, 9.6–10.4 medium, <9.6 large.',
  },
  {
    question: 'How should I measure my wrist?',
    answer:
      'Measure the narrowest part of the wrist with a flexible tape held snug but not compressing the skin. Standing height is measured without shoes.',
  },
  {
    question: 'Are values stored or sent to a server?',
    answer:
      'No. Inputs stay in your browser. Share copies the public page URL only.',
  },
];
