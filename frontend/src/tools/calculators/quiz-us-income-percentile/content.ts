import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const QUIZ_US_INCOME_PERCENTILE_TOC_ITEMS: readonly TableOfContentsItem[] =
  [
    { id: 'about-this-quiz', label: 'About This Quiz' },
    { id: 'what-is-an-income-percentile', label: 'What Is an Income Percentile?' },
    {
      id: 'individual-vs-household-income',
      label: 'Individual vs Household Income',
    },
    { id: 'understanding-income-distribution', label: 'Income Distribution' },
    { id: 'why-income-percentiles-matter', label: 'Why Percentiles Matter' },
    { id: 'scoring-rules', label: 'Scoring Rules' },
    { id: 'quiz-faq', label: 'Frequently Asked Questions' },
  ];

export const QUIZ_US_INCOME_PERCENTILE_FAQS: readonly FAQItem[] = [
  {
    question: 'Is this a US income percentile calculator?',
    answer:
      'No. This tool is an educational multiple-choice quiz about US income percentiles, household income, and income distribution. It does not look up your personal percentile from survey data.',
  },
  {
    question: 'When is my score shown?',
    answer:
      'Select answers for any of the eight questions, then press “Check answers.” Unanswered questions count as incorrect (0 points). You can change answers and check again.',
  },
  {
    question: 'Do the blue hint boxes reveal the correct answer?',
    answer:
      'Hints give a short educational nudge without naming the correct option. Full explanations and correct/incorrect review appear after you check your answers.',
  },
  {
    question: 'How is the score calculated?',
    answer:
      'Each correct answer earns 1 point. Incorrect and unanswered questions earn 0. Maximum score is 8 / 8. Feedback bands cover 0–2, 3–4, 5–6, and 7–8.',
  },
];
