import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const AUDIT_SCORE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Audit Score Calculator' },
  { id: 'what-is', label: 'What is the Audit alcohol screen?' },
  { id: 'built', label: 'How is the Audit test built?' },
  { id: 'using', label: 'How to use the Audit score calculator' },
  { id: 'interpretation', label: 'Audit test score interpretation' },
  { id: 'audit-faq', label: 'Frequently Asked Questions' },
];

export const AUDIT_SCORE_FAQS: readonly FAQItem[] = [
  {
    question: 'How is the AUDIT scored?',
    answer:
      'Items 1–8 each score 0–4. Items 9–10 score 0, 2, or 4. Total ranges from 0 to 40. Domains: consumption (1–3), dependence (4–6), alcohol-related problems (7–10).',
  },
  {
    question: 'What does a score of 2 mean?',
    answer:
      'In the common WHO banding used here, totals 0–7 suggest low risk / probably no alcohol problem for educational screening — not a clinical clearance.',
  },
  {
    question: 'Does sex change the score points?',
    answer:
      'Point totals are the same for all sexes. Sex is used only for educational AUDIT-C style hints on the consumption domain.',
  },
  {
    question: 'Are answers stored?',
    answer:
      'No. Answers stay in your browser. Share uses the page URL and a score summary only.',
  },
];
