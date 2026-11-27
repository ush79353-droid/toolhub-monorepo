import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const QUIZ_PCR_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'about-this-quiz', label: 'About This Quiz' },
  { id: 'scoring-rules', label: 'Scoring Rules' },
  { id: 'pcr-basics', label: 'PCR Basics' },
  { id: 'quiz-faq', label: 'Frequently Asked Questions' },
];

export const QUIZ_PCR_FAQS: readonly FAQItem[] = [
  {
    question: 'Is this the protein creatinine ratio calculator?',
    answer:
      'No. This is a five-question educational quiz about PCR / UPCR concepts. Use the separate Protein Creatinine Ratio Calculator when you need a numeric ratio from urine protein and creatinine.',
  },
  {
    question: 'When is my score shown?',
    answer:
      'Your score out of 5 appears only after every question has an answer. Incomplete quizzes show “/5” without a leading total.',
  },
  {
    question: 'Does Share send my answers?',
    answer:
      'No. Share/copy uses only the public quiz page URL so selections stay out of share payloads, URLs, and logs.',
  },
  {
    question: 'Is this medical advice?',
    answer:
      'No. The quiz is educational only and cannot replace a clinician’s assessment of kidney health or lab results.',
  },
];
