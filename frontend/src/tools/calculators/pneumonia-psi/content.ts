import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const PSI_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'What is Pneumonia Severity Index?' },
  { id: 'how-to', label: 'How to use the PSI calculator?' },
  { id: 'how-calculate', label: 'How to calculate PSI/PORT' },
  { id: 'psi-faq', label: 'Frequently Asked Questions' },
];

export const PSI_FAQS: readonly FAQItem[] = [
  {
    question: 'What does PSI/PORT measure?',
    answer:
      'The Pneumonia Severity Index estimates mortality risk and risk class for community-acquired pneumonia using age, comorbidities, examination findings, and laboratory abnormalities.',
  },
  {
    question: 'Why is female sex age-adjusted?',
    answer:
      'In the Fine rule, women receive age points equal to age minus ten years (minimum zero); men receive one point per year of age.',
  },
  {
    question: 'When is risk class I assigned?',
    answer:
      'Class I applies when age is under 50 years and none of the listed comorbidities or abnormal findings are present — the early low-risk pathway in the derivation.',
  },
  {
    question: 'Are my entries stored?',
    answer: 'No. Values stay in the browser; share uses the public page URL only.',
  },
];