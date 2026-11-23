import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const HEART_SCORE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'HEART Score Calculator' },
  { id: 'components', label: 'Five HEART Components' },
  { id: 'age-bands', label: 'Age Points' },
  { id: 'troponin', label: 'Troponin Tiers' },
  { id: 'how-to-use', label: 'How to Use' },
  { id: 'example', label: 'Worked Example' },
  { id: 'limits', label: 'Limits and Safety' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'heart-score-faq', label: 'Frequently Asked Questions' },
];

export const HEART_SCORE_FAQS: readonly FAQItem[] = [
  {
    question: 'What does HEART stand for?',
    answer:
      'History, ECG, Age, Risk factors, and initial Troponin — each scored 0, 1, or 2 points for a total of 0–10.',
  },
  {
    question: 'When is the total score shown?',
    answer:
      'The HEART total stays blank until you enter patient age in years. Other fields match the reference layout with published default selections.',
  },
  {
    question: 'How are troponin points assigned?',
    answer:
      'You choose the tier relative to your laboratory upper reference limit: below cutoff (0), between 1 and 3 times the cutoff (1), or greater than 3 times the cutoff (2).',
  },
  {
    question: 'Does this calculator recommend discharge or admission?',
    answer:
      'No. It reports the educational point total and component breakdown only. Clinical disposition requires full assessment beyond a score.',
  },
  {
    question: 'What are the age cutoffs?',
    answer:
      'Under 45 years scores 0; 45 through 64 scores 1; 65 years and older scores 2, consistent with Six et al. and Backus validation papers.',
  },
];