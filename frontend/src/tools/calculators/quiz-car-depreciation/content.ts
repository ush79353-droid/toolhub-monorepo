import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const QUIZ_CAR_DEPRECIATION_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'about-this-quiz', label: 'About This Quiz' },
  { id: 'scoring-rules', label: 'Scoring Rules' },
  { id: 'depreciation-basics', label: 'Depreciation Basics' },
  { id: 'quiz-faq', label: 'Frequently Asked Questions' },
];

export const QUIZ_CAR_DEPRECIATION_FAQS: readonly FAQItem[] = [
  {
    question: 'Is this a car depreciation calculator?',
    answer:
      'No. This is an educational five-question quiz about common car-depreciation ideas. Use a dedicated depreciation calculator when you need numeric schedules for a specific vehicle.',
  },
  {
    question: 'When is my score shown?',
    answer:
      'The score out of 5 appears only after every question has an answer. Changing any answer recalculates the score immediately. Incomplete quizzes show “Please answer all questions to see your score!”',
  },
  {
    question: 'What does “Show answers and explanations as I go” do?',
    answer:
      'When checked, each question reveals correct/incorrect feedback and a short explanation as soon as you select an answer. When unchecked, explanations stay hidden until you enable the checkbox (score still unlocks only when all five answers are present).',
  },
  {
    question: 'Are the percentages guaranteed for every car?',
    answer:
      'No. Immediate ~9% loss and ~40% residual after 5 years are teaching assumptions used for this quiz’s options—not universal market guarantees. Brand, mileage, condition, and region all change real outcomes.',
  },
];
