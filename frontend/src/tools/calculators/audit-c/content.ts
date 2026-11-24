import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const AUDITC_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'who-can-use', label: 'Who can use the Audit-C calculator?' },
  { id: 'safe-drinking', label: 'How much can I drink safely?' },
  { id: 'how-to-calculate', label: 'How to calculate my Audit-C score?' },
  { id: 'interpretation', label: 'Audit-C score interpretation' },
  {
    id: 'worried',
    label: "I'm worried about my result. Am I an alcoholic?",
  },
  { id: 'full-audit', label: 'AUDIT alcohol screen' },
  { id: 'auditc-faq', label: 'Frequently Asked Questions' },
];

export const AUDITC_FAQS: readonly FAQItem[] = [
  {
    question: 'What is AUDIT-C?',
    answer:
      'AUDIT-C is the three consumption questions from the WHO Alcohol Use Disorders Identification Test. Each item scores 0–4 for a total of 0–12.',
  },
  {
    question: 'What counts as a standard drink?',
    answer:
      'US teaching materials often use about 14 g of pure alcohol per drink (roughly 12 oz beer, 5 oz wine, or 1.5 oz spirits). Use the same definition your clinician uses.',
  },
  {
    question: 'What score is positive?',
    answer:
      'Common VA/WHO teaching cut-points are ≥4 for men and ≥3 for women. A positive screen suggests possible hazardous drinking and needs clinical follow-up — it does not diagnose dependence.',
  },
  {
    question: 'Why is the result blank at first?',
    answer:
      'Sex starts unset and each question starts on Select. Unanswered items are not treated as zero points.',
  },
  {
    question: 'Are my answers stored?',
    answer:
      'No. Answers stay in your browser; share uses the public page URL only — never your responses or score.',
  },
];
