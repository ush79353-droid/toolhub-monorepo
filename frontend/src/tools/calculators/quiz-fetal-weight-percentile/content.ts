import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const QUIZ_FETAL_WEIGHT_PERCENTILE_TOC_ITEMS: readonly TableOfContentsItem[] =
  [
    { id: 'introduction', label: 'Quiz: Fetal Weight Percentile' },
    { id: 'how-to', label: 'How to Take the Quiz' },
    { id: 'topics', label: 'What the Questions Cover' },
    { id: 'limits', label: 'Limits & Safety' },
    { id: 'quiz-fwp-faq', label: 'Frequently Asked Questions' },
  ];

export const QUIZ_FETAL_WEIGHT_PERCENTILE_FAQS: readonly FAQItem[] = [
  {
    question: 'Is this medical advice?',
    answer:
      'No. It is a five-question educational quiz about fetal weight percentiles and common ultrasound biometry concepts. Clinical decisions belong with a qualified clinician.',
  },
  {
    question: 'When does my score appear?',
    answer:
      'Only after all five questions have an answer. Until then the score field stays blank with a /5 reminder.',
  },
  {
    question: 'What growth standard do the explanations use?',
    answer:
      'Explanations describe general percentile chart semantics and Hadlock-style estimated fetal weight biometry (BPD, HC, AC, FL). Individual clinics may use other charts or formulas.',
  },
  {
    question: 'Does Share send my answers?',
    answer:
      'No. Share/copy uses only the public quiz page URL so selections stay out of share payloads, URLs, and logs.',
  },
];
